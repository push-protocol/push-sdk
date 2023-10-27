import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { ethers } from 'ethers';
import Constants from '../../../src/lib/constants';
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';
import { PushAPI } from '../../../src/lib/pushapi/PushAPI'; // Ensure correct import path

const _env = Constants.ENV.DEV;
let groupName: string;
let groupDescription: string;
const groupImage =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==';
const meta = 'Random Group Meta';
let userAlice: PushAPI;
let userBob: PushAPI;
let userJohn: PushAPI;

describe('Private Groups With Session Keys', () => {
  let account1: string;
  let account2: string;
  let account3: string;
  beforeEach(async () => {
    groupName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    });
    groupDescription = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    });

    const WALLET1 = ethers.Wallet.createRandom();
    const signer1 = new ethers.Wallet(WALLET1.privateKey);
    account1 = `eip155:${signer1.address}`;
    userAlice = await PushAPI.initialize(signer1, { env: _env });

    const WALLET2 = ethers.Wallet.createRandom();
    const signer2 = new ethers.Wallet(WALLET2.privateKey);
    account2 = `eip155:${signer2.address}`;
    userBob = await PushAPI.initialize(signer2, { env: _env });

    const WALLET3 = ethers.Wallet.createRandom();
    const signer3 = new ethers.Wallet(WALLET3.privateKey);
    account3 = `eip155:${signer3.address}`;
    userJohn = await PushAPI.initialize(signer3, { env: _env });
  });
  it('Session Key should be null on Group Creation', async () => {
    const group = await userAlice.chat.group.create(groupName, {
      description: groupDescription,
      image: groupImage,
      members: [],
      admins: [],
      private: true,
    });

    expect(group.sessionKey).to.be.null;
  });
  it('Session Key should be null on Adding Members', async () => {
    const group = await userAlice.chat.group.create(groupName, {
      description: groupDescription,
      image: groupImage,
      members: [],
      admins: [],
      private: true,
    });
    const updatedGroup = await userAlice.chat.group.add(group.chatId, {
      role: 'MEMBER',
      accounts: [account2],
    });
    expect(updatedGroup.sessionKey).to.be.null;
  });
  it('Session Key should be null on Adding Admins', async () => {
    const group = await userAlice.chat.group.create(groupName, {
      description: groupDescription,
      image: groupImage,
      members: [],
      admins: [],
      private: true,
    });
    const updatedGroup = await userAlice.chat.group.add(group.chatId, {
      role: 'ADMIN',
      accounts: [account2],
    });
    expect(updatedGroup.sessionKey).to.be.null;
  });
  it('Session Key should be null on Removing Pending Members', async () => {
    const group = await userAlice.chat.group.create(groupName, {
      description: groupDescription,
      image: groupImage,
      members: [account2],
      admins: [],
      private: true,
    });

    const updatedGroup = await userAlice.chat.group.remove(group.chatId, {
      role: 'MEMBER',
      accounts: [account2],
    });
    expect(updatedGroup.sessionKey).to.be.null;
  });
  it('Session Key should be null on Removing Pending Admins', async () => {
    const group = await userAlice.chat.group.create(groupName, {
      description: groupDescription,
      image: groupImage,
      members: [],
      admins: [account2],
      private: true,
    });

    const updatedGroup = await userAlice.chat.group.remove(group.chatId, {
      role: 'ADMIN',
      accounts: [account2],
    });
    expect(updatedGroup.sessionKey).to.be.null;
  });
  it('Session Key should not be null and should update on Pending Member Approving Intent', async () => {
    const group = await userAlice.chat.group.create(groupName, {
      description: groupDescription,
      image: groupImage,
      members: [account2, account3],
      admins: [],
      private: true,
    });
    const updatedGroup1 = await userBob.chat.group.join(group.chatId);
    expect(updatedGroup1.sessionKey).to.not.be.null;

    const updatedGroup2 = await userJohn.chat.group.join(group.chatId);
    expect(updatedGroup2.sessionKey).to.not.be.null;

    expect(updatedGroup2.sessionKey).to.not.equal(updatedGroup1.sessionKey);
  });
  it('Session Key should not be null and should update on Pending Admin Approving Intent', async () => {
    const group = await userAlice.chat.group.create(groupName, {
      description: groupDescription,
      image: groupImage,
      members: [],
      admins: [account2, account3],
      private: true,
    });
    const updatedGroup1 = await userBob.chat.group.join(group.chatId);
    expect(updatedGroup1.sessionKey).to.not.be.null;

    const updatedGroup2 = await userJohn.chat.group.join(group.chatId);
    expect(updatedGroup2.sessionKey).to.not.be.null;

    expect(updatedGroup2.sessionKey).to.not.equal(updatedGroup1.sessionKey);
  });
  it('Session Key should not be null and should update on Removing Non-Pending Member', async () => {
    const group = await userAlice.chat.group.create(groupName, {
      description: groupDescription,
      image: groupImage,
      members: [account2],
      admins: [],
      private: true,
    });
    const updatedGroup1 = await userBob.chat.group.join(group.chatId);
    expect(updatedGroup1.sessionKey).to.not.be.null;

    const updatedGroup2 = await userAlice.chat.group.remove(group.chatId, {
      role: 'MEMBER',
      accounts: [account2],
    });
    expect(updatedGroup2.sessionKey).to.not.be.null;

    expect(updatedGroup2.sessionKey).to.not.equal(updatedGroup1.sessionKey);
  });
  it('Session Key should not be null and should update on Removing Non-Pending Admin', async () => {
    const group = await userAlice.chat.group.create(groupName, {
      description: groupDescription,
      image: groupImage,
      members: [],
      admins: [account2],
      private: true,
    });
    const updatedGroup1 = await userBob.chat.group.join(group.chatId);
    expect(updatedGroup1.sessionKey).to.not.be.null;

    const updatedGroup2 = await userAlice.chat.group.remove(group.chatId, {
      role: 'ADMIN',
      accounts: [account2],
    });
    expect(updatedGroup2.sessionKey).to.not.be.null;

    expect(updatedGroup2.sessionKey).to.not.equal(updatedGroup1.sessionKey);
  });
  it('Session Key should not be null on AutoJoin', async () => {
    const group = await userAlice.chat.group.create(groupName, {
      description: groupDescription,
      image: groupImage,
      members: [],
      admins: [],
      private: true,
    });
    const updatedGroup = await userBob.chat.group.join(group.chatId);
    expect(updatedGroup.sessionKey).to.not.be.null;
  });
  it('Session Key should be null on AutoLeave Pending Member', async () => {
    const group = await userAlice.chat.group.create(groupName, {
      description: groupDescription,
      image: groupImage,
      members: [account2],
      admins: [],
      private: true,
    });
    const updatedGroup = await userBob.chat.group.leave(group.chatId);
    expect(updatedGroup.sessionKey).to.be.null;
  });
  it.skip('Session Key should be null on AutoLeave Pending Admin', async () => {
    const group = await userAlice.chat.group.create(groupName, {
      description: groupDescription,
      image: groupImage,
      members: [],
      admins: [account2],
      private: true,
    });
    const updatedGroup = await userBob.chat.group.leave(group.chatId);
    expect(updatedGroup.sessionKey).to.be.null;
  });
  it('Session Key should not be null on AutoLeave Non-Pending Member', async () => {
    const group = await userAlice.chat.group.create(groupName, {
      description: groupDescription,
      image: groupImage,
      members: [account2],
      admins: [],
      private: true,
    });
    const updatedGroup1 = await userBob.chat.group.join(group.chatId);
    const updatedGroup = await userBob.chat.group.leave(group.chatId);
    expect(updatedGroup.sessionKey).to.not.be.null;
    expect(updatedGroup.sessionKey).to.not.equal(updatedGroup1.sessionKey);
  });
  it('Session Key should not be null on AutoLeave Non-Pending Admin', async () => {
    const group = await userAlice.chat.group.create(groupName, {
      description: groupDescription,
      image: groupImage,
      members: [],
      admins: [account2],
      private: true,
    });
    const updatedGroup1 = await userBob.chat.group.join(group.chatId);
    const updatedGroup = await userBob.chat.group.leave(group.chatId);
    expect(updatedGroup.sessionKey).to.not.be.null;
    expect(updatedGroup.sessionKey).to.not.equal(updatedGroup1.sessionKey);
  });
});
