import * as CryptoJS from 'crypto-js';
import { IPGPHelper, PGPHelper } from '../chat/helpers';
import Constants, { ENV } from '../constants';
import {
  convertToValidDID,
  getAPIBaseUrls,
  isValidPushCAIP,
  verifyProfileKeys,
} from '../helpers';
import { IUser, ProgressHookType, ProgressHookTypeFunction } from '../types';
import { get } from './getUser';
import { populateDeprecatedUser } from '../utils/populateIUser';
import PROGRESSHOOK from '../progressHook';
import { axiosPut } from '../utils/axiosUtil';

export type ConfigUpdateProps = {
  /**
   * PGP Private Key
   */
  pgpPrivateKey: string;
  /**
   * DID
   */
  account: string;
  /**
   *  Profile properties that can be changed
   */
  config: {
    blockedUsersList?: Array<string>;
  };
  env?: ENV;
  progressHook?: (progress: ProgressHookType) => void;
};

/**
 * Updation of profile
 */
export const configUpdate = async (
  options: ConfigUpdateProps
): Promise<IUser> => {
  return configUpdateCore(options, PGPHelper);
};

export const configUpdateCore = async (
  options: ConfigUpdateProps,
  pgpHelper: IPGPHelper
): Promise<IUser> => {
  const {
    pgpPrivateKey,
    account,
    config,
    env = Constants.ENV.PROD,
    progressHook,
  } = options || {};
  try {
    if (!isValidPushCAIP(account)) {
      throw new Error(`Invalid account!`);
    }

    const user = await get({ account, env });
    if (!user || !user.did) {
      throw new Error('User not Found!');
    }
    let blockedUsersList = null;
    if (config.blockedUsersList) {
      for (const element of config.blockedUsersList) {
        // Check if the element is a valid CAIP-10 address
        if (!isValidPushCAIP(element)) {
          throw new Error(
            'Invalid address in the blockedUsersList: ' + element
          );
        }
      }

      const convertedBlockedListUsersPromise = config.blockedUsersList.map(
        async (each) => {
          return convertToValidDID(each, env);
        }
      );
      blockedUsersList = await Promise.all(convertedBlockedListUsersPromise);

      blockedUsersList = Array.from(new Set(blockedUsersList));
    }

    const updatedUserConfig = {
      blockedUsersList: config.blockedUsersList ? blockedUsersList : [],
    };
    const hash = CryptoJS.SHA256(JSON.stringify(updatedUserConfig)).toString();
    const signature = await pgpHelper.sign({
      message: hash,
      signingKey: pgpPrivateKey,
    });
    const sigType = 'pgp';
    const configVerificationProof = `${sigType}:${signature}`;

    const body = { ...updatedUserConfig, configVerificationProof };

    const API_BASE_URL = getAPIBaseUrls(env);
    const apiEndpoint = `${API_BASE_URL}/v2/users/${user.did}/config`;

    // Report Progress
    progressHook?.(PROGRESSHOOK['PUSH-CONFIG-UPDATE-01'] as ProgressHookType);
    const response = await axiosPut(apiEndpoint, body);
    if (response.data)
      response.data.publicKey = await verifyProfileKeys(
        response.data.encryptedPrivateKey,
        response.data.publicKey,
        response.data.did,
        response.data.wallets,
        response.data.verificationProof
      );

    // Report Progress
    progressHook?.(PROGRESSHOOK['PUSH-CONFIG-UPDATE-02'] as ProgressHookType);
    return populateDeprecatedUser(response.data);
  } catch (err) {
    // Report Progress
    const errorProgressHook = PROGRESSHOOK[
      'PUSH-ERROR-00'
    ] as ProgressHookTypeFunction;
    progressHook?.(errorProgressHook(configUpdate.name, err));
    throw Error(
      `[Push SDK] - API - Error - API ${configUpdate.name} -: ${err}`
    );
  }
};
