import axios from 'axios';
import { getAPIBaseUrls, isValidETHAddress } from '../helpers';
import Constants from '../constants';
import { EnvOptionsType, GroupInfoDTO, SignerType, Rules } from '../types';
import {
  getWallet,
  getUserDID,
  IPGPHelper,
  PGPHelper,
  validateScheduleDates,
  getConnectedUserV2Core,
} from './helpers';
import * as CryptoJS from 'crypto-js';

export interface ChatCreateGroupTypeV2 extends EnvOptionsType {
  account?: string | null;
  signer?: SignerType | null;
  pgpPrivateKey?: string | null;
  // Profile
  groupName: string;
  groupDescription: string | null;
  groupImage: string | null;
  rules: Rules | null;
  isPublic: boolean;
  groupType: 'default' | 'spaces';
  config: {
    meta: string | null;
    scheduleAt: Date | null;
    scheduleEnd: Date | null;
    status: 'PENDING' | null;
  };
  members: Array<string>;
  admins: Array<string>;
}

export const createGroupV2 = async (options: ChatCreateGroupTypeV2) => {
  return await createGroupCoreV2(options, PGPHelper);
};

export const createGroupCoreV2 = async (
  options: ChatCreateGroupTypeV2,
  pgpHelper: IPGPHelper
): Promise<GroupInfoDTO> => {
  const {
    account = null,
    signer = null,
    pgpPrivateKey = null,
    env = Constants.ENV.PROD,
    groupName,
    groupDescription,
    groupImage,
    rules,
    isPublic,
    groupType,
    config: { meta, scheduleAt, scheduleEnd, status },
    members,
    admins,
  } = options;

  try {
    const wallet = getWallet({ account, signer });
    const connectedUser = await getConnectedUserV2Core(
      wallet,
      pgpPrivateKey,
      env,
      pgpHelper
    );
    const convertedMembersPromise = members.map(async (each) => {
      return getUserDID(each, env);
    });
    const convertedAdminsPromise = admins.map(async (each) => {
      return getUserDID(each, env);
    });
    const convertedMembers = await Promise.all(convertedMembersPromise);
    const convertedAdmins = await Promise.all(convertedAdminsPromise);
    /**
     * VALIDATIONS
     */
    createGroupV2OptionsValidator(options);
    /**
     * PROFILE VERIFICATION PROOF
     */
    const profileVerificationBody = {
      groupName,
      groupDescription,
      groupImage,
      rules,
      isPublic,
      groupType,
    };
    const profileHash = CryptoJS.SHA256(
      JSON.stringify(profileVerificationBody)
    ).toString();
    const profileSignature: string = await pgpHelper.sign({
      message: profileHash,
      signingKey: connectedUser.privateKey!,
    });
    const profileVerificationProof = `pgpv2:${profileSignature}:${connectedUser.did}`;
    /**
     * CONFIG VERIFICATION PROOF
     */
    const configVerificationBody = {
      meta,
      scheduleAt,
      scheduleEnd,
      status,
    };
    const configHash = CryptoJS.SHA256(
      JSON.stringify(configVerificationBody)
    ).toString();
    const configSignature: string = await pgpHelper.sign({
      message: configHash,
      signingKey: connectedUser.privateKey!,
    });
    const configVerificationProof = `pgpv2:${configSignature}:${connectedUser.did}`;
    /**
     * IDEMPOTENT VERIFICATION PROOF
     */
    const idempotentVerificationBody = {
      members: convertedMembers,
      admins: convertedAdmins,
    };
    const idempotentHash = CryptoJS.SHA256(
      JSON.stringify(idempotentVerificationBody)
    ).toString();
    const idempotentSignature: string = await pgpHelper.sign({
      message: idempotentHash,
      signingKey: connectedUser.privateKey!,
    });
    const idempotentVerificationProof = `pgpv2:${idempotentSignature}:${connectedUser.did}`;

    const API_BASE_URL = getAPIBaseUrls(env);
    const apiEndpoint = `${API_BASE_URL}/v2/chat/groups`;
    const body = {
      groupName,
      groupDescription,
      groupImage,
      rules,
      isPublic,
      groupType,
      profileVerificationProof,
      config: {
        meta,
        scheduleAt,
        scheduleEnd,
        status,
        configVerificationProof,
      },
      members: convertedMembers,
      admins: convertedAdmins,
      idempotentVerificationProof,
    };

    return axios
      .post(apiEndpoint, body)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        if (err?.response?.data)
          throw new Error(JSON.stringify(err?.response?.data));
        throw new Error(err);
      });
  } catch (err) {
    console.error(
      `[Push SDK] - API  - Error - API ${createGroupV2.name} -:  `,
      err
    );
    throw Error(
      `[Push SDK] - API  - Error - API ${createGroupV2.name} -: ${err}`
    );
  }
};

const createGroupV2OptionsValidator = (
  options: ChatCreateGroupTypeV2
): void => {
  const {
    account = null,
    signer = null,
    pgpPrivateKey = null,
    groupName,
    groupDescription,
    groupImage,
    rules,
    isPublic,
    groupType,
    config: { meta, scheduleAt, scheduleEnd, status },
    members,
    admins,
  } = options;

  if (!pgpPrivateKey && !signer) {
    throw new Error(`At least one from pgpPrivateKey or signer is necessary!`);
  }

  if (groupName == null || groupName.length == 0) {
    throw new Error(`groupName cannot be null or empty`);
  }

  if (groupName.length > 50) {
    throw new Error(`groupName cannot be more than 50 characters`);
  }

  if (groupDescription && groupDescription.length > 150) {
    throw new Error(`groupDescription cannot be more than 150 characters`);
  }

  for (let i = 0; i < members.length; i++) {
    if (members[i] && !isValidETHAddress(members[i])) {
      throw new Error(`Invalid member address!`);
    }
  }

  for (let i = 0; i < admins.length; i++) {
    if (!isValidETHAddress(admins[i])) {
      throw new Error(`Invalid admin address!`);
    }
  }

  validateScheduleDates(scheduleAt, scheduleEnd);
};
