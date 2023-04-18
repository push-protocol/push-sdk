import Constants, { ENV } from '../constants';
import { SignerType, ProgressHookType } from '../types';
import { decryptPGPKey, decryptV2, hexToBytes, stringToHex } from '../helpers';

type decryptPgpKeyProps = {
  encryptedPGPPrivateKey: string;
  signer?: SignerType | null;
  encryptedPassword?: string | null;
  decryptedPassword?: string | null;
  env?: ENV;
  progressHook?: (progress: ProgressHookType) => void;
};

export const decryptNFTProfile = async (options: decryptPgpKeyProps) => {
  const {
    encryptedPGPPrivateKey,
    encryptedPassword = null,
    decryptedPassword = null,
    signer = null,
    env = Constants.ENV.PROD,
    progressHook,
  } = options || {};
  try {
    let privateKey = '';
    let decryptionTry1 = false;
    progressHook?.({
      progressId: 'PUSH-DECRYPT-01',
      progressTitle: 'Decrypting Profile',
      progressInfo: 'Please sign the transaction to decrypt profile',
      level: 'INFO',
    });
    // try decrypting pgp keys from decryptedPassword
    if (decryptedPassword) {
      try {
        const encodedPrivateKey = await decryptV2(
          JSON.parse(encryptedPGPPrivateKey),
          hexToBytes(stringToHex(decryptedPassword))
        );
        const dec = new TextDecoder();
        privateKey = dec.decode(encodedPrivateKey);
        decryptionTry1 = true;
      } catch (err) {
        // Report Progress
        progressHook?.({
          progressId: 'PUSH-ERROR-01',
          progressTitle: 'Decrypt Profile Failed',
          progressInfo: `[Push SDK] - API  - Error - API decrypt Pgp Key() -: ${err}`,
          level: 'WARN',
        });
      }
    }

    if (!decryptionTry1) {
      if (signer === null || encryptedPassword === null) {
        throw new Error('Unable To decrypt Profile!');
      }
      const password = await decryptPGPKey({
        encryptedPGPPrivateKey: encryptedPassword as string,
        signer,
        env,
      });
      const encodedPrivateKey = await decryptV2(
        JSON.parse(encryptedPGPPrivateKey),
        hexToBytes(stringToHex(password))
      );
      const dec = new TextDecoder();
      privateKey = dec.decode(encodedPrivateKey);
    }

    progressHook?.({
      progressId: 'PUSH-DECRYPT-02',
      progressTitle: 'Push Profile Unlocked',
      progressInfo: 'Unlocking push profile',
      level: 'SUCCESS',
    });
    return privateKey;
  } catch (err) {
    // Report Progress
    progressHook?.({
      progressId: 'PUSH-ERROR-00',
      progressTitle: 'Non Specific Error',
      progressInfo: `[Push SDK] - API  - Error - API decrypt Pgp Key() -: ${err}`,
      level: 'ERROR',
    });
    console.error(
      `[Push SDK] - API  - Error - API decrypt Pgp Key() -:  `,
      err
    );
    throw Error(`[Push SDK] - API  - Error - API decrypt Pgp Key() -: ${err}`);
  }
};
