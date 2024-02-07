import { expect } from 'chai';
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
let spaceName: string;
let spaceDescription: string;
const spaceImage =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==';
const meta = 'Random Group Meta';
let userAlice: PushAPI;
let userBob: PushAPI;
let userJohn: PushAPI;

describe('PushAPI.space', () => {
  let account1: string;
  let account2: string;
  let account3: string;
  beforeEach(async () => {
    spaceName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    });
    spaceDescription = uniqueNamesGenerator({
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
  describe('space', () => {
    it('create space', async () => {
      const space = await userAlice.space.create(spaceName, {
        description: spaceDescription,
        image: spaceImage,
        participants: { listeners: [], speakers: [] },
        schedule: {
          start: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        },
        private: false,
      });
      expect(space.spaceImage).to.equal(spaceImage);
      expect(space.spaceName).to.equal(spaceName);
      expect(space.spaceDescription).to.equal(spaceDescription);
    });

    it('update space', async () => {
      const space = await userAlice.space.create(spaceName, {
        description: spaceDescription,
        image: spaceImage,
        participants: { listeners: [], speakers: [] },
        schedule: {
          start: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        },
        private: false,
      });
      expect(space.spaceImage).to.equal(spaceImage);
      expect(space.spaceName).to.equal(spaceName);
      expect(space.spaceDescription).to.equal(spaceDescription);
      const updatedGroup = await userAlice.space.update(space.spaceId, {
        name: 'Updated Test Grp',
        description: 'Updated Test Grp Description',
        meta: 'Updated Meta',
      });
      expect(updatedGroup.spaceImage).to.equal(spaceImage);
      expect(updatedGroup.spaceName).to.equal('Updated Test Grp');
      expect(updatedGroup.spaceDescription).to.equal(
        'Updated Test Grp Description'
      );
      expect(updatedGroup.meta).to.equal('Updated Meta');
    });

    it('should retrieve space info correctly', async () => {
      const newSpace = await userAlice.space.create(spaceName, {
        description: spaceDescription,
        image: spaceImage,
        participants: { listeners: [], speakers: [] },
        schedule: {
          start: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        },
        private: false,
      });

      // Retrieve space info
      const spaceInfo = await userAlice.space.info(newSpace.spaceId);

      // Assertions to validate the returned data
      expect(spaceInfo.spaceId).to.equal(newSpace.spaceId);
      expect(spaceInfo.spaceName).to.equal(newSpace.spaceName);
      expect(spaceInfo.spaceImage).to.equal(newSpace.spaceImage);
      expect(spaceInfo.spaceDescription).to.equal(newSpace.spaceDescription);
      expect(spaceInfo.isPublic).to.equal(true);
      expect(spaceInfo.spaceCreator).to.equal(account1);
      expect(spaceInfo.status).to.equal('PENDING');
      expect(spaceInfo.sessionKey).to.be.null;
      expect(spaceInfo.encryptedSecret).to.be.null;
      expect(spaceInfo.rules).to.be.an('object');
    });

    it('should retrieve participant counts correctly', async () => {
      // Create a new space
      const newSpace = await userAlice.space.create(spaceName, {
        description: spaceDescription,
        image: spaceImage,
        participants: { listeners: [], speakers: [] },
        schedule: {
          start: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        },
        private: false,
      });

      // Retrieve participant counts for the space
      const participantCounts = await userAlice.space.participants.count(
        newSpace.spaceId
      );

      // Assertions to validate the returned data
      expect(participantCounts).to.be.an('object');
      expect(participantCounts).to.have.property('participants');
      expect(participantCounts).to.have.property('pending');
      expect(participantCounts.participants).to.be.a('number');
      expect(participantCounts.pending).to.be.a('number');
      expect(participantCounts.participants).to.equal(1);
      expect(participantCounts.pending).to.equal(0);
    });

    it('should retrieve participant counts correctly with add', async () => {
      // Create a new space
      const newSpace = await userAlice.space.create(spaceName, {
        description: spaceDescription,
        image: spaceImage,
        participants: { listeners: [], speakers: [] },
        schedule: {
          start: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        },
        private: false,
      });

      await userAlice.space.add(newSpace.spaceId, {
        role: 'LISTENER',
        accounts: [account2],
      });

      // Retrieve participant counts for the space
      const participantCounts = await userAlice.space.participants.count(
        newSpace.spaceId
      );

      // Assertions to validate the returned data
      expect(participantCounts).to.be.an('object');
      expect(participantCounts).to.have.property('participants');
      expect(participantCounts).to.have.property('pending');
      expect(participantCounts.participants).to.be.a('number');
      expect(participantCounts.pending).to.be.a('number');
      expect(participantCounts.participants).to.equal(1);
      expect(participantCounts.pending).to.equal(1);
    });

    it('should retrieve participant counts correctly with join', async () => {
      // Create a new space
      const newSpace = await userAlice.space.create(spaceName, {
        description: spaceDescription,
        image: spaceImage,
        participants: { listeners: [], speakers: [] },
        schedule: {
          start: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        },
        private: false,
      });

      await userAlice.space.add(newSpace.spaceId, {
        role: 'LISTENER',
        accounts: [account3],
      });

      await userBob.space.join(newSpace.spaceId);

      // Retrieve participant counts for the space
      const participantCounts = await userAlice.space.participants.count(
        newSpace.spaceId
      );

      // Assertions to validate the returned data
      expect(participantCounts).to.be.an('object');
      expect(participantCounts).to.have.property('participants');
      expect(participantCounts).to.have.property('pending');
      expect(participantCounts.participants).to.be.a('number');
      expect(participantCounts.pending).to.be.a('number');
      expect(participantCounts.participants).to.equal(2);
      expect(participantCounts.pending).to.equal(1);
    });

    it('should retrieve participant counts correctly with remove', async () => {
      // Create a new space
      const newSpace = await userAlice.space.create(spaceName, {
        description: spaceDescription,
        image: spaceImage,
        participants: { listeners: [], speakers: [] },
        schedule: {
          start: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        },
        private: false,
      });

      await userAlice.space.add(newSpace.spaceId, {
        role: 'LISTENER',
        accounts: [account3],
      });

      await userBob.space.join(newSpace.spaceId);

      await userAlice.space.remove(newSpace.spaceId, {
        accounts: [account3],
      });

      // Retrieve participant counts for the space
      const participantCounts = await userAlice.space.participants.count(
        newSpace.spaceId
      );

      // Assertions to validate the returned data
      expect(participantCounts).to.be.an('object');
      expect(participantCounts).to.have.property('participants');
      expect(participantCounts).to.have.property('pending');
      expect(participantCounts.participants).to.be.a('number');
      expect(participantCounts.pending).to.be.a('number');
      expect(participantCounts.participants).to.equal(2);
      expect(participantCounts.pending).to.equal(0);
    });
  });
});
