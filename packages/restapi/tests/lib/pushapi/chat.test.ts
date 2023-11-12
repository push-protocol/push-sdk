import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { PushAPI } from '../../../src/lib/pushapi/PushAPI'; // Ensure correct import path
import { expect } from 'chai';
import { ethers } from 'ethers';
import CONSTANTS from '../../../src/lib/constantsV2';

describe('PushAPI.chat functionality', () => {
  let userAlice: PushAPI;
  let userBob: PushAPI;
  let signer1: any;
  let account1: string;
  let signer2: any;
  let account2: string;
  const MESSAGE = 'Hey There!!!';

  beforeEach(async () => {
    const WALLET1 = ethers.Wallet.createRandom();
    signer1 = new ethers.Wallet(WALLET1.privateKey);
    account1 = WALLET1.address;

    const WALLET2 = ethers.Wallet.createRandom();
    signer2 = new ethers.Wallet(WALLET2.privateKey);
    account2 = WALLET2.address;

    userAlice = await PushAPI.initialize(signer1);
    userBob = await PushAPI.initialize(signer2);
  });

  it('Should list request ', async () => {
    await userAlice.chat.send(account2, { content: MESSAGE });
    const response = await userBob.chat.list('REQUESTS', {
      page: 1,
      limit: 10,
    });
    expect(response).to.be.an('array');
    expect(response.length).to.equal(1);
  });
  it('Should list chats ', async () => {
    const response = await userAlice.chat.list('CHATS', {
      page: 1,
      limit: 10,
    });
    expect(response).to.be.an('array');
  });
  it('Should send message ', async () => {
    const response = await userAlice.chat.send(account2, {
      content: 'Hello',
      type: CONSTANTS.CHAT.MESSAGE_TYPE.TEXT,
    });
    expect(response).to.be.an('object');
  });
  it('Should decrypt message ', async () => {
    await userAlice.chat.send(account2, {
      content: 'Hello',
      type: CONSTANTS.CHAT.MESSAGE_TYPE.TEXT,
    });
    const messagePayloads = await userAlice.chat.history(account2);
    const decryptedMessagePayloads = await userBob.chat.decrypt(
      messagePayloads
    );
    expect(decryptedMessagePayloads).to.be.an('array');
  });
});
