import '../shim.js';
import 'text-encoding';
import 'react-native-crypto';
import 'react-native-get-random-values';

import OpenPGP from 'react-native-fast-openpgp';
import { ethers } from 'ethers';

import * as PushApi from '@pushprotocol/restapi';
import { IPGPHelper } from '@pushprotocol/restapi/src/lib/chat/helpers/pgp.js';
import Constants from '@pushprotocol/restapi/src/lib/constants.js';
import { decryptPGPKey } from '@pushprotocol/restapi/src/lib/helpers/crypto.js';

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

  async sign({ message, signingKey }) {
    const publicKey = await OpenPGP.convertPrivateKeyToPublicKey(signingKey);
    const signature = await OpenPGP.sign(message, publicKey, signingKey, '');
    return signature.replace('\nVersion: openpgp-mobile', '');
  },

  async pgpEncrypt({ keys, plainText }) {
    console.log('keys', keys);
    const encryptedSecret = await OpenPGP.encrypt(plainText, keys.join('\n'));
    console.log('encryptedSecret', encryptedSecret);
    return encryptedSecret;
  },
};

const createUser = async (options: PushApi.user.CreateUserProps) => {
  return await PushApi.user.createUserCore(options, PGPHelper);
};

const get = async (options: PushApi.AccountEnvOptionsType) => {
  return await PushApi.user.get(options);
};

const profileUpdate = async (options: PushApi.user.ProfileUpdateProps) => {
  return await PushApi.user.profile.updateCore(options, PGPHelper);
};

const send = async (options: PushApi.ChatSendOptionsType) => {
  return await PushApi.chat.sendCore(options, PGPHelper);
};

const approve = async (options: PushApi.chat.ApproveRequestOptionsType) => {
  return await PushApi.chat.approveCore(options, PGPHelper);
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

const profileUpgrade = PushApi.user.auth.update;

export {
  PGPHelper,
  genRandomAddress,
  createUser,
  get,
  profileUpdate,
  PushApi,
  decryptPGPKey,
  profileUpgrade,
  send,
  approve,
  Constants,
};
