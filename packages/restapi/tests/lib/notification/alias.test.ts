import { PushAPI } from '../../../src/lib/pushapi/PushAPI';
import { expect } from 'chai';
import { ethers } from 'ethers';
import { ENV } from '../../../src/lib/constants';

describe('PushAPI.alias functionality', () => {
  let userAlice: PushAPI;
  let userBob: PushAPI;
  let userKate: PushAPI;
  let signer1: any;
  let account1: string;
  let signer2: any;
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
    account2 = await signer2.getAddress();

    // initialisation with signer and provider
    userKate = await PushAPI.initialize(signer2, { env: _env });
    // initialisation with signer
    userAlice = await PushAPI.initialize(signer2, { env: _env });
    // TODO: remove signer1 after chat makes signer as optional
    //initialisation without signer
    userBob = await PushAPI.initialize(signer1, { env: _env });
  });

  describe('alias :: info', () => {
    // TODO: remove skip after signer becomes optional
    it('Should return response', async () => {
      const res = await userBob.channel.alias.info({
        alias: '0x93A829d16DE51745Db0530A0F8E8A9B8CA5370E5',
        aliasChain: 'POLYGON',
      });
      //   console.log(res)
      expect(res).not.null;
    });
  });
});
