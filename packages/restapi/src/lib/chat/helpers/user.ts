import Constants, { ENV } from '../../constants';
import { get, create, createUserCore } from '../../user';
import { IConnectedUser, IUser, SignerType, walletType } from '../../types';
import { getAccountAddress } from './wallet';
import { IPGPHelper, PGPHelper, getDecryptedPrivateKey } from '.';
import {
  isValidCAIP10NFTAddress,
  isValidETHAddress,
  walletToPCAIP10,
} from '../../helpers';

export const createUserIfNecessary = async (
  wallet: walletType,
  env: ENV
): Promise<IUser> => {
  const address = await getAccountAddress(wallet);
  const connectedUser = await get({ account: address, env });
  if (!connectedUser?.encryptedPrivateKey) {
    const createUserProps: {
      account?: string;
      signer?: SignerType;
      env?: ENV;
    } = {};
    if (wallet.account) {
      createUserProps.account = wallet.account;
    }
    if (wallet.signer) {
      createUserProps.signer = wallet.signer;
    }
    createUserProps.env = env;
    const createdUser: IUser = await create(createUserProps);
    return createdUser;
  } else {
    return connectedUser;
  }
};

export const getConnectedUser = async (
  wallet: walletType,
  privateKey: string | null,
  env: ENV
): Promise<IConnectedUser> => {
  const address = await getAccountAddress(wallet);
  const user = await get({ account: address, env: env || Constants.ENV.PROD });
  if (user?.encryptedPrivateKey) {
    if (privateKey) {
      return { ...user, privateKey };
    } else {
      throw new Error(`Decrypted pgp private key required as input`);
    }
  } else {
    const createUserProps: {
      account?: string;
      signer?: SignerType;
      env?: ENV;
    } = {};
    if (wallet.account) {
      createUserProps.account = wallet.account;
    }
    if (user && user.did) {
      createUserProps.account = user.did;
    }
    if (wallet.signer) {
      createUserProps.signer = wallet.signer;
    }
    createUserProps.env = env;
    const newUser = await create(createUserProps);
    const decryptedPrivateKey = await getDecryptedPrivateKey(
      wallet,
      newUser,
      address,
      env
    );
    return { ...newUser, privateKey: decryptedPrivateKey };
  }
};

export const getConnectedUserV2 = async (
  wallet: walletType,
  privateKey: string | null,
  env: ENV
): Promise<IConnectedUser> => {
  return await getConnectedUserV2Core(wallet, privateKey, env, PGPHelper);
};

export const getConnectedUserV2Core = async (
  wallet: walletType,
  privateKey: string | null,
  env: ENV,
  pgpHelper: IPGPHelper
): Promise<IConnectedUser> => {
  const address = await getAccountAddress(wallet);
  const user = await get({ account: address, env: env || Constants.ENV.PROD });
  if (user?.encryptedPrivateKey) {
    if (privateKey) {
      return { ...user, privateKey };
    } else {
      console.warn(
        "Please note that if you don't pass the pgpPrivateKey parameter, a wallet popup will appear every time the approveRequest endpoint is called. We strongly recommend passing this parameter, and it will become mandatory in future versions of the API."
      );
      const decryptedPrivateKey = await getDecryptedPrivateKey(
        wallet,
        user,
        address,
        env
      );
      return { ...user, privateKey: decryptedPrivateKey };
    }
  } else {
    const createUserProps: {
      account?: string;
      signer?: SignerType;
      env?: ENV;
    } = {};
    if (wallet.account) {
      createUserProps.account = wallet.account;
    }
    if (user && user.did) {
      createUserProps.account = user.did;
    }
    if (wallet.signer) {
      createUserProps.signer = wallet.signer;
    }
    createUserProps.env = env;
    const newUser = await createUserCore(createUserProps, pgpHelper);
    const decryptedPrivateKey = await getDecryptedPrivateKey(
      wallet,
      newUser,
      address,
      env
    );
    return { ...newUser, privateKey: decryptedPrivateKey };
  }
};

export const getUserDID = async (
  address: string,
  env: ENV
): Promise<string> => {
  if (isValidCAIP10NFTAddress(address)) {
    if (address.split(':').length === 6) return address;
    const user = await get({ account: address, env: env });
    if (user && user.did) return user.did;
    const epoch = Math.floor(Date.now() / 1000);
    address = `${address}:${epoch}`;
  }
  if (isValidETHAddress(address)) return walletToPCAIP10(address);
  return address;
};
