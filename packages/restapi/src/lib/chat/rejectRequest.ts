import {
  convertToValidDID,
  convertToValidDIDV2,
  getAPIBaseUrls,
  isValidPushCAIP,
} from '../helpers';
import Constants from '../constants';
import { EnvOptionsType, SignerType } from '../types';
import {
  sign,
  getConnectedUserV2,
  getAccountAddress,
  getWallet,
  IRejectRequestPayload,
  rejectRequestPayload,
  getConnectedUserV3,
  rejectRequestPayloadV2,
} from './helpers';
import * as CryptoJS from 'crypto-js';
import { axiosPut } from '../utils/axiosUtil';
import { handleError } from '../errors/validationError';

interface RejectRequestOptionsType extends EnvOptionsType {
  /**
   * Chat request sender address
   */
  senderAddress: string;
  pgpPrivateKey?: string | null;

  account?: string | null;
  signer?: SignerType | null;

  perChain?: boolean;
  chainId?: string;
}

/**
 * Reject Chat Request
 */
export const reject = async (
  options: RejectRequestOptionsType
): Promise<void> => {
  if (!options.perChain) {
    return rejectV1(options);
  } else {
    return rejectV2(options);
  }
};

const rejectV1 = async (options: RejectRequestOptionsType): Promise<void> => {
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
  if (isValidPushCAIP(senderAddress)) {
    isGroup = false;
  }

  const connectedUser = await getConnectedUserV2(wallet, pgpPrivateKey, env);

  let fromDID = await convertToValidDID(senderAddress, env);
  let toDID = await convertToValidDID(address, env);
  if (isGroup) {
    fromDID = await convertToValidDID(address, env);
    toDID = await convertToValidDID(senderAddress, env);
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

  return axiosPut(apiEndpoint, body)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      throw handleError(err, reject.name);
    });
};

const rejectV2 = async (options: RejectRequestOptionsType): Promise<void> => {
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
  const apiEndpoint = `${API_BASE_URL}/v2/chat/request/reject`;

  let isGroup = true;
  if (isValidPushCAIP(senderAddress)) {
    isGroup = false;
  }

  const connectedUser = await getConnectedUserV3(wallet, pgpPrivateKey, env);

  let fromDID = await convertToValidDID(senderAddress, env);
  let toDID = await convertToValidDID(address, env);

  let fromDIDV2 = await convertToValidDIDV2(
    senderAddress,
    env,
    options.chainId!
  );
  let toDIDV2 = await convertToValidDIDV2(address, env, options.chainId!);
  if (isGroup) {
    fromDID = await convertToValidDID(address, env);
    toDID = await convertToValidDID(senderAddress, env);

    fromDIDV2 = await convertToValidDIDV2(address, env, options.chainId!);
    toDIDV2 = await convertToValidDIDV2(senderAddress, env, options.chainId!);
  }

  const bodyToBeHashed = {
    fromDID,
    toDID,
    fromDIDV2,
    toDIDV2,
  };

  const hash = CryptoJS.SHA256(JSON.stringify(bodyToBeHashed)).toString();
  const signature: string = await sign({
    message: hash,
    signingKey: connectedUser.privateKey!,
  });

  const body: IRejectRequestPayload = rejectRequestPayloadV2(
    fromDID,
    toDID,
    fromDIDV2,
    toDIDV2,
    'pgpv1',
    signature
  );

  return axiosPut(apiEndpoint, body)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      throw handleError(err, reject.name);
    });
};
