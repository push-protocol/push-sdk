import {
  convertToValidDID,
  convertToValidDIDV2,
  getAPIBaseUrls,
  isValidPushCAIP,
} from '../helpers';
import Constants, { PACKAGE_BUILD } from '../constants';
import { EnvOptionsType, SignerType } from '../types';
import {
  getAccountAddress,
  getWallet,
  getConnectedUserV2Core,
  PGPHelper,
  IPGPHelper,
  getConnectedUserV3Core,
} from './helpers';
import * as CryptoJS from 'crypto-js';
import { axiosPut } from '../utils/axiosUtil';
import * as AES from '../chat/helpers/aes';
import { getGroupInfo } from './getGroupInfo';
import { getAllGroupMembersPublicKeys } from './getAllGroupMembersPublicKeys';
import { ALPHA_FEATURE_CONFIG } from '../config';
import { handleError } from '../errors/validationError';

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
  perChain?: boolean;
  chainId?: string;
}

/**
 * Approve Chat Request
 */
export const approve = async (
  options: ApproveRequestOptionsType
): Promise<string> => {
  if (!options.perChain) {
    return await approveCore(options, PGPHelper);
  } else {
    return await approveCoreV2(options, PGPHelper);
  }
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

  const isGroup = !isValidPushCAIP(senderAddress);

  const connectedUser = await getConnectedUserV2Core(
    wallet,
    pgpPrivateKey,
    env,
    pgpHelper
  );
  const fromDID: string = isGroup
    ? await convertToValidDID(address, env)
    : await convertToValidDID(senderAddress, env);

  const toDID: string = isGroup
    ? await convertToValidDID(senderAddress, env)
    : await convertToValidDID(address, env);

  const fromDIDV2: string = isGroup
    ? await convertToValidDIDV2(address, env, options.chainId!)
    : await convertToValidDIDV2(senderAddress, env, options.chainId!);

  const toDIDV2: string = isGroup
    ? await convertToValidDIDV2(senderAddress, env, options.chainId!)
    : await convertToValidDIDV2(address, env, options.chainId!);

  let encryptedSecret: string | null = null;
  /**
   * GENERATE VERIFICATION PROOF
   */

  // pgp is used for public grps & w2w
  // pgpv2 is used for private grps
  let sigType: string = 'pgp';
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
    fromDIDV2?: string;
    toDIDV2?: string;
    status: string;
    encryptedSecret?: string | null;
  } = {
    fromDID: '',
    toDID: '',
    status: '',
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
    case 'pgpv3': {
      bodyToBeHashed = {
        fromDIDV2,
        toDIDV2,
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
    fromDIDV2,
    toDIDV2,
    signature,
    status,
    sigType,
    verificationProof,
    encryptedSecret,
  };

  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v2/chat/request/accept`;
  return axiosPut(apiEndpoint, body)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      throw handleError(err, approve.name);
    });
};

export const approveCoreV2 = async (
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

  const isGroup = !isValidPushCAIP(senderAddress);
  let sigType = 'pgpv3';

  const connectedUser = await getConnectedUserV3Core(
    wallet,
    pgpPrivateKey,
    env,
    pgpHelper
  );
  const fromDID: string = isGroup
    ? await convertToValidDID(address, env)
    : await convertToValidDID(senderAddress, env);

  const toDID: string = isGroup
    ? await convertToValidDID(senderAddress, env)
    : await convertToValidDID(address, env);

  const fromDIDV2: string = isGroup
    ? await convertToValidDIDV2(address, env, options.chainId!)
    : await convertToValidDIDV2(senderAddress, env, options.chainId!);

  const toDIDV2: string = isGroup
    ? await convertToValidDIDV2(senderAddress, env, options.chainId!)
    : await convertToValidDIDV2(address, env, options.chainId!);

  let encryptedSecret: string | null = null;
  /**
   * GENERATE VERIFICATION PROOF
   */

  // pgp is used for public grps & w2w
  // pgpv2 is used for private grps
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
    fromDIDV2?: string;
    toDIDV2?: string;
    status: string;
    encryptedSecret?: string | null;
  } = {
    fromDID: '',
    toDID: '',
    status: '',
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
    case 'pgpv3': {
      bodyToBeHashed = {
        fromDID,
        toDID,
        fromDIDV2,
        toDIDV2,
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
    fromDIDV2,
    toDIDV2,
    signature,
    status,
    sigType,
    verificationProof,
    encryptedSecret,
  };

  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v2/chat/request/accept`;

  return axiosPut(apiEndpoint, body)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      throw handleError(err, approve.name);
    });
};
