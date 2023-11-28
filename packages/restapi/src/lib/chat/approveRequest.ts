import axios from 'axios';
import { getAPIBaseUrls, isValidETHAddress } from '../helpers';
import Constants, { PACKAGE_BUILD } from '../constants';
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
import * as AES from '../chat/helpers/aes';
import { getGroupInfo } from './getGroupInfo';
import { getAllGroupMembersPublicKeys } from './getAllGroupMembersPublicKeys';
import { ALPHA_FEATURE_CONFIG } from '../config';

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
  overrideSecretKeyGeneration?: boolean;
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
    overrideSecretKeyGeneration = !ALPHA_FEATURE_CONFIG[
      PACKAGE_BUILD
    ].feature.includes(Constants.ALPHA_FEATURES.SCALABILITY_V2),
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

  let encryptedSecret: string | null = null;
  /**
   * GENERATE VERIFICATION PROOF
   */

  // pgp is used for public grps & w2w
  // pgpv2 is used for private grps
  let sigType: 'pgp' | 'pgpv2' = 'pgp';
  if (isGroup) {
    const group = await getGroupInfo({ chatId: senderAddress, env });

    if (group && !group.isPublic) {
      /**
       * Secret Key Gen Override has no effect if an encrypted secret key is already present
       */
      if (group.encryptedSecret || !overrideSecretKeyGeneration) {
        sigType = 'pgpv2';
        const secretKey = AES.generateRandomSecret(15);

        const groupMembers = await getAllGroupMembersPublicKeys({
          chatId: group.chatId,
          env,
        });
        // Encrypt secret key with group members public keys
        const publicKeys: string[] = groupMembers.map(
          (member) => member.publicKey
        );
        publicKeys.push(connectedUser.publicKey);
        encryptedSecret = await pgpHelper.pgpEncrypt({
          plainText: secretKey,
          keys: publicKeys,
        });
      }
    }
  }

  let bodyToBeHashed: {
    fromDID: string;
    toDID: string;
    status: string;
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
