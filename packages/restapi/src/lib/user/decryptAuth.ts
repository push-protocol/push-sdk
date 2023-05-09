import Constants, { ENV } from '../constants';
import { decryptPGPKey } from '../helpers';
import { ProgressHookType, SignerType } from '../types';

type decryptAuthProps = {
  signer: SignerType;
  account?: string;
  env?: ENV;
  additionalMeta?: {
    NFTPGP_V1?: {
      encryptedPassword: string;
    };
  };
  /**
   * To get Progress Related to fn
   */
  progressHook?: (progress: ProgressHookType) => void;
};

/**
 *
 * @returns Decrypted Push Profile Password
 */
export const decryptAuth = async (
  options: decryptAuthProps
): Promise<string> => {
  const {
    account,
    signer,
    env = Constants.ENV.PROD,
    additionalMeta,
    progressHook,
  } = options || {};
  try {
    progressHook?.({
      progressId: 'PUSH-DECRYPT-AUTH-01',
      progressTitle: 'Decrypting Profile Creds',
      progressInfo: 'Please sign the transaction to decrypt profile creds',
      level: 'INFO',
    });

    const password = await decryptPGPKey({
      encryptedPGPPrivateKey: additionalMeta?.NFTPGP_V1
        ?.encryptedPassword as string,
      signer,
      account,
      env,
    });

    progressHook?.({
      progressId: 'PUSH-DECRYPT-AUTH-02',
      progressTitle: 'Push Profile Creds Unlocked',
      progressInfo: 'Unlocking push profile creds',
      level: 'SUCCESS',
    });
    return password;
  } catch (err) {
    // Report Progress
    progressHook?.({
      progressId: 'PUSH-ERROR-00',
      progressTitle: 'Non Specific Error',
      progressInfo: `[Push SDK] - API  - Error - API ${decryptAuth.name} -: ${err}`,
      level: 'ERROR',
    });
    throw Error(
      `[Push SDK] - API  - Error - API ${decryptAuth.name} -: ${err}`
    );
  }
};
