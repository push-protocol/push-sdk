import { EventEmitter } from 'events';
import { createSocketConnection, EVENTS } from '@pushprotocol/socket';
import { ENV } from '../constants';
import {
  GroupEventType,
  MessageEventType,
  NotificationEventType,
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

    if (settings.connection?.auto) {
      await stream.connect();
    }
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
    if (
      !this.options.filter?.chats ||
      this.options.filter.chats.length === 0 ||
      this.options.filter.chats.includes('*')
    ) {
      return true;
    }
    return this.options.filter.chats.includes(dataChatId);
  }

  private shouldEmitChannel(dataChannelId: string): boolean {
    if (
      !this.options.filter?.channels ||
      this.options.filter.channels.length === 0 ||
      this.options.filter.channels.includes('*')
    ) {
      return true;
    }
    return this.options.filter.channels.includes(dataChannelId);
  }

  public async connect(): Promise<void> {
    const shouldInitializeChatSocket =
      !this.options?.listen ||
      this.options.listen.length === 0 ||
      this.options.listen.includes(STREAM.CHAT) ||
      this.options.listen.includes(STREAM.CHAT_OPS);
    const shouldInitializeNotifSocket =
      !this.options?.listen ||
      this.options.listen.length === 0 ||
      this.options.listen.includes(STREAM.NOTIF) ||
      this.options.listen.includes(STREAM.NOTIF_OPS);

    if (shouldInitializeChatSocket && !this.pushChatSocket) {
      this.pushChatSocket = createSocketConnection({
        user: walletToPCAIP10(this.account),
        socketType: 'chat',
        socketOptions: {
          autoConnect: true,
          reconnectionAttempts: this.options?.connection?.retries ?? 3,
        },
        env: this.options?.env as ENV,
      });

      if (!this.pushChatSocket) {
        throw new Error('Push chat socket not connected');
      }
    } 

    if (shouldInitializeNotifSocket && !this.pushNotificationSocket) {
      this.pushNotificationSocket = createSocketConnection({
        user: pCAIP10ToWallet(this.account),
        env: this.options?.env as ENV,
        socketOptions: {
          autoConnect: true,
          reconnectionAttempts: this.options?.connection?.retries ?? 3,
        },
      });

      if (!this.pushNotificationSocket) {
        throw new Error('Push notification socket not connected');
      }
    }

    const shouldEmit = (eventType: STREAM): boolean => {
      if (!this.options.listen || this.options.listen.length === 0) {
        return true;
      }
      return this.options.listen.includes(eventType);
    };

    if (this.pushChatSocket) {
      this.pushChatSocket.on(EVENTS.CHAT_GROUPS, (data: any) => {
        try {
          console.log(data);
          const modifiedData = DataModifier.handleChatGroupEvent(
            data,
            this.raw
          );
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
          console.error(
            'Error handling CHAT_GROUPS event:',
            error,
            'Data:',
            data
          );
        }
      });

      this.pushChatSocket.on(
        EVENTS.CHAT_RECEIVED_MESSAGE,
        async (data: any) => {
          try {
            if (
              data.messageCategory == 'Chat' ||
              data.messageCategory == 'Request'
            ) {
              data = await this.chatInstance.decrypt([data]);
              data = data[0];
            }

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
        }
      );
    }

    if (this.pushNotificationSocket) {
      this.pushNotificationSocket.on(EVENTS.USER_FEEDS, (data: any) => {
        try {
          const modifiedData = DataModifier.mapToNotificationEvent(
            data,
            NotificationEventType.INBOX,
            this.account === data.sender ? 'self' : 'other',
            this.raw
          );

          if (this.shouldEmitChannel(modifiedData.from)) {
            if (shouldEmit(STREAM.NOTIF)) {
              this.emit(STREAM.NOTIF, modifiedData);
            }
          }
        } catch (error) {
          console.error(
            'Error handling USER_FEEDS event:',
            error,
            'Data:',
            data
          );
        }
      });

      this.pushNotificationSocket.on(EVENTS.USER_SPAM_FEEDS, (data: any) => {
        try {
          const modifiedData = DataModifier.mapToNotificationEvent(
            data,
            NotificationEventType.SPAM,
            this.account === data.sender ? 'self' : 'other',
            this.raw
          );
          modifiedData.origin =
            this.account === modifiedData.from ? 'self' : 'other';
          if (this.shouldEmitChannel(modifiedData.from)) {
            if (shouldEmit(STREAM.NOTIF)) {
              this.emit(STREAM.NOTIF, modifiedData);
            }
          }
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

  public async disconnect(): Promise<void> {
    // Disconnect push chat socket if connected
    if (this.pushChatSocket) {
      this.pushChatSocket.disconnect();
      this.pushChatSocket = null;
      console.log('Push chat socket disconnected.');
    } else {
      console.log('Push chat socket was not connected.');
    }

    // Disconnect push notification socket if connected
    if (this.pushNotificationSocket) {
      this.pushNotificationSocket.disconnect();
      this.pushNotificationSocket = null;
      console.log('Push notification socket disconnected.');
    } else {
      console.log('Push notification socket was not connected.');
    }
  }
}
