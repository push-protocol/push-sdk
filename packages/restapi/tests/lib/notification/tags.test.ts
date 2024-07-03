import { PushAPI } from '../../../src/lib/pushapi/PushAPI'; // Ensure correct import path
import { expect } from 'chai';
import { ethers } from 'ethers';
import { sepolia } from 'viem/chains';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
// import tokenABI from './tokenABI';
import { ENV } from '../../../src/lib/constants';

describe('PushAPI.tags functionality', () => {
  let userAlice: PushAPI;
  let userBob: PushAPI;
  let userKate: PushAPI;
  let signer1: any;
  let account1: string;
  let signer2: any;
  let viemUser: any;
  let account2: string;

  // accessing env dynamically using process.env
  type EnvStrings = keyof typeof ENV;
  const envMode = process.env.ENV as EnvStrings;
  const _env = ENV[envMode];

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
    const signer3 = createWalletClient({
      account: privateKeyToAccount(`0x${process.env['WALLET_PRIVATE_KEY']}`),
      chain: sepolia,
      transport: http(),
    });

    account2 = await signer2.getAddress();

    // initialisation with signer and provider
    userKate = await PushAPI.initialize(signer2, { env: _env });
    // initialisation with signer
    userAlice = await PushAPI.initialize(signer1, { env: _env });
    // initialisation without signer
    userBob = await PushAPI.initialize(signer1, { env: _env });
    // initalisation with viem
    viemUser = await PushAPI.initialize(signer3, { env: _env });
  });

  describe('tags :: add', () => {
    // TODO: remove skip after signer becomes optional
    it('Without signer and account :: should throw error', async () => {
      await expect(() =>
        userBob.channel.tags.add(['tag1', 'tag2', 'tag3'])
      ).to.Throw;
    });

    it('With signer and without provider :: should throw error', async () => {
      await expect(() =>
        userAlice.channel.tags.add(['tag1', 'tag2', 'tag3'])
      ).to.Throw;
    });

    it('With signer and provider :: should add tags', async () => {
      const tags = ['tag1', 'tag2', 'tag3']
      const res = await userKate.channel.tags.add(tags);
      expect(res).not.null;
      expect(res.tags).equal(tags);
    }, 100000000);

    it('With viem signer and provider :: should add tags', async () => {
      const tags = ['tag1', 'tag2', 'tag3']
      const res = await viemUser.channel.tags.add(tags);
      expect(res).not.null;
      expect(res.tags).equal(tags);
    }, 100000000);
  });

  describe('tags :: update', () => {
    // TODO: remove skip after signer becomes optional
    it('Without signer and account :: should throw error', async () => {
      await expect(() =>
        userBob.channel.tags.update(['tag1', 'tag2', 'tag3'])
      ).to.Throw;
    });

    it('With signer and without provider :: should throw error', async () => {
      await expect(() =>
        userAlice.channel.tags.update(['tag1', 'tag2', 'tag3'])
      ).to.Throw;
    });

    it('With signer and provider :: should update tags', async () => {
      const tags = ['tag1', 'tag2', 'tag3']
      const res = await userKate.channel.tags.update(tags);
      expect(res.tags).equal(tags);
    }, 100000000);

    it('With viem signer and provider :: should update tags', async () => {
      const tags = ['tag1', 'tag2', 'tag3']
      const res = await viemUser.channel.tags.update(tags);
      expect(res.tags).equal(tags);
    }, 100000000);
  });

  describe('tags :: remove', () => {
    // TODO: remove skip after signer becomes optional
    it('Without signer and account :: should throw error', async () => {
      await expect(() =>
        userBob.channel.tags.remove()
      ).to.Throw;
    });

    it('With signer and without provider :: should throw error', async () => {
      await expect(() =>
        userAlice.channel.tags.remove()
      ).to.Throw;
    });

    it.only('With signer and provider :: should remove tags', async () => {
      await userKate.channel.tags.update(['tag1', 'tag2', 'tag3']);
      const res = await userKate.channel.tags.remove();
      expect(res.status).equal('success');
    }, 100000000);
  });
});
