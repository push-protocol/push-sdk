import axios from 'axios';
import { getAPIBaseUrls, isValidETHAddress, walletToPCAIP10 } from '../helpers';
import Constants from '../constants';
import { EnvOptionsType, SignerType } from '../types';
import {
  approveRequestPayload,
  sign,
  getConnectedProfile,
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
  fromDID?: string;
  toDID?: string;
}

/**
 * Approve Chat Request
 */
export const approve = async (
  options: ApproveRequestOptionsType
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
  let { fromDID, toDID } = options || {};

  if (account == null && signer == null) {
    throw new Error(`At least one from account or signer is necessary!`);
  }

  const wallet = getWallet({ account, signer });
  const address = await getAccountAddress(wallet);

  if (!fromDID) fromDID = senderAddress;
  if (!toDID) toDID = address;

  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/chat/request/accept`;

  let isGroup = true;
  if (isValidETHAddress(senderAddress)) {
    isGroup = false;
  }

  if (isGroup) {
    fromDID = walletToPCAIP10(address);
    toDID = senderAddress;
  } else {
    fromDID = walletToPCAIP10(fromDID);
    toDID = walletToPCAIP10(toDID);
  }
  const bodyToBeHashed = {
    fromDID: fromDID,
    toDID: toDID,
    status: status,
  };

  const connectedUser = await getConnectedProfile(
    toDID,
    wallet,
    pgpPrivateKey,
    env
  );

  const hash = CryptoJS.SHA256(JSON.stringify(bodyToBeHashed)).toString();
  const signature: string = await sign({
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

  return axios
    .put(apiEndpoint, body)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.error(`[Push SDK] - API ${approve.name}: `, err);
      throw Error(`[Push SDK] - API ${approve.name}: ${err}`);
    });
};
