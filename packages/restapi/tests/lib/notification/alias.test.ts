import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { PushAPI } from '../../../src/lib/pushapi/PushAPI';
import { expect } from 'chai';
import { ethers } from 'ethers';

describe('PushAPI.alias functionality', () => {
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
    const provider = ethers.getDefaultProvider(11155111);

    signer2 = new ethers.Wallet(
      `0x${process.env['WALLET_PRIVATE_KEY']}`,
      provider
    );
    account2 = await signer2.getAddress();

    // initialisation with signer and provider
    userKate = await PushAPI.initialize(signer2);
    // initialisation with signer
    userAlice = await PushAPI.initialize(signer2);
    // TODO: remove signer1 after chat makes signer as optional
    //initialisation without signer
    userBob = await PushAPI.initialize(signer1);
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
