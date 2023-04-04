import {
  upgradeUserService,
  getAccountAddress,
  getWallet,
} from '../chat/helpers';
import Constants, { ENV } from '../constants';
import {
  isValidETHAddress,
  walletToPCAIP10,
  encryptPGPKey,
  preparePGPPublicKey,
  decryptPGPKey,
} from '../helpers';
import {
  SignerType,
  encryptedPrivateKeyType,
  IUser,
  ProgressHookType,
} from '../types';
import { get } from './getUser';

export type UpgradeUserProps = {
  env?: ENV;
  account?: string;
  signer: SignerType;
  progressHook?: (progress: ProgressHookType) => void;
};

export const upgrade = async (options: UpgradeUserProps) => {
  const {
    env = Constants.ENV.PROD,
    account = null,
    signer = null,
    progressHook,
  } = options || {};

  if (signer == null) {
    throw new Error(`Signer is necessary!`);
  }

  const wallet = getWallet({ account, signer });
  const address = await getAccountAddress(wallet);

  if (!isValidETHAddress(address)) {
    throw new Error(`Invalid address!`);
  }

  const user: IUser = await get({ account: address, env: env });

  // User not created or already upgraded
  if (!user || user.encryptionType === Constants.ENC_TYPE_V3) {
    return user;
  }

  const caip10: string = walletToPCAIP10(address);
  const encryptionType: string = Constants.ENC_TYPE_V3;

  // Report Progress
  progressHook?.({
    progressId: 2,
    progressTitle: 'Step 1/5: Creating Push Chat Profile',
    progressInfo:
      'Trying to Upgrade Push Chat Keys to latest version. Please sign the message to continue.',
    level: 'INFO',
  });

  const publicKey: string = await preparePGPPublicKey(
    encryptionType,
    user.publicKey,
    wallet
  );

  // Report Progress
  progressHook?.({
    progressId: 3,
    progressTitle: 'Step 2/5: Decrypting Old Push Chat Keys and verifying env',
    progressInfo:
      'Trying to Upgrade Push Chat Keys to latest version. Please sign the message to continue.',
    level: 'INFO',
  });
  const privateKey = await decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,
    account: address,
    signer: signer,
    env,
    toUpgrade: false,
  });

  // Report Progress
  progressHook?.({
    progressId: 4,
    progressTitle: 'Step 3/5: Enabling Push Chat Profile',
    progressInfo:
      'Trying to Upgrade Push Chat Keys to latest version. Encrypting Push Chat Keys with latest version. Please sign the message to continue.',
    level: 'INFO',
  });
  const encryptedPrivateKey: encryptedPrivateKeyType = await encryptPGPKey(
    encryptionType,
    privateKey,
    address,
    wallet
  );

  const body = {
    user: caip10,
    wallet,
    name: user.name ? user.name : '',
    encryptedPassword: user.encryptedPassword,
    nftOwner: user.nftOwner,
    publicKey: publicKey,
    encryptedPrivateKey: JSON.stringify(encryptedPrivateKey),
    encryptionType: encryptionType,
    env,
  };

  // Report Progress
  progressHook?.({
    progressId: 5,
    progressTitle:
      'Step 4/5: Generating Verification Proofs and Syncing account info',
    progressInfo:
      'Please sign the message to continue. Steady lads, chat is almost ready!',
    level: 'INFO',
  });
  const upgradedUser = await upgradeUserService(body);
  // Report Progress
  progressHook?.({
    progressId: 6,
    progressTitle: 'Step 5/5 Done, Welcome to Push Chat!',
    progressInfo: '',
    level: 'SUCCESS',
  });
  return upgradedUser;
};
