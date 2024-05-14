import { PushAPI } from '../../../src/lib/pushapi/PushAPI'; // Ensure correct import path
import { expect } from 'chai';
import { ethers } from 'ethers';
import Constants from '../../../src/lib/constants';

describe('PushAPI.profile functionality', () => {
  let userAlice: PushAPI;

  // accessing env dynamically using process.env
  type EnvStrings = keyof typeof Constants.ENV;
  const envMode = process.env.ENV as EnvStrings;
  const _env = Constants.ENV[envMode];

  beforeEach(async () => {
    const provider = ethers.getDefaultProvider();
    const WALLET = ethers.Wallet.createRandom();
    const signer = new ethers.Wallet(WALLET.privateKey, provider);
    userAlice = await PushAPI.initialize(signer, { env: _env });
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

  it('Should get profile read only mode', async () => {
    const updatedName = 'Bob The Builder';
    const updatedDesc = 'Yes We Can';
    await userAlice.profile.update({
      name: updatedName,
      desc: updatedDesc,
    });

    const response = await userAlice.profile.update({
      name: updatedName,
      desc: updatedDesc,
    });
    expect(response.name).to.equal(updatedName);
    expect(response.desc).to.equal(updatedDesc);

    const account = (await userAlice.info()).did;

    const userAliceReadOnly = await PushAPI.initialize({
      env: _env,
      account: account,
    });

    expect((await userAliceReadOnly.info()).profile.name).to.equal(updatedName);
    expect((await userAliceReadOnly.info()).profile.desc).to.equal(updatedDesc);
  });
});
