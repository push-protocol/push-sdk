import { getAccountAddress, getWallet } from '../chat/helpers';
import Constants, { ENV } from '../constants';
import {
  isValidETHAddress,
  encryptPGPKey,
  preparePGPPublicKey,
  decryptPGPKey,
  isValidCAIP10NFTAddress,
} from '../helpers';
import {
  SignerType,
  encryptedPrivateKeyType,
  IUser,
  ProgressHookType,
  encryptedPrivateKeyTypeV2,
} from '../types';
import { update } from './auth.updateUser';
import { get } from './getUser';

export type UpgradeUserProps = {
  env?: ENV;
  account?: string;
  signer: SignerType;
  additionalMeta?: {
    NFTPGP_V1?: {
      password: string;
    };
  };
  progressHook?: (progress: ProgressHookType) => void;
};
/**
 * Used for Upgrading Push Profile keys.
 * Current Upgrade Cases
 * 1. ENC_TYPE_V1 -> ENC_TYPE_V3
 * 2. ENC_TYPE_V2 -> ENC_TYPE_V3
 * 3. ENC_TYPE_V4 -> ENC_TYPE_V4 ( chat continuation on NFT Transfer )
 * @param options
 * @returns
 */
export const upgrade = async (options: UpgradeUserProps): Promise<IUser> => {
  const {
    env = Constants.ENV.PROD,
    account = null,
    signer = null,
    additionalMeta,
    progressHook,
  } = options || {};

  try {
    if (signer == null) {
      throw new Error(`Signer is necessary!`);
    }

    const wallet = getWallet({ account, signer });
    const address = await getAccountAddress(wallet);

    if (!isValidETHAddress(address)) {
      throw new Error(`Invalid address!`);
    }

    const user: IUser = await get({ account: address, env: env });

    // user not found or already at latest encryption scheme
    if (
      !user ||
      !user.encryptedPrivateKey ||
      user.encryptionType === Constants.ENC_TYPE_V3
    ) {
      return user;
    }

    const caip10 = user.did;
    let encryptionType: string;

    if (isValidCAIP10NFTAddress(user.did)) {
      encryptionType = Constants.ENC_TYPE_V4;
    } else {
      encryptionType = Constants.ENC_TYPE_V3;
    }

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
    const privateKey = await decryptPGPKey({
      encryptedPGPPrivateKey: user.encryptedPrivateKey,
      signer: signer,
      env,
      toUpgrade: false,
      additionalMeta,
    });

    // Report Progress
    progressHook?.({
      progressId: 'PUSH-UPGRADE-03',
      progressTitle: 'Generating Encrypted New Profile',
      progressInfo:
        'Trying to Upgrade Push Chat Keys to latest version. Encrypting Push Chat Keys with latest version. Please sign the message to continue.',
      level: 'INFO',
    });

    const encryptedPrivateKey: encryptedPrivateKeyType = await encryptPGPKey(
      encryptionType,
      privateKey,
      wallet,
      additionalMeta
    );

    if (encryptionType === Constants.ENC_TYPE_V4) {
      const encryptedPassword: encryptedPrivateKeyTypeV2 = await encryptPGPKey(
        Constants.ENC_TYPE_V3,
        additionalMeta?.NFTPGP_V1?.password as string,
        wallet,
        additionalMeta
      );
      encryptedPrivateKey.encryptedPassword = encryptedPassword;
    }

    // Report Progress
    progressHook?.({
      progressId: 'PUSH-UPGRADE-04',
      progressTitle: 'Syncing New Profile',
      progressInfo:
        'Please sign the message to continue. Steady lads, chat is almost ready!',
      level: 'INFO',
    });
    const upgradedUser = await update({
      encryptedPgpPrivateKey: JSON.stringify(encryptedPrivateKey),
      signer,
      account: caip10,
      pgpPublicKey: publicKey,
      env,
    });
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
      progressInfo: `[Push SDK] - API  - Error - API upgrade User() -: ${err}`,
      level: 'ERROR',
    });
    throw Error(`[Push SDK] - API  - Error - API upgrade User() -: ${err}`);
  }
};
