import { io } from 'socket.io-client';
import { API_URLS } from '../config';
import { getCAIPAddress } from '../helpers';
import { SocketInputOptions } from '../types';

export function createSocketConnection({
  user,
  env,
  socketOptions
}: SocketInputOptions
) {
    const {
      autoConnect = true,
      reconnectionAttempts = 5,
    } = socketOptions || {};
    const epnsWSUrl = API_URLS[env];
    const transports = ['websocket'];

    let epnsSocket = null;  
  
  
    try {
      const userAddressInCAIP = getCAIPAddress(env, user, 'User');
      // the backend only accepts CAIP
      const query = { address: userAddressInCAIP };

      epnsSocket = io(epnsWSUrl, {
        transports,
        query,
        autoConnect,
        reconnectionAttempts,
      });
  
    } catch (e) {
      console.error('[EPNS-SDK] - Socket connection error: ');
      console.error(e);
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      return epnsSocket;
    }
}