import { io } from 'socket.io-client';
import { API_BASE_URL } from '../config';
import { getCAIPAddress, walletToPCAIP10 } from '../helpers';
import { SocketInputOptions } from './pushStreamTypes';

export function createSocketConnection({
  user,
  env,
  socketType = 'notification',
  socketOptions,
}: SocketInputOptions) {
  const {
    autoConnect = true,
    reconnectionAttempts = 5,
    reconnectionDelay,
    reconnectionDelayMax,
  } = socketOptions || {};

  const pushWSUrl = API_BASE_URL[env];
  const transports = ['websocket'];

  let pushSocket = null;

  try {
    const userAddressInCAIP =
      socketType === 'chat'
        ? walletToPCAIP10(user)
        : getCAIPAddress(env, user, 'User');

    const query =
      socketType === 'notification'
        ? { address: userAddressInCAIP }
        : { mode: 'chat', did: userAddressInCAIP };

    pushSocket = io(pushWSUrl, {
      transports,
      query,
      autoConnect,
      reconnectionAttempts,
      ...(reconnectionDelay !== undefined && { reconnectionDelay }),
      ...(reconnectionDelayMax !== undefined && { reconnectionDelayMax }),
    });
  } catch (e) {
    console.error('[PUSH-SDK] - Socket connection error: ', e);
  }

  return pushSocket;
}
