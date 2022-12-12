export type SocketInputOptions = {
  user: string,
  env: string,
  socketType: 'notification' | 'chat',
  apiKey?: string,
  socketOptions?: SocketOptions
};

export type SocketOptions = {
  autoConnect: boolean,
  reconnectionAttempts: number
}

/**
 * TODO define types for 
 * 
 * ServerToClientEvents
 * ClientToServerEvents
 * SocketData
 * 
 * like https://socket.io/docs/v4/typescript/
 */
