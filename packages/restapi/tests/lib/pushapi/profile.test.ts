import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { PushAPI } from '../../../src/lib/pushapi/PushAPI'; // Ensure correct import path
import { expect } from 'chai';
import { ethers } from 'ethers';

describe('PushAPI.profile functionality', () => {
  let userAlice: PushAPI;

  beforeEach(async () => {
    const provider = ethers.getDefaultProvider();
    const WALLET = ethers.Wallet.createRandom();
    const signer = new ethers.Wallet(WALLET.privateKey, provider);
    userAlice = await PushAPI.initialize(signer);
  });

  it('Should update profile', async () => {
    const updatedName = 'Bob The Builder';
    const updatedDesc = 'Yes We Can';
    const response = await userAlice.profile.update({
      name: updatedName,
      desc: updatedDesc,
    });
    expect(response.name).to.equal(updatedName);
    expect(response.desc).to.equal(updatedDesc);
  });
});
