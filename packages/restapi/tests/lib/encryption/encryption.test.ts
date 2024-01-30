import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { PushAPI } from '../../../src/lib/pushapi/PushAPI'; // Ensure correct import path
import { expect } from 'chai';
import { ethers } from 'ethers';
import CONSTANTS from '../../../src/lib/constantsV2';

const env = CONSTANTS.ENV.DEV;
describe('PushAPI.encryption functionality', () => {
  let signer1: any;
  let account1: string;

  before(async () => {
    const WALLET1 = ethers.Wallet.createRandom();
    signer1 = new ethers.Wallet(WALLET1.privateKey);
    account1 = WALLET1.address;

    // To make sure user exists
    await PushAPI.initialize(signer1, {
      env,
    });
  });

  it('Encryption.info', async () => {
    const userAlice = await PushAPI.initialize(signer1, {
      env,
    });
    const response = await userAlice.encryption.info();
    expect(response.decryptedPgpPrivateKey).to.include(
      '-----BEGIN PGP PRIVATE KEY BLOCK-----\n'
    );
    expect(response.pgpPublicKey).to.be.include(
      '-----BEGIN PGP PUBLIC KEY BLOCK-----\n'
    );
  });

  it('Encryption.info in Read Mode', async () => {
    // Read only mode
    const _signer = undefined;
    const userAlice = await PushAPI.initialize(_signer, {
      env,
      account: account1,
    });
    const response = await userAlice.encryption.info();
    expect(response.decryptedPgpPrivateKey).to.be.undefined;
    expect(response.pgpPublicKey).to.be.include(
      '-----BEGIN PGP PUBLIC KEY BLOCK-----\n'
    );
  });
});
