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

describe('PushAPI.chat.group', () => {
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
  describe('update', () => {
    it('update Public Group', async () => {
      const group = await userAlice.chat.group.create(groupName, {
        description: groupDescription,
        image: groupImage,
        members: [],
        admins: [],
        private: false,
      });
      const updatedGroup = await userAlice.chat.group.update(group.chatId, {
        name: 'Updated Test Grp',
        description: 'Updated Test Grp Description',
        meta: 'Updated Meta',
      });
      expect(updatedGroup.groupImage).to.equal(groupImage);
      expect(updatedGroup.groupName).to.equal('Updated Test Grp');
      expect(updatedGroup.groupDescription).to.equal(
        'Updated Test Grp Description'
      );
      expect(updatedGroup.meta).to.equal('Updated Meta');
    });
    it('update Public Group', async () => {
      const group = await userAlice.chat.group.create(groupName, {
        description: groupDescription,
        image: groupImage,
        members: [],
        admins: [],
        private: true,
      });
      const updatedGroup = await userAlice.chat.group.update(group.chatId, {
        name: 'Updated Test Grp',
        description: 'Updated Test Grp Description',
        meta: 'Updated Meta',
      });
      expect(updatedGroup.groupImage).to.equal(groupImage);
      expect(updatedGroup.groupName).to.equal('Updated Test Grp');
      expect(updatedGroup.groupDescription).to.equal(
        'Updated Test Grp Description'
      );
      expect(updatedGroup.meta).to.equal('Updated Meta');
    });
    it('update Group, set desc and image as null', async () => {
      const group = await userAlice.chat.group.create(groupName, {
        description: groupDescription,
        image: groupImage,
        members: [],
        admins: [],
        private: false,
      });
      const updatedGroup = await userAlice.chat.group.update(group.chatId, {
        description: null,
        image: null,
      });
      expect(updatedGroup.groupImage).to.equal(null);
      expect(updatedGroup.groupName).to.equal(group.groupName);
      expect(updatedGroup.groupDescription).to.equal(null);
    });

    it('get chat info', async () => {
      const group = await userAlice.chat.group.create(groupName, {
        description: groupDescription,
        image: groupImage,
        members: [],
        admins: [],
        private: true,
      });

      const chatInfo = await userBob.chat.info(group.chatId, account1);

      expect(chatInfo).to.be.an('object');
      expect(chatInfo).to.have.property('meta');
      expect(chatInfo.meta).to.have.property('group');
      expect(chatInfo).to.have.property('list');
      expect(chatInfo.list).to.be.oneOf(['CHATS', 'REQUESTS', 'UNINITIALIZED']);
    });
  });
});
