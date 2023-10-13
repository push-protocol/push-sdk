import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import { ProgressHookType } from '../../../src/lib/types';
import { PushAPI } from '../../../src/lib/pushapi/PushAPI'; // Ensure correct import path
import { expect } from 'chai';
import { ethers } from 'ethers';
import Constants, { ENCRYPTION_TYPE, ENV } from '../../../src/lib/constants';

describe.skip('PushAPI.initialize functionality for Diff Versioned profiles', () => {
  let signer: ethers.Wallet;
  const env = ENV.LOCAL;

  beforeEach(async () => {
    const provider = ethers.getDefaultProvider();
    const WALLET = ethers.Wallet.createRandom();
    signer = new ethers.Wallet(WALLET.privateKey, provider);
  });

  it('Should initialize PGP_V1 user', async () => {
    const user = await PushAPI.initialize(signer, {
      version: ENCRYPTION_TYPE.PGP_V1,
      env,
    });
    console.log(user.info());
  });
  it('Should initialize PGP_V2 user', async () => {
    const user = await PushAPI.initialize(signer, {
      version: ENCRYPTION_TYPE.PGP_V2,
      env,
    });
    console.log(user.info());
  });
});
