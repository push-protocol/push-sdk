import {
  getAccountAddress,
  getWallet,
  upgradeUserService,
} from '../chat/helpers';
import Constants, { ENV } from '../constants';
import {
  isValidETHAddress,
  walletToPCAIP10,
  encryptPGPKey,
  preparePGPPublicKey,
  encryptV3,
  hexToBytes,
} from '../helpers';
import {
  SignerType,
  encryptedPrivateKeyType,
  ProgressHookType,
  IUser,
} from '../types';
import { getNFTProfile } from './getNFTProfile';
import { decryptNFTProfile } from './decryptNFTProfile';

export type upgradeNFTProfile = {
  signer: SignerType;
  did: string;
  newPassword: string;
  currentPassword?: string;
  env?: ENV;
  account?: string;
  progressHook?: (progress: ProgressHookType) => void;
};

export const upgradeNFTProfile = async (
  options: upgradeNFTProfile
): Promise<IUser> => {
  const {
    env = Constants.ENV.PROD,
    account = null,
    signer,
    currentPassword = null,
    newPassword,
    did,
    progressHook,
  } = options || {};

  try {
    if (signer === null || newPassword === null || did === null) {
      throw new Error(`Invalid Params Passed!`);
    }

    const wallet = getWallet({ account, signer });
    const address = await getAccountAddress(wallet);

    if (!isValidETHAddress(address)) {
      throw new Error(`Invalid address!`);
    }

    const user: IUser = await getNFTProfile({
      did,
      env: env,
    });

    if (user === null) {
      throw new Error('Profile not Found!');
    }

    const encryptionType = Constants.ENC_TYPE_V3;
    const privateKey = await decryptNFTProfile({
      encryptedPGPPrivateKey: user.encryptedPrivateKey,
      decryptedPassword: currentPassword as string,
      env,
    });

    // Report Progress
    progressHook?.({
      progressId: 'PUSH-UPGRADE-01',
      progressTitle: 'Generating New Profile Signature',
      progressInfo:
        'Trying to Upgrade Push Chat Keys to latest version. Please sign the message to continue.',
      level: 'INFO',
    });

    const publicKey: string = await preparePGPPublicKey(
      encryptionType,
      user.publicKey,
      wallet
    );

    // Report Progress
    progressHook?.({
      progressId: 'PUSH-UPGRADE-02',
      progressTitle: 'Decrypting Old Profile',
      progressInfo:
        'Trying to Upgrade Push Chat Keys to latest version. Please sign the message to continue.',
      level: 'INFO',
    });

    // Report Progress
    progressHook?.({
      progressId: 'PUSH-UPGRADE-03',
      progressTitle: 'Generating Encrypted New Profile',
      progressInfo:
        'Trying to Upgrade Push Chat Keys to latest version. Encrypting Push Chat Keys with latest version. Please sign the message to continue.',
      level: 'INFO',
    });
    // encrypt priv key with password
    const enc = new TextEncoder();
    const encodedPrivateKey = enc.encode(privateKey);
    const encryptedPrivateKey = await encryptV3(
      encodedPrivateKey,
      hexToBytes(newPassword)
    );

    // encrypt password instead of priv key
    const encryptedPassword: encryptedPrivateKeyType = await encryptPGPKey(
      encryptionType,
      newPassword,
      address,
      wallet
    );

    const body = {
      user: did,
      wallet,
      publicKey: publicKey,
      encryptedPrivateKey: JSON.stringify(encryptedPrivateKey),
      encryptionType: encryptionType,
      encryptedPassword: JSON.stringify(encryptedPassword),
      nftOwner: walletToPCAIP10(address),
      env,
    };

    // Report Progress
    progressHook?.({
      progressId: 'PUSH-UPGRADE-04',
      progressTitle: 'Syncing New Profile',
      progressInfo:
        'Please sign the message to continue. Steady lads, chat is almost ready!',
      level: 'INFO',
    });
    const upgradedUser = await upgradeUserService(body);
    // Report Progress
    progressHook?.({
      progressId: 'PUSH-UPGRADE-05',
      progressTitle: 'Upgrade Completed, Welcome to Push Chat',
      progressInfo: '',
      level: 'SUCCESS',
    });
    return upgradedUser;
  } catch (err) {
    progressHook?.({
      progressId: 'PUSH-ERROR-00',
      progressTitle: 'Non Specific Error',
      progressInfo: `[Push SDK] - API  - Error - API upgradeNFTProfile() -: ${err}`,
      level: 'ERROR',
    });
    throw Error(
      `[Push SDK] - API  - Error - API upgradeNFTProfile() -: ${err}`
    );
  }
};
