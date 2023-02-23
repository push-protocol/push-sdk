import axios from 'axios';
import { getAPIBaseUrls } from '../helpers';
import Constants from '../constants';
import { AccountEnvOptionsType } from '../types';
import { approveRequestPayload, IApproveRequestPayload } from './helpers';

interface ApproveRequestOptionsType extends AccountEnvOptionsType {
  /**
   * Chat request sender address
   */
  senderAddress: string;
  // privateKey?: string; // private key for signature

  /**
   * Request state. As of now, only `Approved` is allowed
   */
  status?: 'Approved';
  // sigType?: string;
}

/**
 * Approve Chat Request
 */
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
  const connectedUser = await createUserIfNecessary({account,env});
  // TODO: make signature
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/chat/request/accept`;
  const body: IApproveRequestPayload = approveRequestPayload(senderAddress, account, status);
  return axios.put(apiEndpoint, body)
    .catch((err) => {
      console.error(`[Push SDK] - API ${approve.name}: `, err);
      throw Error(`[Push SDK] - API ${approve.name}: ${err}`);
    });
}
