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
  version?: typeof Constants.ENC_TYPE_V1 | typeof Constants.ENC_TYPE_V2;
  progressHook?: (progress: ProgressHookType) => void;
};

export const create = async (options: CreateUserProps) => {
  const {
    env = Constants.ENV.PROD,
    account = null,
    signer = null,
    version = Constants.ENC_TYPE_V2,
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
    const encryptionType: string =
      wallet?.signer && version === Constants.ENC_TYPE_V2
        ? Constants.ENC_TYPE_V2
        : Constants.ENC_TYPE_V1;

    // Report Progress
    progressHook?.({
      progressId: 1,
      progressTitle: 'Step 1/5: Generating secure keys for your account',
      progressInfo:
        'This step is is only done for first time users and might take a few seconds. PGP keys are getting generated to provide you with secure yet seamless chat',
      level: 'INFO',
    });
    const keyPairs = await generateKeyPair();

    // Report Progress
    progressHook?.({
      progressId: 2,
      progressTitle: 'Step 2/5: Creating Push Chat Profile',
      progressInfo:
        'This step is is only done for first time users.Please sign the transaction to continue.',
      level: 'INFO',
    });
    const publicKey: string = await preparePGPPublicKey(
      encryptionType,
      keyPairs.publicKeyArmored,
      address,
      wallet
    );

    // Report Progress
    progressHook?.({
      progressId: 3,
      progressTitle: 'Step 3/5: Enabling Push Chat Profile',
      progressInfo:
        'Encrypting your keys. Please sign the transaction to continue.',
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
      progressId: 4,
      progressTitle:
        'Step 4/5: Generating Verification Proofs and Syncing account info',
      progressInfo:
        'Please sign the transaction to continue. Steady lads, chat is almost ready!',
      level: 'INFO',
    });
    const createdUser = await createUserService(body);

    // Report Progress
    progressHook?.({
      progressId: 5,
      progressTitle: 'Step 5/5 Done, Welcome to Push Chat!',
      progressInfo: '',
      level: 'SUCCESS',
    });
    return createdUser;
  } catch (err) {
    progressHook?.({
      progressId: 0,
      progressTitle: 'Error In Creating Push Chat User',
      progressInfo: JSON.stringify(err),
      level: 'ERROR',
    });
  }
};
