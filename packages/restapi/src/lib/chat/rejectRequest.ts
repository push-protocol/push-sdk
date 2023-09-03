import axios from 'axios';
import { getAPIBaseUrls, isValidETHAddress } from '../helpers';
import Constants from '../constants';
import { EnvOptionsType, SignerType } from '../types';
import {
  sign,
  getConnectedUserV2,
  getAccountAddress,
  getWallet,
  getUserDID,
  IRejectRequestPayload,
  rejectRequestPayload,
} from './helpers';
import * as CryptoJS from 'crypto-js';

interface RejectRequestOptionsType extends EnvOptionsType {
  /**
   * Chat request sender address
   */
  senderAddress: string;
  pgpPrivateKey?: string | null;


  account?: string | null;
  signer?: SignerType | null;
}

/**
 * Reject Chat Request
 */
export const reject = async (options: RejectRequestOptionsType): Promise<string> => {
  const {
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
  const apiEndpoint = `${API_BASE_URL}/v1/chat/request/reject`;

  let isGroup = true;
  if (isValidETHAddress(senderAddress)) {
    isGroup = false;
  }

  const connectedUser = await getConnectedUserV2(wallet, pgpPrivateKey, env);

  let fromDID = await getUserDID(senderAddress, env);
  let toDID = await getUserDID(address, env);
  if (isGroup) {
    fromDID = await getUserDID(address, env);
    toDID = await getUserDID(senderAddress, env);
  }

  const bodyToBeHashed = {
    fromDID,
    toDID,
  };

  const hash = CryptoJS.SHA256(JSON.stringify(bodyToBeHashed)).toString();
  const signature: string = await sign({
    message: hash,
    signingKey: connectedUser.privateKey!,
  });

  const body: IRejectRequestPayload = rejectRequestPayload(
    fromDID,
    toDID,
    'pgp',
    signature
  );

  return axios
    .put(apiEndpoint, body)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.error(`[Push SDK] - API ${reject.name}: `, err);
      throw Error(`[Push SDK] - API ${reject.name}: ${err}`);
    });
};
