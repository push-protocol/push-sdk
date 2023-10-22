import * as PGP from '../chat/helpers/pgp';
import axios from 'axios';
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
import * as AES from '../chat/helpers/aes';
import { getGroup } from './getGroup';

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

  let fromDID: string;
  let toDID: string;
  if (isGroup) {
    fromDID = await getUserDID(address, env);
    toDID = await getUserDID(senderAddress, env);
  } else {
    fromDID = await getUserDID(senderAddress, env);
    toDID = await getUserDID(address, env);
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

  let sessionKey: string | null = null;
  let encryptedSecret: string | null = null;
  if (isGroup) {
    const group = await getGroup({ chatId: senderAddress, env });
    if (
      !group.isPublic &&
      group.members.length >= Constants.MAX_GROUP_MEMBERS_PRIVATE
    ) {
      sessionKey = AES.generateRandomSecret(15);
      const secretKey = AES.generateRandomSecret(15);
      // Encrypt secret key with group members public keys
      const publicKeys: string[] = group.members.map(
        (member) => member.publicKey
      );
      encryptedSecret = await PGP.pgpEncrypt({
        plainText: secretKey,
        keys: publicKeys,
      });
    }
  }

  const body: IApproveRequestPayload = approveRequestPayload(
    fromDID,
    toDID,
    status,
    'pgp',
    signature,
    sessionKey,
    encryptedSecret
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
