import axios from 'axios';
import { getAPIBaseUrls, isValidETHAddress } from '../helpers';
import Constants from '../constants';
import { EnvOptionsType, SignerType } from '../types';
import {
  getAccountAddress,
  getWallet,
  getUserDID,
  getConnectedUserV2Core,
  PGPHelper,
  IPGPHelper,
} from './helpers';
import * as CryptoJS from 'crypto-js';
import { getGroup } from './getGroup';
import * as AES from '../chat/helpers/aes';

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
    account = null,
    signer = null,
    senderAddress,
    env = Constants.ENV.PROD,
    pgpPrivateKey = null,
  } = options || {};

  /**
   * VALIDATIONS
   */
  if (account == null && signer == null) {
    throw new Error(`At least one from account or signer is necessary!`);
  }
  /**
   * INITIALIZATIONS
   */
  const wallet = getWallet({ account, signer });
  const address = await getAccountAddress(wallet);
  const isGroup = !isValidETHAddress(senderAddress);

  const connectedUser = await getConnectedUserV2Core(
    wallet,
    pgpPrivateKey,
    env,
    pgpHelper
  );
  const fromDID: string = isGroup
    ? await getUserDID(address, env)
    : await getUserDID(senderAddress, env);

  const toDID: string = isGroup
    ? await getUserDID(senderAddress, env)
    : await getUserDID(address, env);

  let sessionKey: string | null = null;
  let encryptedSecret: string | null = null;
  /**
   * GENERATE VERIFICATION PROOF
   */

  // pgp is used for public grps & w2w
  // pgpv2 is used for private grps
  let sigType: 'pgp' | 'pgpv2' = 'pgp';
  if (isGroup) {
    const group = await getGroup({ chatId: senderAddress, env });

    if (group && !group.isPublic) {
      sigType = 'pgpv2';
      const secretKey = AES.generateRandomSecret(15);
      // Encrypt secret key with group members public keys
      const publicKeys: string[] = group.members.map(
        (member) => member.publicKey
      );
      publicKeys.push(connectedUser.publicKey);
      encryptedSecret = await pgpHelper.pgpEncrypt({
        plainText: secretKey,
        keys: publicKeys,
      });

      sessionKey = CryptoJS.SHA256(encryptedSecret).toString();
    }
  }

  let bodyToBeHashed: {
    fromDID: string;
    toDID: string;
    status: string;
    sessionKey?: string | null;
    encryptedSecret?: string | null;
  };

  switch (sigType) {
    case 'pgp': {
      bodyToBeHashed = {
        fromDID,
        toDID,
        status,
      };
      break;
    }
    case 'pgpv2': {
      bodyToBeHashed = {
        fromDID,
        toDID,
        status,
        sessionKey: sessionKey,
        encryptedSecret: encryptedSecret,
      };
      break;
    }
  }

  const hash = CryptoJS.SHA256(JSON.stringify(bodyToBeHashed)).toString();
  const signature: string = await pgpHelper.sign({
    message: hash,
    signingKey: connectedUser.privateKey!,
  });
  const verificationProof = `${sigType}:${signature}`;

  const body = {
    fromDID,
    toDID,
    signature,
    status,
    sigType,
    verificationProof,
    sessionKey,
    encryptedSecret,
  };

  /**
   * API CALL TO PUSH NODES
   */
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/chat/request/accept`;
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
