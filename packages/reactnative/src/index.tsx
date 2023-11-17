import '../shim.js';
import 'text-encoding';
import 'react-native-crypto';
import 'react-native-get-random-values';

import React from 'react';
import OpenPGP from 'react-native-fast-openpgp';
import WebViewCrypto from 'react-native-webview-crypto';
import { ethers } from 'ethers';

import * as PushApi from '@pushprotocol/restapi';
import { IPGPHelper } from '@pushprotocol/restapi/src/lib/chat/helpers/pgp.js';
import { ENV } from '@pushprotocol/restapi/src/lib/constants.js';
import { LatestMessagesOptionsType } from '@pushprotocol/restapi/src/lib/chat/latestMessage.js';
import { HistoricalMessagesOptionsType } from '@pushprotocol/restapi/src/lib/chat/historicalMessages.js';
import { ChatCreateGroupType } from '@pushprotocol/restapi/src/lib/chat/createGroup.js';
import { ChatUpdateGroupType } from '@pushprotocol/restapi/src/lib/chat/updateGroup.js';
import { ChatsOptionsType } from '@pushprotocol/restapi/src/lib/chat/chats.js';
import Constants from '@pushprotocol/restapi/src/lib/constants.js';
import { decryptPGPKey } from '@pushprotocol/restapi/src/lib/helpers/crypto.js';

const PGPHelper: IPGPHelper = {
  async generateKeyPair() {
    let keys = await OpenPGP.generate({ keyOptions: { rsaBits: 2048 } });
    return {
      privateKeyArmored: keys.privateKey,
      publicKeyArmored: keys.publicKey,
    };
  },

  async sign({ message, signingKey }) {
    const signature = await OpenPGP.sign(message, signingKey, '');
    return signature.replace('\nVersion: openpgp-mobile', '');
  },

  async pgpEncrypt({ keys, plainText }) {
    const encryptedSecret = await OpenPGP.encrypt(plainText, keys.join('\n'));
    return encryptedSecret;
  },

  async pgpDecrypt({
    cipherText,
    toPrivateKeyArmored,
  }: {
    cipherText: any;
    toPrivateKeyArmored: string;
  }): Promise<string> {
    return await OpenPGP.decrypt(cipherText, toPrivateKeyArmored, '');
  },

  async verifySignature({}: {
    messageContent: string;
    signatureArmored: string;
    publicKeyArmored: string;
  }): Promise<void> {
    // TODO: add verification
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

const conversationHash = async (
  options: PushApi.ConversationHashOptionsType
) => {
  let hash = await PushApi.chat.conversationHash(options);
  return hash;
};

const chats = async (options: ChatsOptionsType) => {
  let chatsList = await PushApi.chat.chatsCore(options, PGPHelper);
  return chatsList;
};

const requests = async (options: ChatsOptionsType) => {
  return await PushApi.chat.requestsCore(options, PGPHelper);
};

const latest = async (options: LatestMessagesOptionsType) => {
  let latestMsg = await PushApi.chat.latestCore(options, PGPHelper);
  return latestMsg;
};

const history = async (options: HistoricalMessagesOptionsType) => {
  let msg = await PushApi.chat.historyCore(options, PGPHelper);
  return msg;
};

const createGroup = async (options: ChatCreateGroupType) => {
  let group = await PushApi.chat.createGroupCore(options, PGPHelper);
  return group;
};

const updateGroup = async (options: ChatUpdateGroupType) => {
  let updatedGroup = await PushApi.chat.updateGroupCore(options, PGPHelper);
  return updatedGroup;
};

// checking if ethers works
const genRandomAddress = () => {
  const wallet = ethers.Wallet.createRandom();
  const address = wallet.address;
  return address;
};

const profileUpgrade = PushApi.user.auth.update;

const PushRNWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Fragment>
      <WebViewCrypto />
      {children}
    </React.Fragment>
  );
};

export {
  PGPHelper,
  genRandomAddress,
  createUser,
  get,
  profileUpdate,
  PushApi,
  ENV,
  conversationHash,
  latest,
  history,
  createGroup,
  updateGroup,
  chats,
  requests,
  decryptPGPKey,
  profileUpgrade,
  send,
  approve,
  Constants,
  PushRNWrapper,
};
