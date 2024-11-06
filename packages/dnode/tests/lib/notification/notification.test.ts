import { PushAPI } from '../../../src/lib'; // Ensure correct import path
import { expect } from 'chai';
import { ethers } from 'ethers';
import { createWalletClient, http } from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import { ENV } from '../../../src/lib/constants';
describe('PushAPI.notification functionality', () => {
  let userAlice: PushAPI;
  let userKate: PushAPI;
  let userBob: PushAPI;
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

    // initialisation with no signer
    userBob = await PushAPI.initialize(null, { env: _env, account: account1 });
    // initialisation with signer
    userAlice = await PushAPI.initialize(signer1, { env: _env });
    // initialisation with signer and provider
    userKate = await PushAPI.initialize(signer2, { env: _env });
    // initialisation with viem
    userViem = await PushAPI.initialize(viemSigner, { env: _env });
  });

  describe('PushAPI.notification functionality', () => {
    it('Should return feeds with signer object', async () => {
      const response = await userAlice.notification.list('INBOX', {
        account: '0x1af9C19A1513B9D05a7E5CaAd9F9239EF54fE2b1',
      });
      console.log(response);
      expect(response).not.null;
    });
  });

  describe('notification :: subscribe', () => {
    it('Without signer object: should throw error', async () => {
      await expect(() =>
        userBob.notification.subscribe(
          'eip155:11155111:0x35B84d6848D16415177c64D64504663b998A6ab4'
        )
      ).to.Throw;
    });

    it('With signer object: should convert to eth caip for normal address', async () => {
      const res = await userAlice.notification.subscribe(
        '0x35B84d6848D16415177c64D64504663b998A6ab4'
      );
      expect(res.status).to.equal(204);
    });

    it('With signer object and provider: should convert to eth caip for normal address', async () => {
      const res = await userAlice.notification.subscribe(
        '0x35B84d6848D16415177c64D64504663b998A6ab4'
      );
      expect(res.status).to.equal(204);
    });

    it('With signer object nad provider: should optin with partial caip', async () => {
      const res = await userKate.notification.subscribe(
        'eip155:0x35B84d6848D16415177c64D64504663b998A6ab4'
      );
      expect(res.status).to.equal(204);
    });

    it('With signer object: should optin with partial caip', async () => {
      const res = await userKate.notification.subscribe(
        'eip155:0x35B84d6848D16415177c64D64504663b998A6ab4'
      );
      expect(res.status).to.equal(204);
    });

    it('With signer object and settings : Should subscribe', async () => {
      const res = await userAlice.notification.subscribe(
        'eip155:11155111:0x35B84d6848D16415177c64D64504663b998A6ab4',
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
      expect(res.status).to.equal(204);
    });

    it('With signer and provider and settings : Should subscribe', async () => {
      const res = await userKate.notification.subscribe(
        'eip155:11155111:0xC8c243a4fd7F34c49901fe441958953402b7C024',
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
      expect(res.status).to.equal(204);
    });

    it('With viem signer and provider: Should subscribe', async () => {
      const res = await userViem.notification.subscribe(
        'eip155:11155111:0xD8634C39BBFd4033c0d3289C4515275102423681'
      );
      expect(res.status).to.equal(204);
      expect(res.message).to.equal('successfully opted into channel');
    });
  });

  describe('notification :: unsubscribe', () => {
    it('Without signer object: should throw error', async () => {
      await expect(() =>
        userBob.notification.unsubscribe(
          'eip155:11155111:0x35B84d6848D16415177c64D64504663b998A6ab4'
        )
      ).to.Throw;
    });

    it('With signer object: should convert to eth caip for normal address', async () => {
      const res = await userAlice.notification.unsubscribe(
        '0x35B84d6848D16415177c64D64504663b998A6ab4'
      );
      expect((res as { status: string }).status).to.equal(204);
    });

    it('With signer object and provider: should convert to eth caip for normal address', async () => {
      const res = await userAlice.notification.unsubscribe(
        '0x35B84d6848D16415177c64D64504663b998A6ab4'
      );
      expect((res as { status: string }).status).to.equal(204);
    });

    it('With signer object nad provider: should optout with partial caip', async () => {
      const res = await userKate.notification.unsubscribe(
        'eip155:0x35B84d6848D16415177c64D64504663b998A6ab4'
      );
      expect((res as { status: string }).status).to.equal(204);
    });

    it('With signer object: should optout with partial caip', async () => {
      const res = await userKate.notification.unsubscribe(
        'eip155:0x35B84d6848D16415177c64D64504663b998A6ab4'
      );
      expect((res as { status: string }).status).to.equal(204);
    });

    it('With viem signer and provider: Should unsubscribe', async () => {
      const res = await userViem.notification.unsubscribe(
        'eip155:11155111:0xD8634C39BBFd4033c0d3289C4515275102423681'
      );
      expect((res as { status: string }).status).to.equal(204);
      expect(res.message).to.equal('successfully opted into channel');
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
