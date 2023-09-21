import { EventEmitter } from 'events';
import { createSocketConnection, EVENTS } from '@pushprotocol/socket';
import { ENV } from '../constants';
import { PushStreamInitializeProps, STREAM } from './pushStreamTypes';
import { DataModifier } from './DataModifier';

export class PushStream extends EventEmitter {
  private pushChatSocket: any;
  private account: string;
  private raw: boolean;

  private constructor(account: string, options: PushStreamInitializeProps) {
    super();

    this.account = account;
    this.pushChatSocket = createSocketConnection({
      user: `eip155:${account}`,
      socketType: 'chat',
      socketOptions: {
        autoConnect: options.connection?.auto ?? true,
        reconnectionAttempts: options.connection?.retries ?? 3,
      },
      env: options.env,
    });

    if (!this.pushChatSocket) {
      throw new Error('Push chat socket not connected');
    } else {
      console.log('Push socket connected');
    }

    this.raw = options.raw ?? false;
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

  public async init(): Promise<void> {
    this.pushChatSocket.on(EVENTS.CHAT_GROUPS, (data: any) => {
      const modifiedData = DataModifier.handleChatGroupEvent(data, this.raw);
      this.emit(STREAM.CHAT_OPS, modifiedData);
    });

    this.pushChatSocket.on(EVENTS.CHAT_RECEIVED_MESSAGE, (data: any) => {
      const modifiedData = DataModifier.handleChatEvent(data, this.raw);
      this.emit(STREAM.CHAT, modifiedData);
    });
  }
}
