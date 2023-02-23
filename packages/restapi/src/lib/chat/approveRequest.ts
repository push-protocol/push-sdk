import axios from 'axios';
import { getAPIBaseUrls } from '../helpers';
import Constants from '../constants';
import { EnvOptionsType, IConnectedUser, SignerType } from '../types';
import { approveRequestPayload, getAccountAddress, getConnectedUser, getWallet, IApproveRequestPayload } from './helpers';

interface ApproveRequestOptionsType extends EnvOptionsType {
  /**
   * Chat request sender address
   */
  senderAddress: string;
  privateKey?: string; // private key for signature

  /**
   * Request state. As of now, only `Approved` is allowed
   */
  status?: 'Approved';
  // sigType?: string;
  account?: string;
  signer?: SignerType;
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
    privateKey = null,
    account = null,
    signer = null,
    senderAddress,
    env = Constants.ENV.PROD,
  } = options || {};

  if(account == null && signer == null) {
    throw new Error(`At least one from account or signer is necessary!`);
  }

  const wallet = getWallet({ account, signer });
  const address = await getAccountAddress(wallet);

  // get user with raw privateKey
  const createdUser: IConnectedUser = await getConnectedUser(wallet, privateKey, env);
  // const connectedUser = await createUserIfNecessary({account,env});
  // TODO: make signature
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/chat/request/accept`;
  const body: IApproveRequestPayload = approveRequestPayload(senderAddress, address, status);
  return axios.put(apiEndpoint, body)
    .catch((err) => {
      console.error(`[Push SDK] - API ${approve.name}: `, err);
      throw Error(`[Push SDK] - API ${approve.name}: ${err}`);
    });
}
