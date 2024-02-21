import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { PushAPI } from '../../../src/lib/pushapi/PushAPI'; // Ensure correct import path
import { expect } from 'chai';
import { ethers } from 'ethers';
import CONSTANTS from '../../../src/lib/constantsV2';
import { CHAT } from '../../../src/lib/types/messageTypes';

describe('PushAPI.chat functionality', () => {
  let userAlice: PushAPI;
  let userBob: PushAPI;
  let signer1: any;
  let account1: string;
  let signer2: any;
  let account2: string;
  const MESSAGE = 'Hey There!!!';
  const env = CONSTANTS.ENV.DEV;

  beforeEach(async () => {
    const WALLET1 = ethers.Wallet.createRandom();
    signer1 = new ethers.Wallet(WALLET1.privateKey);
    account1 = WALLET1.address;

    const WALLET2 = ethers.Wallet.createRandom();
    signer2 = new ethers.Wallet(WALLET2.privateKey);
    account2 = WALLET2.address;

    userAlice = await PushAPI.initialize(signer1, { env });
    userBob = await PushAPI.initialize(signer2, { env });
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

  it('Should list request read only', async () => {
    await userAlice.chat.send(account2, { content: MESSAGE });

    const account = (await userBob.info()).did;

    const userBobReadOnly = await PushAPI.initialize({
      account: account,
    });

    const response = await userBobReadOnly.chat.list('REQUESTS', {
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
  it('Should list chats read only', async () => {
    const account = (await userAlice.info()).did;

    const userAliceReadOnly = await PushAPI.initialize({
      account: account,
    });

    const response = await userAliceReadOnly.chat.list('CHATS', {
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
  it('Should send message read only', async () => {
    const account = (await userAlice.info()).did;

    const userAliceReadOnly = await PushAPI.initialize({
      account: account,
    });

    let errorCaught: any = null;

    try {
      await userAliceReadOnly.chat.send(account2, {
        content: 'Hello',
        type: CONSTANTS.CHAT.MESSAGE_TYPE.TEXT,
      });
    } catch (error) {
      errorCaught = error;
    }

    expect(errorCaught).to.be.an('error');
    expect(errorCaught.message).to.equal(
      'Operation not allowed in read-only mode. Signer is required.'
    );
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
  it.skip('Should be able to parse old reaction Messages', async () => {
    const message = await userAlice.chat.send(account2, {
      type: CONSTANTS.CHAT.MESSAGE_TYPE.REACTION,
      content: CHAT.REACTION.CLAP,
      reference: 'bafyreigxrhne5bitpww7hfxsx7u6mghxix4ehfwghtl4aofnbui255rslm',
    });
    const requests = await userBob.chat.list('REQUESTS');
    console.log(requests[0].msg.messageObj);
  });
});
