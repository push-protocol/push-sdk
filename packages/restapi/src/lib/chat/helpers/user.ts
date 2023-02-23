import Constants from '../../constants';
import { get, create } from '../../user';
import { decryptPGPKey, decryptWithWalletRPCMethod } from '../../helpers';
import { AccountEnvOptionsType, IConnectedUser, IUser, SignerType, walletType } from '../../types';
import { getAccountAddress } from './wallet';

export const createUserIfNecessary = async (
  options: AccountEnvOptionsType
): Promise<IUser> => {
  const { account, env = Constants.ENV.PROD } = options || {};
  const connectedUser = await get({ account: account, env });
  if (!connectedUser?.encryptedPrivateKey) {
    const createdUser: IUser = await create({ account: account, env });
    return createdUser;
  } else {
    return connectedUser;
  }
};

export const getConnectedUser = async (
  wallet: walletType,
  privateKey: string | null,
  env: string
): Promise<IConnectedUser> => {
  const address = await getAccountAddress(wallet);
  const user = await get({ account: address, env: env || Constants.ENV.PROD });
  if (user?.encryptedPrivateKey) {
    if (privateKey) { 
      return { ...user, privateKey };
    }
    else {
      throw new Error(`Decrypted private key required as input`);
    }
  }
  else {
    const createUserProps: {
      account?: string;
      signer?: SignerType;
      env?: string;
    } = {};
    if(wallet.account) {
      createUserProps.account = wallet.account;
    } 
    if(wallet.signer) {
      createUserProps.signer = wallet.signer;
    }
    createUserProps.env = env;
    const newUser = await create(createUserProps);
    let decryptedPrivateKey;
    if(wallet.signer) {
      decryptedPrivateKey = await decryptPGPKey({
        signer: wallet.signer,
        encryptedMessage: newUser.encryptedPrivateKey
      })
    } else {
      decryptedPrivateKey = await decryptWithWalletRPCMethod(
        newUser.encryptedPrivateKey,
        address
      );
    }
    return { ...newUser, privateKey: decryptedPrivateKey };
  }
};
