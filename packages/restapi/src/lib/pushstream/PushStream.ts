import { EventEmitter } from 'events';
import { createSocketConnection, EVENTS } from '@pushprotocol/socket';
import { ENV } from '../constants';
import {
  GroupEventType,
  MessageEventType,
  ProposedEventNames,
  PushStreamInitializeProps,
  STREAM,
} from './pushStreamTypes';
import { DataModifier } from './DataModifier';
import { pCAIP10ToWallet, walletToPCAIP10 } from '../helpers';
import { Chat } from '../pushapi/chat';
import { ProgressHookType, SignerType } from '../types';

export class PushStream extends EventEmitter {
  private pushChatSocket: any;
  private pushNotificationSocket: any;

  private account: string;
  private raw: boolean;
  private options: PushStreamInitializeProps;
  private chatInstance: Chat;

  constructor(
    account: string,
    private decryptedPgpPvtKey: string,
    private signer: SignerType,
    options: PushStreamInitializeProps,
    private progressHook?: (progress: ProgressHookType) => void
  ) {
    super();

    this.account = account;
    this.pushChatSocket = createSocketConnection({
      user: walletToPCAIP10(account),
      socketType: 'chat',
      socketOptions: {
        autoConnect: options.connection?.auto ?? true,
        reconnectionAttempts: options.connection?.retries ?? 3,
      },
      env: options.env as ENV,
    });

    this.pushNotificationSocket = createSocketConnection({
      user: pCAIP10ToWallet(this.account),
      env: options.env as ENV,
      socketOptions: {
        autoConnect: options.connection?.auto ?? true,
        reconnectionAttempts: options.connection?.retries ?? 3,
      },
    });

    if (!this.pushNotificationSocket) {
      throw new Error('Push notification socket not connected');
    } 

    if (!this.pushChatSocket) {
      throw new Error('Push chat socket not connected');
    } 

    this.raw = options.raw ?? false;
    this.options = options;

    this.chatInstance = new Chat(
      this.account,
      this.decryptedPgpPvtKey,
      this.options.env as ENV,
      this.signer,
      this.progressHook
    );
  }

  static async initialize(
    account: string,
    decryptedPgpPvtKey: string,
    signer: SignerType,
    progressHook?: (progress: ProgressHookType) => void,
    options?: PushStreamInitializeProps
  ): Promise<PushStream> {
    const defaultOptions: PushStreamInitializeProps = {
      listen: [],
      env: ENV.LOCAL,
      raw: false,
      connection: {
        auto: true,
        retries: 3,
      },
    };

    const settings = {
      ...defaultOptions,
      ...options,
    };

    const stream = new PushStream(
      account,
      decryptedPgpPvtKey,
      signer,
      settings,
      progressHook
    );
    await stream.init();
    return stream;
  }

  private convertToProposedName(currentEventName: string): ProposedEventNames {
    switch (currentEventName) {
      case 'message':
        return ProposedEventNames.Message;
      case 'request':
        return ProposedEventNames.Request;
      case 'accept':
        return ProposedEventNames.Accept;
      case 'reject':
        return ProposedEventNames.Reject;
      case 'leaveGroup':
        return ProposedEventNames.LeaveGroup;
      case 'joinGroup':
        return ProposedEventNames.JoinGroup;
      case 'createGroup':
        return ProposedEventNames.CreateGroup;
      case 'updateGroup':
        return ProposedEventNames.UpdateGroup;
      case 'remove':
        return ProposedEventNames.Remove;
      default:
        throw new Error(`Unknown current event name: ${currentEventName}`);
    }
  }

  private handleToField(data: any): void {
    switch (data.event) {
      case ProposedEventNames.LeaveGroup:
      case ProposedEventNames.JoinGroup:
        data.to = null;
        break;

      case ProposedEventNames.Accept:
      case ProposedEventNames.Reject:
        if (data.meta?.group) {
          data.to = null;
        }
        break;

      default:
        break;
    }
  }

  private shouldEmitChat(dataChatId: string): boolean {
    if (!this.options.filter?.chats || this.options.filter.chats.length === 0) {
      return true;
    }
    return this.options.filter.chats.includes(dataChatId);
  }

  public async init(): Promise<void> {
    const shouldEmit = (eventType: STREAM): boolean => {
      if (!this.options.listen || this.options.listen.length === 0) {
        return true;
      }
      return this.options.listen.includes(eventType);
    };

    this.pushChatSocket.on(EVENTS.CHAT_GROUPS, (data: any) => {
       try {
         const modifiedData = DataModifier.handleChatGroupEvent(data, this.raw);
         modifiedData.event = this.convertToProposedName(modifiedData.event);
         this.handleToField(modifiedData);
         if (this.shouldEmitChat(data.chatId)) {
           if (
             data.eventType === GroupEventType.JoinGroup ||
             data.eventType === GroupEventType.LeaveGroup ||
             data.eventType === MessageEventType.Request ||
             data.eventType === GroupEventType.Remove
           ) {
             if (shouldEmit(STREAM.CHAT)) {
               this.emit(STREAM.CHAT, modifiedData);
             }
           } else {
             if (shouldEmit(STREAM.CHAT_OPS)) {
               this.emit(STREAM.CHAT_OPS, modifiedData);
             }
           }
         }
       } catch (error) {
         console.error('Error handling CHAT_GROUPS event:', error, 'Data:', data);
       }
    });

    this.pushChatSocket.on(EVENTS.CHAT_RECEIVED_MESSAGE, async (data: any) => {
        try {
          if (
            data.messageCategory == 'Chat' ||
            data.messageCategory == 'Request'
          ) {
            data = await this.chatInstance.decrypt([data]);
            data = data[0]
          }
          console.log("Hola")
          console.log(data);

          const modifiedData = DataModifier.handleChatEvent(data, this.raw);
          modifiedData.event = this.convertToProposedName(modifiedData.event);
          this.handleToField(modifiedData);
          if (this.shouldEmitChat(data.chatId)) {
            if (shouldEmit(STREAM.CHAT)) {
              this.emit(STREAM.CHAT, modifiedData);
            }
          }
        } catch (error) {
          console.error(
            'Error handling CHAT_RECEIVED_MESSAGE event:',
            error,
            'Data:',
            data
          );
        }
    });

    this.pushNotificationSocket.on(EVENTS.USER_FEEDS, (data: any) => {
      try {
        console.log('Incoming Feed from Socket');
        console.log(data);
        this.emit(STREAM.NOTIF, data);
      } catch (error) {
        console.error('Error handling USER_FEEDS event:', error, 'Data:', data);
      }
    });

    this.pushNotificationSocket.on(EVENTS.USER_SPAM_FEEDS, (data: any) => {
       try {
         console.log('Incoming Spam Feed from Socket');
         console.log(data);
         this.emit(STREAM.NOTIF, data);
       } catch (error) {
         console.error(
           'Error handling USER_SPAM_FEEDS event:',
           error,
           'Data:',
           data
         );
       }
    });
  }
}
