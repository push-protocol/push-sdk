import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { get } from '../../../src/lib/user';
import { ethers } from 'ethers';
import Constants from '../../../src/lib/constants';

const WALLET_PRIVATE_KEY = process.env['WALLET_PRIVATE_KEY'];
const _env = Constants.ENV.STAGING;

describe('Get user', () => {
  let walletAddress: string;
  beforeEach(() => {
    const provider = ethers.getDefaultProvider(5);
    const Pkey = `0x${WALLET_PRIVATE_KEY}`;
    const _signer = new ethers.Wallet(Pkey, provider);
    walletAddress = _signer.address;
  });

  it('get user with valid id', async () => {
    const account = `eip155:${walletAddress}`
    const user = await get({
      account: account,
      env: _env,
    });
    expect(user).to.be.an('object');
    expect(user).not.to.be.null
    expect(user).not.to.be.undefined
    expect(user.did).to.be.equal(account)
    expect(user.wallets).to.be.equal(account)
    expect(user.publicKey).to.contains('-----BEGIN PGP PUBLIC KEY BLOCK-----\n\n')
    expect(user.encryptedPrivateKey).to.contains(
          '{"version":"x25519-xsalsa20-poly1305","nonce"'
        )   
    expect(user.profilePicture).to.contains('data:image/png;base64,')
    expect(user.about).to.be.null
    expect(user.name).to.be.null
  });
});
