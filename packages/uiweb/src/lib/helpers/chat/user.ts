import type { Env, IUser } from '@pushprotocol/restapi';
import { ProfilePicture } from '../../config';
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
