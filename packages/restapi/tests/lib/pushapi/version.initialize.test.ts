import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import { ProgressHookType } from '../../../src/lib/types';
import { PushAPI } from '../../../src/lib/pushapi/PushAPI'; // Ensure correct import path
import { expect } from 'chai';
import { ethers } from 'ethers';
import { ENCRYPTION_TYPE, ENV } from '../../../src/lib/constants';
import { Blob } from 'node:buffer'; // SDK uses blob (due to lit) and Blob is only supported after node18 ( This is done for versions < node18 )

globalThis.Blob = Blob as any;
globalThis.crypto = require('crypto');

describe('PushAPI.initialize functionality for Diff Versioned profiles', () => {
  let signer: ethers.Wallet;
  const env = ENV.LOCAL;

  beforeEach(async () => {
    const provider = ethers.getDefaultProvider();
    const WALLET = ethers.Wallet.createRandom();
    signer = new ethers.Wallet(WALLET.privateKey, provider);
  });

  it('Should initialize PGP_V1 user', async () => {
    // New user initialization
    await PushAPI.initialize(signer, {
      version: ENCRYPTION_TYPE.PGP_V1,
      env,
    });
    // Again initialize ( to check decryption is working fine or not )
    const user = await PushAPI.initialize(signer, {
      env,
      autoUpgrade: false,
    });

    const userInfo = await user.info();
    expect(userInfo.encryptedPrivateKey).to.contains(
      `"version":"${ENCRYPTION_TYPE.PGP_V1}"`
    );
  });
  it('Should initialize PGP_V2 user', async () => {
    // New user initialization
    await PushAPI.initialize(signer, {
      version: ENCRYPTION_TYPE.PGP_V2,
      env,
    });
    // Again initialize ( to check decryption is working fine or not )
    const user = await PushAPI.initialize(signer, {
      env,
      autoUpgrade: false,
    });

    const userInfo = await user.info();
    expect(userInfo.encryptedPrivateKey).to.contains(
      `"version":"${ENCRYPTION_TYPE.PGP_V2}"`
    );
  });
  it('Should initialize PGP_V3 user', async () => {
    // New user initialization
    await PushAPI.initialize(signer, {
      version: ENCRYPTION_TYPE.PGP_V3,
      env,
    });
    // Again initialize ( to check decryption is working fine or not )
    const user = await PushAPI.initialize(signer, {
      env,
      autoUpgrade: false,
    });

    const userInfo = await user.info();
    expect(userInfo.encryptedPrivateKey).to.contains(
      `"version":"${ENCRYPTION_TYPE.PGP_V3}"`
    );
  });
  it('Should initialize PGP_V4 user', async () => {
    // New user initialization
    await PushAPI.initialize(signer, {
      version: ENCRYPTION_TYPE.PGP_V4,
      env,
    });
    // Again initialize ( to check decryption is working fine or not )
    const user = await PushAPI.initialize(signer, {
      env,
      autoUpgrade: false,
    });

    const userInfo = await user.info();
    expect(userInfo.encryptedPrivateKey).to.contains(
      `"version":"${ENCRYPTION_TYPE.PGP_V4}"`
    );
  });
});
