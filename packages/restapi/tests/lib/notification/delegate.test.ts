import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { PushAPI } from '../../../src/lib/pushapi/PushAPI'; // Ensure correct import path
import { expect } from 'chai';
import { ethers } from 'ethers';
// import tokenABI from './tokenABI';
describe('PushAPI.delegate functionality', () => {
  let userAlice: PushAPI;
  let userBob: PushAPI;
  let userKate: PushAPI;
  let signer1: any;
  let account1: string;
  let signer2: any;
  let account2: string;

  beforeEach(async () => {
    signer1 = new ethers.Wallet(`0x${process.env['WALLET_PRIVATE_KEY']}`);
    account1 = await signer1.getAddress();

    const provider = new ethers.providers.JsonRpcProvider(
      'https://rpc.sepolia.org'
    );

    signer2 = new ethers.Wallet(
      `0x${process.env['WALLET_PRIVATE_KEY']}`,
      provider
    );
    account2 = await signer2.getAddress();

    // initialisation with signer and provider
    userKate = await PushAPI.initialize(signer2);
    // initialisation with signer
    userAlice = await PushAPI.initialize(signer1);
    // initialisation without signer
    userBob = await PushAPI.initialize(signer1);
  });

  describe('delegate :: add', () => {
    // TODO: remove skip after signer becomes optional
    it.skip('Without signer and account :: should throw error', async () => {
      await expect(() =>
        userBob.channel.delegate.add(
          'eip155:11155111:0x74415Bc4C4Bf4Baecc2DD372426F0a1D016Fa924'
        )
      ).to.Throw;
    });

    it('With signer and without provider :: should throw error', async () => {
      await expect(() =>
        userAlice.channel.delegate.add(
          'eip155:11155111:0x74415Bc4C4Bf4Baecc2DD372426F0a1D016Fa924'
        )
      ).to.Throw;
    });

    it('With signer and provider :: should add delegate', async () => {
      const res = await userKate.channel.delegate.add(
        'eip155:11155111:0x74415Bc4C4Bf4Baecc2DD372426F0a1D016Fa924'
      );
      //   console.log(res);
      expect(res).not.null;
    }, 100000000);

    it('With signer and provider :: should throw error as delegate caip and provider doesnt match', async () => {
      await expect(() =>
        userKate.channel.delegate.add(
          'eip155:80001:0x74415Bc4C4Bf4Baecc2DD372426F0a1D016Fa924'
        )
      ).to.Throw;
    });

    it('With viem signer: Should add delegate', async () => {
      // create polygon mumbai provider
      const provider = new ethers.providers.JsonRpcProvider(
        'https://rpc-mumbai.maticvigil.com'
      );

      signer2 = new ethers.Wallet(
        `0x${process.env['WALLET_PRIVATE_KEY']}`,
        provider
      );
      userKate = await PushAPI.initialize(signer2);
      const res = await userKate.channel.delegate.add(
        'eip155:80001:0x74415Bc4C4Bf4Baecc2DD372426F0a1D016Fa924'
      );
      //   console.log(res);
      expect(res).not.null;
    }, 10000000);
  });

  describe('delegate :: remove', () => {
    // TODO: remove skip after signer becomes optional
    it.skip('Without signer and account :: should throw error', async () => {
      await expect(() =>
        userBob.channel.delegate.remove(
          'eip155:11155111:0x74415Bc4C4Bf4Baecc2DD372426F0a1D016Fa924'
        )
      ).to.Throw;
    });

    it('With signer and without provider :: should throw error', async () => {
      await expect(() =>
        userAlice.channel.delegate.remove(
          'eip155:11155111:0x74415Bc4C4Bf4Baecc2DD372426F0a1D016Fa924'
        )
      ).to.Throw;
    });

    it('With signer and provider :: should add delegate', async () => {
      const res = await userKate.channel.delegate.remove(
        'eip155:11155111:0x74415Bc4C4Bf4Baecc2DD372426F0a1D016Fa924'
      );
      console.log(res);
      expect(res).not.null;
    }, 100000000);

    it('With signer and provider :: should throw error as delegate caip and provider doesnt match', async () => {
      await expect(() =>
        userKate.channel.delegate.remove(
          'eip155:80001:0x74415Bc4C4Bf4Baecc2DD372426F0a1D016Fa924'
        )
      ).to.Throw;
    });

    it('With viem signer: Should remove delegate', async () => {
      // create polygon mumbai provider
      const provider = new ethers.providers.JsonRpcProvider(
        'https://rpc-mumbai.maticvigil.com'
      );

      signer2 = new ethers.Wallet(
        `0x${process.env['WALLET_PRIVATE_KEY']}`,
        provider
      );
      userKate = await PushAPI.initialize(signer2);
      const res = await userKate.channel.delegate.remove(
        'eip155:80001:0x74415Bc4C4Bf4Baecc2DD372426F0a1D016Fa924'
      );
      // console.log(res);
      expect(res).not.null;
    }, 10000000);
  });

  describe('delegate :: get', () => {
    it.skip('Without signer and account : Should throw error', async () => {
      await expect(() => userBob.channel.delegate.get()).to.Throw;
    });
    it('Without signer : Should throw error for non-caip format', async () => {
      await expect(() =>
        userBob.channel.delegate.get({
          channel: '0x74415Bc4C4Bf4Baecc2DD372426F0a1D016Fa924',
        })
      ).to.Throw;
    });

    it('Without signer : Should fetch delegates', async () => {
      const res = await userBob.channel.delegate.get({
        channel: 'eip155:11155111:0xD8634C39BBFd4033c0d3289C4515275102423681',
      });
      console.log(res);
      expect(res).not.null;
    });

    it('Without signer : Should fetch delegates for alias', async () => {
      const res = await userBob.channel.delegate.get({
        channel: 'eip155:80001:0xD8634C39BBFd4033c0d3289C4515275102423681',
      });
      //   console.log(res)
      expect(res).not.null;
    });

    it('With signer : Should fetch delegates for channel', async () => {
      const res = await userKate.channel.delegate.get();
      //   console.log(res);
      expect(res).not.null;
    });
  });
});
