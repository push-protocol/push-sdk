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
  encryptV3,
  hexToBytes,
} from '../helpers';
import {
  SignerType,
  encryptedPrivateKeyType,
  ProgressHookType,
  IUser,
} from '../types';

export type createNFTProfile = {
  env?: ENV;
  account?: string;
  signer: SignerType;
  password: string;
  nftChainId: number;
  nftTokenId: number;
  nftContractAddress: string;
  progressHook?: (progress: ProgressHookType) => void;
};

export const createNFTProfile = async (
  options: createNFTProfile
): Promise<IUser> => {
  const {
    env = Constants.ENV.PROD,
    account = null,
    signer,
    password,
    nftChainId,
    nftTokenId,
    nftContractAddress,
    progressHook,
  } = options || {};

  try {
    if (
      signer === null ||
      password === null ||
      nftTokenId === null ||
      nftChainId === null ||
      nftContractAddress === null
    ) {
      throw new Error(`Invalid Params Passed!`);
    }

    const wallet = getWallet({ account, signer });
    const address = await getAccountAddress(wallet);

    if (!isValidETHAddress(address)) {
      throw new Error(`Invalid address!`);
    }

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
    const encryptionType = Constants.ENC_TYPE_V3;
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
    // encrypt priv key with password
    const enc = new TextEncoder();
    const encodedPrivateKey = enc.encode(keyPairs.privateKeyArmored);
    const encryptedPrivateKey = await encryptV3(
      encodedPrivateKey,
      hexToBytes(password)
    );

    // encrypt password instead of priv key
    const encryptedPassword: encryptedPrivateKeyType = await encryptPGPKey(
      encryptionType,
      password,
      address,
      wallet
    );

    const body = {
      user: `eip155:${nftChainId}:${nftContractAddress}:nft:${nftTokenId}`,
      wallet,
      publicKey: publicKey,
      encryptedPrivateKey: JSON.stringify(encryptedPrivateKey),
      encryptionType: encryptionType,
      encryptedPassword: JSON.stringify(encryptedPassword),
      nftOwner: walletToPCAIP10(address),
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
      progressInfo: `[Push SDK] - API  - Error - API createNFTProfile() -: ${err}`,
      level: 'ERROR',
    });
    throw Error(`[Push SDK] - API  - Error - API createNFTProfile() -: ${err}`);
  }
};
