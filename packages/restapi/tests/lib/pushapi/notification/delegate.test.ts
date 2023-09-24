import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { PushNotifications } from '../../../../src/lib/pushapi/PushNotification'; // Ensure correct import path
import { expect } from 'chai';
import { ethers } from 'ethers';
// import tokenABI from './tokenABI';
describe('PushAPI.notification functionality', () => {
  let userAlice: PushNotifications;
  let userBob: PushNotifications;
  let userKate: PushNotifications;
  let signer1: any;
  let account1: string;
  let signer2: any;
  let account2: string;

  beforeEach(async () => {
    signer1 = new ethers.Wallet(`0x${process.env['WALLET_PRIVATE_KEY']}`);
    account1 = await signer1.getAddress();

    const provider = new ethers.providers.JsonRpcProvider(
      'https://goerli.blockpi.network/v1/rpc/public'
    );

    signer2 = new ethers.Wallet(
      `0x${process.env['WALLET_PRIVATE_KEY']}`,
      provider
    );
    account2 = await signer2.getAddress();

    // initialisation with signer and provider
    userKate = await PushNotifications.initialize(signer2);
    // initialisation with signer
    userAlice = await PushNotifications.initialize(signer1);
    // initialisation without signer
    userBob = await PushNotifications.initialize();
  });

  describe('delegate :: add', () => {
    it('Without signer and account :: should throw error', async () => {
      await expect(() =>
        userBob.delegate.add(
          'eip155:5:0x74415Bc4C4Bf4Baecc2DD372426F0a1D016Fa924'
        )
      ).to.Throw;
    });

    it('With signer and without provider :: should throw error', async () => {
      await expect(() =>
        userAlice.delegate.add(
          'eip155:5:0x74415Bc4C4Bf4Baecc2DD372426F0a1D016Fa924'
        )
      ).to.Throw;
    });

    it('With signer and provider :: should add delegate', async () => {
      const res = await userKate.delegate.add(
        'eip155:5:0x74415Bc4C4Bf4Baecc2DD372426F0a1D016Fa924'
      );
      //   console.log(res);
      expect(res).not.null;
    }, 100000000);

    it('With signer and provider :: should throw error as delegate caip and provider doesnt match', async () => {
      await expect(() =>
        userKate.delegate.add(
          'eip155:80001:0x74415Bc4C4Bf4Baecc2DD372426F0a1D016Fa924'
        )
      ).to.Throw;
    });

    it('With signer and provider :: should throw error as delegate caip and provider doesnt match', async () => {
      // create polygon mumbai provider
      const provider = new ethers.providers.JsonRpcProvider(
        'https://rpc-mumbai.maticvigil.com'
      );

      signer2 = new ethers.Wallet(
        `0x${process.env['WALLET_PRIVATE_KEY']}`,
        provider
      );
      userKate = await PushNotifications.initialize(signer2);
      const res = await userKate.delegate.add(
        'eip155:80001:0x74415Bc4C4Bf4Baecc2DD372426F0a1D016Fa924'
      );
      //   console.log(res);
      expect(res).not.null;
    }, 10000000);
  });

  describe('delegate :: get', () => {
    it('Without signer and account : Should throw error', async () => {
      await expect(() => userBob.delegate.get()).to.Throw;
    });
    it('Without signer : Should throw error for non-caip format', async () => {
      await expect(() =>
        userBob.delegate.get({
          channel: '0x74415Bc4C4Bf4Baecc2DD372426F0a1D016Fa924',
        })
      ).to.Throw;
    });

    it('Without signer : Should fetch delegates', async () => {
      const res = await userBob.delegate.get({
        channel: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681',
      });
      //   console.log(res)
      expect(res).not.null;
    });

    it('Without signer : Should fetch delegates for alias', async () => {
      const res = await userBob.delegate.get({
        channel: 'eip155:80001:0xD8634C39BBFd4033c0d3289C4515275102423681',
      });
      //   console.log(res)
      expect(res).not.null;
    });

    it('With signer : Should fetch delegates for channel', async () => {
      const res = await userKate.delegate.get();
    //   console.log(res);
      expect(res).not.null;
    });
  });
});
