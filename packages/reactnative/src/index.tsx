import '../shim.js';
import 'text-encoding';
import 'react-native-crypto';
import 'react-native-get-random-values';

import OpenPGP from 'react-native-fast-openpgp';
import { ethers } from 'ethers';

import * as PushApi from '@pushprotocol/restapi';
import { CreateUserProps } from '@pushprotocol/restapi/src/lib/user/createUser.js';
import { IPGPHelper } from '@pushprotocol/restapi/src/lib/chat/helpers/pgp.js';
import { ENV } from '@pushprotocol/restapi/src/lib/constants.js';

// TODO:fix this
//@ts-ignore
crypto.getRandomValues = (input) => {
  return input;
};

// const randomBytes = new Uint8Array(8);
// console.log('inital', randomBytes);
// //@ts-ignore
// let res = crypto.getRandomValues(randomBytes);
// console.log('got res', res);

const PGPHelper: IPGPHelper = {
  async generateKeyPair() {
    let keys = await OpenPGP.generate({ keyOptions: { rsaBits: 2048 } });
    return {
      privateKeyArmored: keys.privateKey,
      publicKeyArmored: keys.publicKey,
    };
  },
};

const createUser = async (options: CreateUserProps) => {
  let user = await PushApi.user.createUserCore(options, PGPHelper);
  return user;
};

// checking if ethers works
const genRandomAddress = async () => {
  const privateKey =
    '25520e97c3f31af3824ff62e350126299997322ff7d340ffd81faa7f84609ef9';

  // Create an instance of Wallet using the private key
  const wallet = new ethers.Wallet(privateKey);

  // Get the address from the wallet
  const address = wallet.address;

  return address;
};

export {
  PGPHelper,
  genRandomAddress,
  createUser,
  PushApi,
  CreateUserProps,
  ENV,
};
