import axios from 'axios';
import { getAPIBaseUrls, isValidETHAddress, walletToPCAIP10 } from '../helpers';
import Constants from '../constants';
import { EnvOptionsType, SignerType } from '../types';
import {
  approveRequestPayload,
  sign,
  getConnectedUserV2,
  IApproveRequestPayload,
  getAccountAddress,
  getWallet,
} from './helpers';
import * as CryptoJS from 'crypto-js';

interface ApproveRequestOptionsType extends EnvOptionsType {
  /**
   * Chat request sender address
   */
  senderAddress: string;
  pgpPrivateKey?: string;

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
export const approve = async (options: ApproveRequestOptionsType) => {
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
  const bodyToBeHashed = {
    fromDID: isGroup
      ? walletToPCAIP10(address)
      : walletToPCAIP10(senderAddress),
    toDID: isGroup ? senderAddress : walletToPCAIP10(address),
    status: status,
  };

  const connectedUser = await getConnectedUserV2(wallet, pgpPrivateKey, env);

  const hash = CryptoJS.SHA256(JSON.stringify(bodyToBeHashed)).toString();
  const signature: string = await sign({
    message: hash,
    signingKey: connectedUser.privateKey!,
  });

  const body: IApproveRequestPayload = approveRequestPayload(
    senderAddress,
    address,
    status,
    'pgp',
    signature
  );

  return axios.put(apiEndpoint, body).catch((err) => {
    console.error(`[Push SDK] - API ${approve.name}: `, err);
    throw Error(`[Push SDK] - API ${approve.name}: ${err}`);
  });
};
