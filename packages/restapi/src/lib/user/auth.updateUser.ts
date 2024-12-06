import {
  authUpdateUserService,
  getAccountAddress,
  getWallet,
} from '../chat/helpers';
import Constants, { ENV, ENCRYPTION_TYPE } from '../constants';
import {
  convertPartialCAIPToFullCAIP,
  encryptPGPKey,
  getFallbackChainId,
  isValidPushCAIP,
  preparePGPPublicKey,
  walletToPCAIP10,
  Signer as PushSigner,
} from '../helpers';
import PROGRESSHOOK from '../progressHook';
import {
  SignerType,
  IUser,
  ProgressHookType,
  encryptedPrivateKeyType,
  encryptedPrivateKeyTypeV2,
  ProgressHookTypeFunction,
} from '../types';
import { get } from './getUser';

//used only in progressHook to abstract encryption algotrithms
const ENCRYPTION_TYPE_VERSION: Record<ENCRYPTION_TYPE, string> = {
  [ENCRYPTION_TYPE.PGP_V1]: 'PGP_V1',
  [ENCRYPTION_TYPE.PGP_V2]: 'PGP_V2',
  [ENCRYPTION_TYPE.PGP_V3]: 'PGP_V3',
  [ENCRYPTION_TYPE.NFTPGP_V1]: 'NFTPGP_V1',
  [ENCRYPTION_TYPE.SCWPGP_V1]: 'SCWPGP_V1',
};

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
    SCWPGP_V1?: {
      password: string;
    };
  };
  progressHook?: (progress: ProgressHookType) => void;
};

/**
 * Updation of encryption keys of a Push Profile to a specific version
 */
export const authUpdate = async (options: AuthUpdateProps): Promise<IUser> => {
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
      pgpEncryptionVersion === Constants.ENCRYPTION_TYPE.NFTPGP_V1 ||
      pgpEncryptionVersion === Constants.ENCRYPTION_TYPE.SCWPGP_V1
        ? true
        : false;

    if (!isValidPushCAIP(address)) {
      throw new Error(`Invalid address!`);
    }

    const caip10 = walletToPCAIP10(address);
    const user = await get({ account: caip10, env: env });

    if (!user || !user.encryptedPrivateKey) {
      throw new Error('User not Found!');
    }

    // Report Progress
    updatingCreds
      ? progressHook?.(PROGRESSHOOK['PUSH-AUTH-UPDATE-05'] as ProgressHookType)
      : progressHook?.(
          (PROGRESSHOOK['PUSH-AUTH-UPDATE-01'] as ProgressHookTypeFunction)(
            ENCRYPTION_TYPE_VERSION[pgpEncryptionVersion]
          )
        );
    const signedPublicKey = await preparePGPPublicKey(
      pgpEncryptionVersion,
      pgpPublicKey,
      wallet
    );

    // Report Progress
    updatingCreds
      ? progressHook?.(PROGRESSHOOK['PUSH-AUTH-UPDATE-06'] as ProgressHookType)
      : progressHook?.(
          (PROGRESSHOOK['PUSH-AUTH-UPDATE-02'] as ProgressHookTypeFunction)(
            ENCRYPTION_TYPE_VERSION[pgpEncryptionVersion]
          )
        );
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
    if (pgpEncryptionVersion === ENCRYPTION_TYPE.SCWPGP_V1) {
      const encryptedPassword: encryptedPrivateKeyTypeV2 = await encryptPGPKey(
        ENCRYPTION_TYPE.PGP_V3,
        additionalMeta?.SCWPGP_V1?.password as string,
        wallet,
        additionalMeta
      );
      encryptedPgpPrivateKey.encryptedPassword = encryptedPassword;
    }

    let chainId: string;
    if (signer) {
      chainId = (await new PushSigner(signer).getChainId()).toString();
    } else {
      chainId = getFallbackChainId(env, address) as string;
    }
    // Report Progress
    progressHook?.(PROGRESSHOOK['PUSH-AUTH-UPDATE-03'] as ProgressHookType);
    const body = {
      user: user.did,
      userFullCAIP: convertPartialCAIPToFullCAIP(user.did, chainId),
      wallet,
      publicKey: signedPublicKey,
      encryptedPrivateKey: JSON.stringify(encryptedPgpPrivateKey),
      env,
    };
    const updatedUser = await authUpdateUserService(body);

    // Report Progress
    progressHook?.(PROGRESSHOOK['PUSH-AUTH-UPDATE-04'] as ProgressHookType);
    return updatedUser;
  } catch (err) {
    // Report Progress
    const errorProgressHook = PROGRESSHOOK[
      'PUSH-ERROR-00'
    ] as ProgressHookTypeFunction;
    progressHook?.(errorProgressHook(authUpdate.name, err));
    throw Error(`[Push SDK] - API - Error - API ${authUpdate.name} -: ${err}`);
  }
};
