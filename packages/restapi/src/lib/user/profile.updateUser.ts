import axios from 'axios';
import * as CryptoJS from 'crypto-js';
import { sign } from '../chat/helpers';
import Constants, { ENV } from '../constants';
import {
  getAPIBaseUrls,
  isValidETHAddress,
  verifyPGPPublicKey,
} from '../helpers';
import { IUser, ProgressHookType } from '../types';
import { get } from './getUser';
import { populateDeprecatedUser } from '../utils/populateIUser';

type ProfileUpdateProps = {
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
  profile: {
    name?: string;
    desc?: string;
    picture?: string;
  };
  env?: ENV;
  progressHook?: (progress: ProgressHookType) => void;
};

/**
 * Updation of profile
 */
export const profileUpdate = async (
  options: ProfileUpdateProps
): Promise<IUser> => {
  const {
    pgpPrivateKey,
    account,
    profile,
    env = Constants.ENV.PROD,
    progressHook,
  } = options || {};
  try {
    if (!isValidETHAddress(account)) {
      throw new Error(`Invalid account!`);
    }

    const user = await get({ account, env });
    if (!user || !user.did) {
      throw new Error('User not Found!');
    }
    const updatedProfile = {
      name: profile.name ? profile.name : user.profile.name,
      desc: profile.desc ? profile.desc : user.profile.desc,
      picture: profile.picture ? profile.picture : user.profile.picture,
    };
    const hash = CryptoJS.SHA256(JSON.stringify(updatedProfile)).toString();
    const signature = await sign({
      message: hash,
      signingKey: pgpPrivateKey,
    });
    const sigType = 'pgp';
    const verificationProof = `${sigType}:${signature}`;

    const body = { ...updatedProfile, verificationProof };

    const API_BASE_URL = getAPIBaseUrls(env);
    const apiEndpoint = `${API_BASE_URL}/v2/users/${user.did}/profile`;

    //Report Progress
    progressHook?.({
      progressId: 'PUSH-PROFILE-UPDATE-01',
      progressTitle: 'Syncing Updated Profile',
      progressInfo: 'Steady lads, your profile is getting a new look!',
      level: 'INFO',
    });
    const response = await axios.put(apiEndpoint, body);
    if (response.data)
      response.data.publicKey = verifyPGPPublicKey(
        response.data.encryptedPrivateKey,
        response.data.publicKey,
        response.data.did
      );
    //Report Progress
    progressHook?.({
      progressId: 'PUSH-PROFILE-UPDATE-02',
      progressTitle: 'Profile Update Completed, Welcome to Push Chat',
      progressInfo: '',
      level: 'SUCCESS',
    });
    return populateDeprecatedUser(response.data);
  } catch (err) {
    progressHook?.({
      progressId: 'PUSH-ERROR-00',
      progressTitle: 'Non Specific Error',
      progressInfo: `[Push SDK] - API  - Error - API profile.update() -: ${err}`,
      level: 'ERROR',
    });
    throw Error(`[Push SDK] - API  - Error - API profile.update() -: ${err}`);
  }
};
