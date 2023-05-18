import {
  authUpdateUserService,
  getAccountAddress,
  getWallet,
} from '../chat/helpers';
import Constants, { ENV, ENCRYPTION_TYPE } from '../constants';
import {
  encryptPGPKey,
  isValidETHAddress,
  preparePGPPublicKey,
  walletToPCAIP10,
} from '../helpers';
import {
  SignerType,
  IUser,
  ProgressHookType,
  encryptedPrivateKeyType,
  encryptedPrivateKeyTypeV2,
} from '../types';
import { get } from './getUser';

//used only in progressHook to abstract encryption algotrithms
enum ENCRYPTION_TYPE_VERSION {
  'x25519-xsalsa20-poly1305' = 'PGP_V1',
  'aes256GcmHkdfSha256' = 'PGP_V2',
  'eip191-aes256-gcm-hkdf-sha256' = 'PGP_V3',
  'pgpv1:nft' = 'NFTPGP_V1',
}

export type AuthUpdateProps = {
  pgpPrivateKey: string; // decrypted pgp priv key
  pgpEncryptionVersion: ENCRYPTION_TYPE;
  signer: SignerType;
  pgpPublicKey: string;
  account?: string;
  env?: ENV;
  additionalMeta?: {
    NFTPGP_V1?: {
      password: string; //new nft profile password
    };
  };
  progressHook?: (progress: ProgressHookType) => void;
};

/**
 * Updation of encryption keys of a Push Profile to a specific version
 */
export const update = async (options: AuthUpdateProps): Promise<IUser> => {
  const {
    pgpPrivateKey,
    pgpEncryptionVersion,
    signer,
    pgpPublicKey,
    account = null,
    env = Constants.ENV.PROD,
    additionalMeta,
    progressHook,
  } = options || {};

  try {
    const wallet = getWallet({ account, signer });
    const address = await getAccountAddress(wallet);

    const updatingCreds =
      pgpEncryptionVersion === Constants.ENCRYPTION_TYPE.NFTPGP_V1
        ? true
        : false;

    if (!isValidETHAddress(address)) {
      throw new Error(`Invalid address!`);
    }

    const caip10 = walletToPCAIP10(address);
    const user = await get({ account: caip10, env: env });

    if (!user || !user.encryptedPrivateKey) {
      throw new Error('User not Found!');
    }

    // Report Progress
    updatingCreds
      ? progressHook?.({
          progressId: 'PUSH-AUTH-UPDATE-05',
          progressTitle: 'Generating New Profile Signature',
          progressInfo: `Trying to Update Push Profile creds. Please sign the message to continue.`,
          level: 'INFO',
        })
      : progressHook?.({
          progressId: 'PUSH-AUTH-UPDATE-01',
          progressTitle: 'Generating New Profile Signature',
          progressInfo: `Trying to Update Push Chat Keys to ${ENCRYPTION_TYPE_VERSION[pgpEncryptionVersion]} version. Please sign the message to continue.`,
          level: 'INFO',
        });

    const signedPublicKey = await preparePGPPublicKey(
      pgpEncryptionVersion,
      pgpPublicKey,
      wallet
    );

    // Report Progress
    updatingCreds
      ? progressHook?.({
          progressId: 'PUSH-AUTH-UPDATE-06',
          progressTitle: 'Generating New Profile Signature',
          progressInfo: `Encrypting Push Chat Keys with new creds. Please sign the message to continue.`,
          level: 'INFO',
        })
      : progressHook?.({
          progressId: 'PUSH-AUTH-UPDATE-02',
          progressTitle: 'Generating New Encrypted Profile',
          progressInfo: `Encrypting Push Chat Keys with ${ENCRYPTION_TYPE_VERSION[pgpEncryptionVersion]} version. Please sign the message to continue.`,
          level: 'INFO',
        });

    const encryptedPgpPrivateKey: encryptedPrivateKeyType = await encryptPGPKey(
      pgpEncryptionVersion,
      pgpPrivateKey,
      wallet,
      additionalMeta
    );

    if (pgpEncryptionVersion === ENCRYPTION_TYPE.NFTPGP_V1) {
      const encryptedPassword: encryptedPrivateKeyTypeV2 = await encryptPGPKey(
        ENCRYPTION_TYPE.PGP_V3,
        additionalMeta?.NFTPGP_V1?.password as string,
        wallet,
        additionalMeta
      );
      encryptedPgpPrivateKey.encryptedPassword = encryptedPassword;
    }

    const body = {
      user: user.did,
      wallet,
      name: user.name ? user.name : '',
      encryptedPassword: null,
      nftOwner:
        pgpEncryptionVersion === ENCRYPTION_TYPE.NFTPGP_V1
          ? walletToPCAIP10((await signer?.getAddress()) as string)
          : null, // check for nft,
      publicKey: signedPublicKey,
      encryptedPrivateKey: JSON.stringify(encryptedPgpPrivateKey),
      encryptionType: pgpEncryptionVersion,
      env,
    };

    // Report Progress
    progressHook?.({
      progressId: 'PUSH-AUTH-UPDATE-03',
      progressTitle: 'Syncing Updated Profile',
      progressInfo:
        'Please sign the message to continue. Steady lads, chat is almost ready!',
      level: 'INFO',
    });

    const updatedUser = await authUpdateUserService(body);

    // Report Progress
    progressHook?.({
      progressId: 'PUSH-AUTH-UPDATE-04',
      progressTitle: 'Update Completed, Welcome to Push Chat',
      progressInfo: '',
      level: 'SUCCESS',
    });
    return updatedUser;
  } catch (err) {
    progressHook?.({
      progressId: 'PUSH-ERROR-00',
      progressTitle: 'Non Specific Error',
      progressInfo: `[Push SDK] - API  - Error - API auth.update User() -: ${err}`,
      level: 'ERROR',
    });
    throw Error(`[Push SDK] - API  - Error - API auth.update User() -: ${err}`);
  }
};
