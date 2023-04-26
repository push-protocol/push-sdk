import axios from 'axios';
import {
  authUpdateUserService,
  getAccountAddress,
  getWallet,
} from '../chat/helpers';
import Constants, { ENV } from '../constants';
import { getAPIBaseUrls, isValidETHAddress, walletToPCAIP10 } from '../helpers';
import { SignerType, IUser, ProgressHookType } from '../types';

/**
 * Used for updating the encryption keys of a Push Profile
 */
export type AuthUpdateProps = {
  encryptedPgpPrivateKey: string;
  signer: SignerType;
  account?: string;
  pgpPublicKey?: string;
  name?: string;
  env?: ENV;
  progressHook?: (progress: ProgressHookType) => void;
};

export const update = async (options: AuthUpdateProps): Promise<IUser> => {
  const {
    env = Constants.ENV.PROD,
    account = null,
    signer,
    encryptedPgpPrivateKey,
    pgpPublicKey = null,
    name = null,
    progressHook,
  } = options || {};

  if (signer == null) {
    throw new Error(`Signer is necessary!`);
  }

  const wallet = getWallet({ account, signer });
  const address = await getAccountAddress(wallet);

  if (!isValidETHAddress(address)) {
    throw new Error(`Invalid address!`);
  }

  const caip10 = walletToPCAIP10(address);
  const API_BASE_URL = getAPIBaseUrls(env);
  const requestUrl = `${API_BASE_URL}/v1/users/?caip10=${caip10}`;
  const user = (await axios.get(requestUrl)).data;

  if (!user || !user.did) {
    throw new Error('User not Found!');
  }

  const { version: encryptionType } = JSON.parse(encryptedPgpPrivateKey);

  const body = {
    user: user.did,
    wallet,
    name: name ? name : '',
    encryptedPassword: null,
    nftOwner:
      encryptionType === Constants.ENC_TYPE_V4
        ? walletToPCAIP10((await signer?.getAddress()) as string)
        : null, // check for nft,
    publicKey: pgpPublicKey ? pgpPublicKey : user.publicKey,
    encryptedPrivateKey: encryptedPgpPrivateKey,
    encryptionType: encryptionType,
    env,
  };

  // Report Progress
  progressHook?.({
    progressId: 'PUSH-UPDATE-01',
    progressTitle: 'Syncing Updated Profile',
    progressInfo:
      'Please sign the message to continue. Steady lads, chat is almost ready!',
    level: 'INFO',
  });
  const updatedUser = await authUpdateUserService(body);
  // Report Progress
  progressHook?.({
    progressId: 'PUSH-UPDATE-02',
    progressTitle: 'Update Completed, Welcome to Push Chat',
    progressInfo: '',
    level: 'SUCCESS',
  });
  return updatedUser;
};
