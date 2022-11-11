import axios from 'axios';
import {
  getAPIBaseUrls, walletToPCAIP10,
} from '../helpers';
import Constants from '../constants';
import { AccountEnvOptionsType } from '../types';
import { createUserIfNecessary } from './helpers';

/**
 *  POST '/v1/chat/request/accept
 */

interface ApproveRequestOptionsType extends AccountEnvOptionsType {
  senderAddress: string; // chat request sender address
  // privateKey?: string; // private key for signature
  status?: 'Approved';
  // sigType?: string;
}

export const approve = async (
  options: ApproveRequestOptionsType
) => {
  const {
    status = "Approved",
    // sigType = 'sigType',
    // privateKey = null,
    account,
    senderAddress,
    env = Constants.ENV.PROD,
  } = options || {};

  // get user with raw privateKey
  // const createdUser: IConnectedUser = await getConnectedUser(account, privateKey, env);

  // TODO: make signature
  const signature = '1';
  const connectedUser = await createUserIfNecessary({account,env});
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/chat/request/accept`;

  const requestUrl = `${apiEndpoint}`;

  const body = {
    fromDID: walletToPCAIP10(senderAddress),
    toDID: walletToPCAIP10(account),
    signature,
    status,
    sigType:'sigType',
  };

  return axios.put(requestUrl, body)
    .catch((err) => {
      console.error(`[EPNS-SDK] - API ${requestUrl}: `, err);
      throw Error(`[EPNS-SDK] - API ${requestUrl}: ${err}`);
    });
}
