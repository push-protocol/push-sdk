import { EventEmitter } from 'events';
import { createSocketConnection, EVENTS } from '@pushprotocol/socket';
import { ENV } from '../constants';
import { PushStreamInitializeProps } from './pushStreamTypes';

export class PushStream extends EventEmitter {
  private pushChatSocket: any;
  private account: string;

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
    }

    const raw = options.raw ?? false;
    this.pushChatSocket.on(EVENTS.CHAT_GROUPS, (data: any) => {
      const modifiedData = raw ? data : this.modifyDataForSpecificEvent(data);
      this.emit(EVENTS.CHAT_GROUPS, modifiedData);
    });
  }

  private modifyDataForSpecificEvent(data: any): any {
    return data;
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

    return new PushStream(account, settings);
  }
}
