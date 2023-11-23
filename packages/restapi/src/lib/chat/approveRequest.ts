import { getAPIBaseUrls, isValidETHAddress } from '../helpers';
import Constants from '../constants';
import { EnvOptionsType, SignerType } from '../types';
import {
  approveRequestPayload,
  IApproveRequestPayload,
  getAccountAddress,
  getWallet,
  getUserDID,
  getConnectedUserV2Core,
  PGPHelper,
  IPGPHelper,
} from './helpers';
import * as CryptoJS from 'crypto-js';
import { axiosPut } from '../utils/axiosUtil';

export interface ApproveRequestOptionsType extends EnvOptionsType {
  /**
   * Chat request sender address
   */
  senderAddress: string;
  pgpPrivateKey?: string | null;

  /**
   * Request state. As of now, only `Approved` is allowed
   */
  status?: 'Approved' | 'Reproved';
  // sigType?: string;
  account?: string | null;
  signer?: SignerType | null;
}

/**
 * Approve Chat Request
 */
export const approve = async (
  options: ApproveRequestOptionsType
): Promise<string> => {
  return await approveCore(options, PGPHelper);
};

export const approveCore = async (
  options: ApproveRequestOptionsType,
  pgpHelper: IPGPHelper
): Promise<string> => {
  const {
    status = 'Approved',
    // sigType = 'sigType',
    account = null,
    signer = null,
    senderAddress,
    env = Constants.ENV.PROD,
    pgpPrivateKey = null,
  } = options || {};

  if (account == null && signer == null) {
    throw new Error(`At least one from account or signer is necessary!`);
  }

  const wallet = getWallet({ account, signer });
  const address = await getAccountAddress(wallet);

  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/chat/request/accept`;

  let isGroup = true;
  if (isValidETHAddress(senderAddress)) {
    isGroup = false;
  }

  const connectedUser = await getConnectedUserV2Core(
    wallet,
    pgpPrivateKey,
    env,
    pgpHelper
  );

  let fromDID = await getUserDID(senderAddress, env);
  let toDID = await getUserDID(address, env);
  if (isGroup) {
    fromDID = await getUserDID(address, env);
    toDID = await getUserDID(senderAddress, env);
  }

  const bodyToBeHashed = {
    fromDID,
    toDID,
    status,
  };

  const hash = CryptoJS.SHA256(JSON.stringify(bodyToBeHashed)).toString();
  const signature: string = await pgpHelper.sign({
    message: hash,
    signingKey: connectedUser.privateKey!,
  });

  const body: IApproveRequestPayload = approveRequestPayload(
    fromDID,
    toDID,
    status,
    'pgp',
    signature
  );

  return axiosPut(apiEndpoint, body)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.error(`[Push SDK] - API ${approve.name}: `, err);
      throw Error(`[Push SDK] - API ${approve.name}: ${err}`);
    });
};
