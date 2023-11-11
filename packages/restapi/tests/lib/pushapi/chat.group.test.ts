import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { PushAPI } from '../../../src/lib/pushapi/PushAPI'; // Ensure correct import path
import { expect } from 'chai';
import { ethers } from 'ethers';
import { ENV } from '../../../src/lib/constants';

const env: ENV = ENV.DEV;
describe('PushAPI.chat.group functionality', () => {
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

    userAlice = await PushAPI.initialize(signer1, { env });
    userBob = await PushAPI.initialize(signer2, { env });
  });

  it('Should thorw error on update Group By Non-Admin', async () => {
    const createdGroup = await userAlice.chat.group.create('Test Grp', {
      description: 'Test Desc',
      image:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
      members: [account2],
      admins: [],
      private: false,
    });

    await expect(
      userBob.chat.group.update(createdGroup.chatId, {
        description: 'Updated Test Grp Description',
      })
    ).to.be.rejectedWith(`eip155:${account2} is not a group admin`);
  });

  it('Should update Group By Admin', async () => {
    const createdGroup = await userAlice.chat.group.create('Test Grp', {
      description: 'Test Desc',
      image:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
      members: [account2],
      admins: [],
      private: false,
    });

    const updatedGroup = await userAlice.chat.group.update(
      createdGroup.chatId,
      {
        description: 'Updated Test Grp Description',
      }
    );
    expect(updatedGroup.groupDescription).to.equal(
      'Updated Test Grp Description'
    );
  });
});
