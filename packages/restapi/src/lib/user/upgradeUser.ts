import { getAccountAddress, getWallet } from '../chat/helpers';
import Constants, { ENV } from '../constants';
import { isValidETHAddress, decryptPGPKey } from '../helpers';
import { SignerType, IUser, ProgressHookType } from '../types';
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
 * Upgrades the Push Profile keys from current version to recommended version
 * @param options
 * @returns
 */
export const upgrade = async (options: UpgradeUserProps): Promise<IUser> => {
  const {
    env = Constants.ENV.PROD,
    account = null,
    signer,
    additionalMeta,
    progressHook,
  } = options || {};

  try {
    const wallet = getWallet({ account, signer });
    const address = await getAccountAddress(wallet);

    if (!isValidETHAddress(address)) {
      throw new Error(`Invalid address!`);
    }

    const user: IUser = await get({ account: address, env: env });

    if (!user || !user.encryptedPrivateKey) {
      throw new Error('User Not Found!');
    }

    const recommendedPgpEncryptionVersion = Constants.ENCRYPTION_TYPE.PGP_V3;

    if (
      user.encryptionType === recommendedPgpEncryptionVersion ||
      user.encryptionType === Constants.ENCRYPTION_TYPE.NFTPGP_V1
    ) {
      return user;
    }

    // Report Progress
    progressHook?.({
      progressId: 'PUSH-UPGRADE-01',
      progressTitle: 'Decrypting Old Profile',
      progressInfo:
        'Trying to Upgrade Push Chat Keys to latest version. Please sign the message to continue.',
      level: 'INFO',
    });
    const pgpPrivateKey = await decryptPGPKey({
      encryptedPGPPrivateKey: user.encryptedPrivateKey,
      signer: signer,
      env,
      toUpgrade: false,
      additionalMeta,
    });

    const upgradedUser = await update({
      pgpPrivateKey, // decrypted pgp priv key
      pgpEncryptionVersion: recommendedPgpEncryptionVersion,
      signer,
      pgpPublicKey: user.publicKey,
      account: user.did,
      env,
      additionalMeta: additionalMeta,
      progressHook: progressHook,
    });
    // Report Progress
    progressHook?.({
      progressId: 'PUSH-UPGRADE-02',
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
