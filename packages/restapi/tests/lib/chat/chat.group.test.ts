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
import { signerType } from '@pushprotocol/restapi';

// accessing env dynamically using process.env
type EnvStrings = keyof typeof Constants.ENV;
const envMode = process.env.ENV as EnvStrings;
const _env = Constants.ENV[envMode];

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

    it.only('get chat info', async () => {
      const WALLET1 = ethers.Wallet.createRandom();
      const provider = (ethers as any).providers
        ? new (ethers as any).providers.JsonRpcProvider(
            'https://rpc.sepolia.org'
          )
        : new (ethers as any).JsonRpcProvider('https://rpc.sepolia.org');

      const signerx = new ethers.Wallet(WALLET1.privateKey, provider);

      const dummySigner: signerType = {
        account: 'solana:devnet:5NobTtuDXif5JoKuEFbGBiyyEstfGVF5LnZVby5Rpa5T',

        signMessage: async (message: string): Promise<string> => {
          console.log('Signing message:', message);
          const signature = `dummy_signature_for_${message}`;
          return signature;
        },

        getChainId: async (): Promise<string> => {
          return 'devnet';
        },

        provider: null, // Optional: Add a provider if necessary
      };

      const dummyuser = await PushAPI.initialize(dummySigner, {
        perChain: true,
      });

      const group = await dummyuser.chat.group.create(groupName, {
        description: groupDescription,
        image: groupImage,
        members: [],
        admins: [],
        private: true,
      });

      /*const updatedGroup = await dummyuser.chat.group.update(group.chatId, {
        name: 'Updated Test Grp',
        description: 'Updated Test Grp Description',
        meta: 'Updated Meta',
      });

      console.log(updatedGroup);*/

      await dummyuser.chat.group.add(group.chatId, {
        role: 'MEMBER',
        accounts: [
          'eip155:137:0x8a8A6e22901b4AcAf85E0Ca14cb12d9B8a035D5C',
          'eip155:1:0x8a8A6e22901b4AcAf85E0Ca14cb12d9B8a035D5C',
        ],
      });

      const removeMember = await userAlice.chat.group.remove(group.chatId, {
        role: 'MEMBER',
        accounts: ['eip155:1:0x8a8A6e22901b4AcAf85E0Ca14cb12d9B8a035D5C'],
      });
    });
  });
});
