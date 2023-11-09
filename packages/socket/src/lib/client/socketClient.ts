import { io } from 'socket.io-client';
import { API_URLS } from '../config';
import { getCAIPAddress, walletToPCAIP10 } from '../helpers';
import { SocketInputOptions } from '../types';

export function createSocketConnection({
  user,
  env,
  socketType = 'notification',
  apiKey,
  socketOptions,
}: SocketInputOptions) {
  const {
    autoConnect = true,
    reconnectionAttempts = 5,
    reconnectionDelay,
    reconnectionDelayMax,
  } = socketOptions || {};

  const pushWSUrl = API_URLS[env];

  const transports = ['websocket'];
  let pushSocket: ReturnType<typeof io> | null = null;

  try {
    const userAddressInCAIP =
      socketType === 'chat'
        ? walletToPCAIP10(user)
        : getCAIPAddress(env, user, 'User');
    let query;
    if (socketType === 'notification') query = { address: userAddressInCAIP };
    else query = { mode: 'chat', did: userAddressInCAIP };

    // Build options object
    const options = {
      transports,
      query,
      autoConnect,
      reconnectionAttempts,
      ...(reconnectionDelay !== undefined && { reconnectionDelay }),
      ...(reconnectionDelayMax !== undefined && { reconnectionDelayMax }),
    };

    pushSocket = io(pushWSUrl, options);
  } catch (e) {
    console.error('[PUSH-SDK] - Socket connection error: ');
    console.error(e);
  } finally {
    // eslint-disable-next-line no-unsafe-finally
    return pushSocket;
  }
}
