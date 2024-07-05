import { PushAPI } from '../../../src/lib'; // Ensure correct import path
import { expect } from 'chai';
import { ethers } from 'ethers';
import { createWalletClient, http } from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import { ENV } from '../../../src/lib/constants';

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
    signer1 = new ethers.Wallet(`0x${process.env['WALLET_PRIVATE_KEY']}`);
    account1 = await signer1.getAddress();

    const provider = (ethers as any).providers
      ? new (ethers as any).providers.JsonRpcProvider('https://rpc.sepolia.org')
      : new (ethers as any).JsonRpcProvider('https://rpc.sepolia.org');

    signer2 = new ethers.Wallet(
      `0x${process.env['WALLET_PRIVATE_KEY']}`,
      provider
    );
    account2 = await signer2.getAddress();
    viemSigner = createWalletClient({
      account: privateKeyToAccount(`0x${process.env['WALLET_PRIVATE_KEY']}`),
      chain: sepolia,
      transport: http(),
    });

    // accessing env dynamically using process.env
    type EnvStrings = keyof typeof ENV;
    const envMode = process.env.ENV as EnvStrings;
    const _env = ENV[envMode];

    // initialisation with signer and provider
    userKate = await PushAPI.initialize(signer2, { env: _env });
    // initialisation with signer
    userAlice = await PushAPI.initialize(signer1, { env: _env });
    // TODO: remove signer1 after signer becomes optional
    // initialisation without signer
    userBob = await PushAPI.initialize(signer1, { env: _env });
    // initialisation with viem
    userViem = await PushAPI.initialize(viemSigner, { env: _env });
  });

  describe('PushAPI.notification functionality', () => {
    it('Should return feeds with signer object', async () => {
      const response = await userAlice.notification.list('INBOX', {
        account: '0x5ac9E6205eACA2bBbA6eF716FD9AabD76326EEee',
      });
      console.log(response);
      expect(response).not.null;
    });
  });

  describe.skip('notification :: subscribe', () => {
    beforeEach(async () => {
      //   await userAlice.notification.unsubscribe(
      //     'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681'
      //   );
      //   await userKate.notification.unsubscribe(
      //     'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681'
      //   );
      // });
      // afterEach(async () => {
      //   await userAlice.notification.unsubscribe(
      //     'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681'
      //   );
      //   await userKate.notification.unsubscribe(
      //     'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681'
      //   );
    });
    it.skip('Without signer object: should throw error', async () => {
      await expect(() =>
        userBob.notification.subscribe(
          'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681'
        )
      ).to.Throw;
    });

    it('With signer object: should convert to eth caip for normal address', async () => {
      const res = await userKate.notification.subscribe(
        '0xD8634C39BBFd4033c0d3289C4515275102423681'
      );
      // console.log(res);
      expect(res).not.null;
    });

    it('With signer object: should optin with partial caip', async () => {
      const res = await userKate.notification.subscribe(
        'eip155:0xD8634C39BBFd4033c0d3289C4515275102423681'
      );
      // console.log(res);
      expect(res).not.null;
    });

    it('With signer object: Should subscribe', async () => {
      const res = await userAlice.notification.subscribe(
        'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681',
        {
          settings: [
            {
              enabled: false,
            },
            {
              enabled: false,
              value: 0,
            },
          ],
        }
      );
      // console.log(res)
      expect(res).not.null;
    });

    it('With signer and provider: Should subscribe', async () => {
      const res = await userKate.notification.subscribe(
        'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681'
      );
      // console.log(res)
      expect(res).not.null;
    });

    it('With signer and provider: Should subscribe', async () => {
      const res = await userKate.notification.subscribe(
        'eip155:5:0xC8c243a4fd7F34c49901fe441958953402b7C024',
        {
          settings: [
            {
              enabled: false,
            },
            {
              enabled: true,
              value: 15,
            },
            {
              enabled: true,
              value: {
                lower: 5,
                upper: 10,
              },
            },
            {
              enabled: true,
              value: {
                lower: 5,
                upper: 10,
              },
            },
          ],
        }
      );
      // console.log(res);
      expect(res).not.null;
    });

    it('With viem signer and provider: Should subscribe', async () => {
      const res = await userViem.notification.subscribe(
        'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681'
      );
      expect(res.message).to.equal('successfully opted into channel');
    });

    it('With viem signer and provider: Should unsubscribe', async () => {
      const res = await userViem.notification.unsubscribe(
        'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681'
      );
      expect(res.message).to.equal('successfully opted out channel');
    });

    it('With signer object: should convert to eth caip for normal address', async () => {
      const res = await userKate.notification.unsubscribe(
        '0xD8634C39BBFd4033c0d3289C4515275102423681'
      );
      // console.log(res);
      expect(res).not.null;
    });
  });

  describe.skip('notification :: subscriptions', () => {
    it.skip('No signer or account: Should throw error', async () => {
      await expect(() => userBob.notification.subscriptions()).to.Throw;
    });

    it('Signer with no account: Should return response', async () => {
      const response = await userAlice.notification.subscriptions();
      expect(response).not.null;
    });

    it('Signer with account: Should return response', async () => {
      const response = await userAlice.notification.subscriptions({
        account: 'eip155:80001:0xD8634C39BBFd4033c0d3289C4515275102423681',
      });
      expect(response).not.null;
      expect(response.length).not.equal(0);
    });

    it('Signer with account: Should return response', async () => {
      const response = await userKate.notification.subscriptions({
        account: '0xD8634C39BBFd4033c0d3289C4515275102423681',
      });
      console.log(response);
      expect(response).not.null;
      expect(response.length).not.equal(0);
    });

    it('Signer with account: Should return response', async () => {
      const response = await userKate.notification.subscriptions({
        account: 'eip155:0xD8634C39BBFd4033c0d3289C4515275102423681',
      });
      expect(response).not.null;
      expect(response.length).not.equal(0);
    });

    it('Signer with account: Should return response', async () => {
      const response = await userKate.notification.subscriptions({
        account: '0xD8634C39BBFd4033c0d3289C4515275102423681',
      });
      expect(response).not.null;
      expect(response.length).not.equal(0);
    });

    it('Signer with account: Should return response', async () => {
      const response = await userKate.notification.subscriptions({
        account: '0xD8634C39BBFd4033c0d3289C4515275102423681',
        raw: false,
        channel: '0xD8634C39BBFd4033c0d3289C4515275102423681',
      });
      expect(response).not.null;
    });
  });
});
