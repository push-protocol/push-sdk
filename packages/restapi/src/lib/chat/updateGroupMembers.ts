import axios from 'axios';
import { getAPIBaseUrls } from '../helpers';
import Constants from '../constants';
import {
  getWallet,
  PGPHelper,
  getConnectedUserV2Core,
  getAccountAddress,
  getUserDID,
  validateGroupMemberUpdateOptions,
} from './helpers';
import * as CryptoJS from 'crypto-js';
import { EnvOptionsType, GroupInfoDTO, SignerType } from '../types';
import { getGroupInfo } from './getGroupInfo';

export interface GroupMemberUpdateOptions extends EnvOptionsType {
  chatId: string;
  upsert: {
    [role: string]: Array<string>;
  };
  remove: Array<string>;
  account?: string | null;
  signer?: SignerType | null;
  pgpPrivateKey?: string | null;
}

export const updateGroupMembers = async (
  options: GroupMemberUpdateOptions
): Promise<GroupInfoDTO> => {
  const {
    chatId,
    upsert,
    remove,
    account = null,
    signer = null,
    env = Constants.ENV.PROD,
    pgpPrivateKey = null,
  } = options;
  try {
    validateGroupMemberUpdateOptions(options);
    const wallet = getWallet({ account, signer });
    const address = await getAccountAddress(wallet);

    const connectedUser = await getConnectedUserV2Core(
      wallet,
      pgpPrivateKey,
      env,
      PGPHelper
    );
    const groupChat = await getGroupInfo({ chatId, env });

    const convertedUpsertPromise = Object.entries(upsert).map(
      async ([role, userDIDs]) => {
        const userIDs = await Promise.all(
          userDIDs.map((userDID) => getUserDID(userDID, env))
        );
        return [role, userIDs];
      }
    );
    const convertedUpsert = Object.fromEntries(
      await Promise.all(convertedUpsertPromise)
    );
    const convertedRemove = await Promise.all(
      remove.map((userDID) => getUserDID(userDID, env))
    );

    const bodyToBeHashed = {
      upsert: convertedUpsert,
      remove: convertedRemove,
    };

    const hash = CryptoJS.SHA256(JSON.stringify(bodyToBeHashed)).toString();
    const signature = await PGPHelper.sign({
      message: hash,
      signingKey: connectedUser.privateKey!,
    });
    const sigType = 'pgp';
    const verificationProofFull = `${sigType}:${signature}:${address}`;
    const API_BASE_URL = getAPIBaseUrls(env);
    const apiEndpoint = `${API_BASE_URL}/v1/chat/groups/${chatId}/members`;

    const body = {
      upsert: convertedUpsert,
      remove: convertedRemove,
      deltaVerificationProof: verificationProofFull,
    };

    return axios
      .post(apiEndpoint, body)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        if (err?.response?.data) throw new Error(err?.response?.data);
        throw new Error(err);
      });
  } catch (err) {
    console.error(
      `[Push SDK] - API  - Error - API ${updateGroupMembers.name} -:  `,
      err
    );
    throw Error(
      `[Push SDK] - API  - Error - API ${updateGroupMembers.name} -: ${err}`
    );
  }
};
