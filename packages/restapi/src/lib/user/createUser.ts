import {
  createUserService,
  generateKeyPair,
  generateRandomSecret,
  getAccountAddress,
  getWallet,
} from '../chat/helpers';
import Constants, { ENV } from '../constants';
import {
  isValidETHAddress,
  walletToPCAIP10,
  encryptPGPKey,
  preparePGPPublicKey,
  isValidCAIP10NFTAddress,
  validatePssword,
} from '../helpers';
import {
  SignerType,
  encryptedPrivateKeyType,
  ProgressHookType,
  IUser,
  encryptedPrivateKeyTypeV2,
} from '../types';

export type CreateUserProps = {
  env?: ENV;
  account?: string;
  signer?: SignerType;
  version?: typeof Constants.ENC_TYPE_V1 | typeof Constants.ENC_TYPE_V3;
  additionalMeta?: { password?: string };
  progressHook?: (progress: ProgressHookType) => void;
};

export const create = async (options: CreateUserProps): Promise<IUser> => {
  const {
    env = Constants.ENV.PROD,
    account = null,
    signer = null,
    version = Constants.ENC_TYPE_V3,
    additionalMeta,
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
    if (additionalMeta && additionalMeta.password) {
      validatePssword(additionalMeta.password);
    }

    const caip10: string = walletToPCAIP10(address);
    let encryptionType = version;

    if (isValidCAIP10NFTAddress(caip10)) {
      // upgrade to v4 (nft encryption)
      encryptionType = Constants.ENC_TYPE_V4;
    } else {
      // downgrade to v1
      if (!signer) encryptionType = Constants.ENC_TYPE_V1;
    }

    // Report Progress
    progressHook?.({
      progressId: 'PUSH-CREATE-01',
      progressTitle: 'Generating Secure Profile Signature',
      progressInfo:
        'This step is only done for first time users and might take a few seconds. PGP keys are getting generated to provide you with secure yet seamless chat',
      level: 'INFO',
    });
    const keyPairs = await generateKeyPair();

    // Report Progress
    progressHook?.({
      progressId: 'PUSH-CREATE-02',
      progressTitle: 'Signing Generated Profile',
      progressInfo:
        'This step is only done for first time users. Please sign the message to continue.',
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

    let password: string;
    if (!additionalMeta?.password) {
      password = generateRandomSecret(10);
    } else {
      password = additionalMeta.password;
    }
    const encryptedPrivateKey: encryptedPrivateKeyType = await encryptPGPKey(
      encryptionType,
      keyPairs.privateKeyArmored,
      wallet,
      { password: password }
    );

    if (encryptionType === Constants.ENC_TYPE_V4) {
      const encryptedPassword: encryptedPrivateKeyTypeV2 = await encryptPGPKey(
        Constants.ENC_TYPE_V3,
        password,
        wallet,
        additionalMeta
      );
      encryptedPrivateKey.encryptedPassword = encryptedPassword;
    }

    const body = {
      user: caip10,
      wallet,
      publicKey: publicKey,
      encryptedPrivateKey: JSON.stringify(encryptedPrivateKey),
      encryptionType: encryptionType,
      env,
      nftOwner:
        encryptionType === Constants.ENC_TYPE_V4
          ? walletToPCAIP10((await signer?.getAddress()) as string)
          : null, // check for nft
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
