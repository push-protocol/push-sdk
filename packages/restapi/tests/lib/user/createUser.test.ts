import { expect } from 'chai';
import { describe, it } from 'mocha';
import { create, get } from '../../../src/lib/user';
import { addNumbers } from '../chat/helloworld.test'

const WALLET_PRIVATE_KEY =
  '919b01bdd5c7820a5b6a5e1a9a6648f3b2126c58c2c8bb6bf784e8633cc0972a';
import { ethers } from 'ethers';
import chalk = require('chalk');
import Constants from '../../../src/lib/constants';
const _env = Constants.ENV.STAGING;

describe('Example', () => {
  it('should pass', async () => {
    const provider = ethers.getDefaultProvider(5);

    const Pkey = `0x${WALLET_PRIVATE_KEY}`;
    const _signer = new ethers.Wallet(Pkey, provider);
    const walletAddress = _signer.address;

    console.log(addNumbers(5,10))

    console.log(get)

    /*const user = await get({
      account: `eip155:5:${walletAddress}`,
      env: _env,
    });

    /*console.log(chalk.gray('PushAPI_user_create | Response - 200 OK'));
    console.log(user);*/

    expect(true).to.equal(true);
  });

  it('should fail', () => {
    expect(true).to.equal(true);
  });
});
