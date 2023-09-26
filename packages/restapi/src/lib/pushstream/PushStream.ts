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

export class PushStream extends EventEmitter {
  private pushChatSocket: any;
  private account: string;
  private raw: boolean;
  private options: PushStreamInitializeProps;

  constructor(account: string, options: PushStreamInitializeProps) {
    super();

    this.account = account;
    this.pushChatSocket = createSocketConnection({
      user: `eip155:${account}`,
      socketType: 'chat',
      socketOptions: {
        autoConnect: options.connection?.auto ?? true,
        reconnectionAttempts: options.connection?.retries ?? 3,
      },
      env: options.env as ENV,
    });

    if (!this.pushChatSocket) {
      throw new Error('Push chat socket not connected');
    } else {
      console.log('Push socket connected ' + `eip155:${account}`);
    }

    this.raw = options.raw ?? false;
    this.options = options;
  }

  static async initialize(
    account: string,
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

    const stream = new PushStream(account, settings);
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
    });

    this.pushChatSocket.on(EVENTS.CHAT_RECEIVED_MESSAGE, (data: any) => {
      const modifiedData = DataModifier.handleChatEvent(data, this.raw);
      modifiedData.event = this.convertToProposedName(modifiedData.event);
      this.handleToField(modifiedData);
      if (this.shouldEmitChat(data.chatId)) {
        if (shouldEmit(STREAM.CHAT)) {
          this.emit(STREAM.CHAT, modifiedData);
        }
      }
    });
  }
}
