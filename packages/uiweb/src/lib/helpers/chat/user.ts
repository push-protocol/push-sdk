import type { Env, IUser } from '@pushprotocol/restapi';
import {

  ProfilePicture,
} from '../../config';
import { ethers } from 'ethers';
import { getUdResolver } from '../udResolver';


export const displayDefaultUser = ({ caip10 }: { caip10: string }): IUser => {
  const userCreated: IUser = {
    did: caip10,
    wallets: caip10,
    publicKey: '',
    profilePicture: ProfilePicture,
    encryptedPrivateKey: '',
    encryptionType: '',
    signature: '',
    sigType: '',
    encryptedPassword: null,
    about: null,
    name: null,
    numMsg: 1,
    allowedNumMsg: 100,
    nftOwner: null,
    linkedListHash: null,
    msgSent: 0,
    maxMsgPersisted: 0,
    profile: {
      name: null,
      desc: null,
      picture: ProfilePicture,
      profileVerificationProof: null,
      blockedUsersList: null,
    },
    verificationProof: '',
  };
  return userCreated;
};
export const getEnsName = async (
  provider: ethers.providers.BaseProvider | any,
  checksumWallet: string,
  setWeb3Name: (id: string, web3Name: string) => void
) => {
  let ensName: string | null = null;
  provider.lookupAddress(checksumWallet).then(async (ens: string) => {
    if (ens) {
      ensName = ens;
      setWeb3Name(checksumWallet.toLowerCase(), ensName);
    } else {
      ensName = null;
    }
  });
  return ensName;
};

export const getUnstoppableName = async (
  checksumWallet: string,
  setWeb3Name: (id: string, web3Name: string) => void,
  env: Env
) => {
  // Unstoppable Domains resolution library
  const udResolver = getUdResolver(env);

  // attempt reverse resolution on provided address
  let udName = await udResolver.reverse(checksumWallet);
  if (udName) {
    setWeb3Name(checksumWallet.toLowerCase(), udName);
  } else {
    udName = null;
  }
  return udName;
};


