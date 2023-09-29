import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { PushAPI } from '../../../src/lib/pushapi/PushAPI'; // Ensure correct import path
import { expect } from 'chai';
import { ethers } from 'ethers';
import { createWalletClient, http } from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { goerli } from 'viem/chains';
// import tokenABI from './tokenABI';
describe('PushAPI.notification functionality', () => {
  let userAlice: PushAPI;
  let userBob: PushAPI;
  let userKate: PushAPI;
  let signer1: any;
  let account1: string;
  let signer2: any;
  let account2: string;
  let viemSigner: any;
  let userViem: PushAPI;
  beforeEach(async () => {
    signer1 = new ethers.Wallet(
      `0x${process.env['NFT_HOLDER_WALLET_PRIVATE_KEY_1']}`
    );
    account1 = await signer1.getAddress();

    const provider = new ethers.providers.JsonRpcProvider(
      'https://goerli.blockpi.network/v1/rpc/public'
    );

    signer2 = new ethers.Wallet(
      `0x${process.env['NFT_HOLDER_WALLET_PRIVATE_KEY_1']}`,
      provider
    );
    account2 = await signer2.getAddress();
    viemSigner = createWalletClient({
      account: privateKeyToAccount(
        `0x${process.env['NFT_HOLDER_WALLET_PRIVATE_KEY_1']}`
      ),
      chain: goerli,
      transport: http(),
    });
    // initialisation with signer and provider
    userKate = await PushAPI.initialize(signer2);
    // initialisation with signer
    userAlice = await PushAPI.initialize(signer1);
    // TODO: remove signer1 after signer becomes optional
    // initialisation without signer
    userBob = await PushAPI.initialize(signer1);
    // initialisation with viem
    userViem = await PushAPI.initialize(viemSigner);
  });

  describe('PushAPI.notification functionality', () => {
    it('Should return feeds with signer object', async () => {
      const response = await userAlice.notification.list('SPAM');
      expect(response).not.null;
    });

    it('Should return feeds with signer object when an account is passed', async () => {
      const response = await userAlice.notification.list('SPAM', {
        account: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681',
      });
      expect(response).not.null;
      expect(response.length).not.equal(0);
    });

    it('Should return feeds without signer object when an account is passed', async () => {
      const response = await userBob.notification.list('SPAM', {
        account: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681',
      });
      expect(response).not.null;
      expect(response.length).not.equal(0);
    });

    it.skip('Should throw error without signer object when an account is not passed', async () => {
      await expect(() => userBob.notification.list('SPAM')).to.Throw;
    });

    it('Should return feeds when signer with provider is used', async () => {
      const response = await userKate.notification.list('SPAM');
      expect(response).not.null;
    });

    it('Should return feeds when viem is used', async () => {
      const response = await userViem.notification.list('SPAM');
      console.log(response)
      expect(response).not.null;
    });

    it('Should return feeds when signer with provider is used', async () => {
      const response = await userKate.notification.list('INBOX', {
        account: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681',
        channels: ['0xD8634C39BBFd4033c0d3289C4515275102423681'],
        raw: true,
      });
        // console.log(response)
      expect(response).not.null;
    });
  });

  describe('notification :: subscribe', () => {
    beforeEach(async () => {
      await userAlice.notification.unsubscribe(
        'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681'
      );

      await userKate.notification.unsubscribe(
        'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681'
      );
    });

    afterEach(async () => {
      await userAlice.notification.unsubscribe(
        'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681'
      );

      await userKate.notification.unsubscribe(
        'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681'
      );
    });
    it.skip('Without signer object: should throw error', async () => {
      await expect(() =>
        userBob.notification.subscribe(
          'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681'
        )
      ).to.Throw;
    });

    it.skip('With signer object: should throw error for invalid channel caip', async () => {
      await expect(() => {
        userAlice.notification.subscribe(
          '0xD8634C39BBFd4033c0d3289C4515275102423681'
        );
      }).to.Throw;
    });

    it('With signer object: Should subscribe', async () => {
      const res = await userAlice.notification.subscribe(
        'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681'
      );
      console.log(res)
      expect(res).not.null;
    });

    it('With signer and provider: Should subscribe', async () => {
      const res = await userKate.notification.subscribe(
        'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681'
      );
      // console.log(res)
      expect(res).not.null;
    });

    it('With viem signer and provider: Should subscribe', async () => {
      const res = await userViem.notification.subscribe(
        'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681'
      );
      // console.log(res)
      expect(res).not.null;
    });
  });

  describe('notification :: subscriptions', () => {
    it.skip('No signer or account: Should throw error', async () => {
      await expect(() => userBob.notification.subscriptions()).to.Throw;
    });

    it('Signer with no account: Should return response', async () => {
      const response = await userAlice.notification.subscriptions();
        console.log(response);
      expect(response).not.null;
    });

    it('Signer with account: Should return response', async () => {
      const response = await userAlice.notification.subscriptions({
        account: 'eip155:80001:0xD8634C39BBFd4033c0d3289C4515275102423681',
      });
      //   console.log(response);
      expect(response).not.null;
      expect(response.lenth).not.equal(0);
    });
  });

  // TO RUN THIS, MAKE THE PRIVATE FUNTIONS PUBLIC
  // describe('debug :: test private functions', () => {
  //     it('Fetching data from contract', async () => {
  //       const contract = userKate.createContractInstance(
  //         '0x2b9bE9259a4F5Ba6344c1b1c07911539642a2D33',
  //         tokenABI
  //       );
  //       const balance = await contract['balanceOf'](
  //         '0xD8634C39BBFd4033c0d3289C4515275102423681'
  //       );
  //       console.log(balance.toString());
  //       const fees = ethers.utils.parseUnits('50', 18);
  //       console.log(fees)
  //       console.log(fees.lte(balance))
  //     });

  //     it("Uploading data to ipfs via push node", async () => {
  //         await userAlice.uploadToIPFSViaPushNode("test")
  //     })

  // it('Should get proper minnimal payload', () => {
  //   const inputData = [
  //     {
  //       type: 0,
  //       default: 1,
  //       description: 'test1',
  //     },
  //     {
  //       type: 1,
  //       default: 10,
  //       description: 'test2',
  //       data: {
  //         upper: 100,
  //         lower: 1,
  //       },
  //     },
  //   ];

  //   const minimalSettings = userAlice.getMinimalSetting(inputData);
  //   console.log(minimalSettings);
  // });

  // it('Should get proper minnimal payload', () => {
  //   const inputData = [
  //     {
  //       type: 1,
  //       default: 10,
  //       description: 'test2',
  //       data: {
  //         upper: 100,
  //         lower: 1,
  //       },
  //     },
  //     {
  //       type: 0,
  //       default: 1,
  //       description: 'test1',
  //     },
  //   ];

  //   const minimalSettings = userAlice.getMinimalSetting(inputData);
  //   console.log(minimalSettings);
  // });
  // });
});
