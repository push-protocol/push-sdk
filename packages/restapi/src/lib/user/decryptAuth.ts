import Constants, { ENV } from '../constants';
import { decryptPGPKey, isValidNFTCAIP, isValidSCWCAIP } from '../helpers';
import PROGRESSHOOK from '../progressHook';
import {
  ProgressHookType,
  ProgressHookTypeFunction,
  SignerType,
} from '../types';

type decryptAuthProps = {
  signer: SignerType;
  account?: string;
  env?: ENV;
  additionalMeta?: {
    NFTPGP_V1?: {
      encryptedPassword: string;
    };
    SCWPGP_V1?: {
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
): Promise<string | null> => {
  const {
    account,
    signer,
    env = Constants.ENV.PROD,
    additionalMeta,
    progressHook,
  } = options || {};
  try {
    if (
      !isValidNFTCAIP(account as string) &&
      !isValidSCWCAIP(account as string)
    ) {
      return null;
    }
    // Report Progress
    progressHook?.(PROGRESSHOOK['PUSH-DECRYPT-AUTH-01'] as ProgressHookType);

    // Get the encryptedPassword from either NFTPGP_V1 or SCWPGP_V1
    const encryptedPassword =
      additionalMeta?.NFTPGP_V1?.encryptedPassword ||
      additionalMeta?.SCWPGP_V1?.encryptedPassword;

    if (!encryptedPassword) {
      throw new Error('encryptedPassword is required!');
    }

    const password = await decryptPGPKey({
      encryptedPGPPrivateKey: encryptedPassword as string,
      signer,
      account,
      env,
    });

    // Report Progress
    progressHook?.(PROGRESSHOOK['PUSH-DECRYPT-AUTH-02'] as ProgressHookType);
    return password;
  } catch (err) {
    // Report Progress
    progressHook?.(
      (PROGRESSHOOK['PUSH-ERROR-00'] as ProgressHookTypeFunction)(
        decryptAuth.name,
        err
      )
    );
    throw Error(
      `[Push SDK] - API  - Error - API ${decryptAuth.name} -: ${err}`
    );
  }
};
