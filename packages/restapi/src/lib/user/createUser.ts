import {
  createUserService,
  generateKeyPair,
  getAccountAddress,
  getWallet,
} from '../chat/helpers';
import Constants, { ENV } from '../constants';
import {
  isValidETHAddress,
  walletToPCAIP10,
  encryptPGPKey,
  preparePGPPublicKey,
} from '../helpers';
import {
  SignerType,
  encryptedPrivateKeyType,
  ProgressHookType,
} from '../types';

export type CreateUserProps = {
  env?: ENV;
  account?: string;
  signer?: SignerType;
  version?: typeof Constants.ENC_TYPE_V1 | typeof Constants.ENC_TYPE_V3;
  progressHook?: (progress: ProgressHookType) => void;
};

export const create = async (options: CreateUserProps) => {
  const {
    env = Constants.ENV.PROD,
    account = null,
    signer = null,
    version = Constants.ENC_TYPE_V3,
    progressHook,
  } = options || {};

  try {
    if (account == null && signer == null) {
      throw new Error(`At least one from account or signer is necessary!`);
    }

    const wallet = getWallet({ account, signer });
    const address = await getAccountAddress(wallet);

    if (!isValidETHAddress(address)) {
      throw new Error(`Invalid address!`);
    }

    const caip10: string = walletToPCAIP10(address);
    let encryptionType = version;

    // falback to v1
    if (!signer) encryptionType = Constants.ENC_TYPE_V1;

    // Report Progress
    progressHook?.({
      progressId: 'PUSH-CREATE-01',
      progressTitle: 'Generating Secure Profile Signature',
      progressInfo:
        'This step is is only done for first time users and might take a few seconds. PGP keys are getting generated to provide you with secure yet seamless chat',
      level: 'INFO',
    });
    const keyPairs = await generateKeyPair();

    // Report Progress
    progressHook?.({
      progressId: 'PUSH-CREATE-02',
      progressTitle: 'Signing Generated Profile',
      progressInfo:
        'This step is is only done for first time users. Please sign the message to continue.',
      level: 'INFO',
    });
    const publicKey: string = await preparePGPPublicKey(
      encryptionType,
      keyPairs.publicKeyArmored,
      wallet
    );

    // Report Progress
    progressHook?.({
      progressId: 'PUSH-CREATE-03',
      progressTitle: 'Encrypting Generated Profile',
      progressInfo:
        'Encrypting your keys. Please sign the message to continue.',
      level: 'INFO',
    });
    const encryptedPrivateKey: encryptedPrivateKeyType = await encryptPGPKey(
      encryptionType,
      keyPairs.privateKeyArmored,
      address,
      wallet
    );

    const body = {
      user: caip10,
      wallet,
      publicKey: publicKey,
      encryptedPrivateKey: JSON.stringify(encryptedPrivateKey),
      encryptionType: encryptionType,
      env,
    };

    // Report Progress
    progressHook?.({
      progressId: 'PUSH-CREATE-04',
      progressTitle: 'Syncing Generated Profile',
      progressInfo:
        'Please sign the message to continue. Steady lads, chat is almost ready!',
      level: 'INFO',
    });
    const createdUser = await createUserService(body);

    // Report Progress
    progressHook?.({
      progressId: 'PUSH-CREATE-05',
      progressTitle: 'Setup Complete',
      progressInfo: '',
      level: 'SUCCESS',
    });
    return createdUser;
  } catch (err) {
    progressHook?.({
      progressId: 'PUSH-ERROR-00',
      progressTitle: 'Non Specific Error',
      progressInfo: `[Push SDK] - API  - Error - API create User() -: ${err}`,
      level: 'ERROR',
    });
    throw Error(`[Push SDK] - API  - Error - API create User() -: ${err}`);
  }
};
