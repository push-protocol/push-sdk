import { io } from 'socket.io-client';
import { API_BASE_URL } from '../config';
import { getCAIPAddress, walletToPCAIP10 } from '../helpers';
import { SocketInputOptions } from './pushStreamTypes';

export async function createSocketConnection({
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

  let pushWSUrl = API_BASE_URL[env];

  if (pushWSUrl.endsWith('/apis')) {
    pushWSUrl = pushWSUrl.substring(0, pushWSUrl.length - 5);
  }
  const transports = ['websocket'];

  let pushSocket = null;

  try {
    const userAddressInCAIP =
      socketType === 'chat'
        ? walletToPCAIP10(user)
        : await getCAIPAddress(env, user, 'User');

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
