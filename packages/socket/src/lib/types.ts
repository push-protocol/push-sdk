import { ENV } from './constants';

export type SocketInputOptions = {
  user: string;
  env: ENV;
  socketType?: 'notification' | 'chat';
  apiKey?: string;
  socketOptions?: SocketOptions;
};

export type SocketOptions = {
  autoConnect: boolean;
  reconnectionAttempts?: number;
  reconnectionDelayMax?: number;
  reconnectionDelay?: number;
};

/**
 * TODO define types for
 *
 *
 * ServerToClientEvents
 * ClientToServerEvents
 * SocketData
 *
 * like https://socket.io/docs/v4/typescript/
 */
