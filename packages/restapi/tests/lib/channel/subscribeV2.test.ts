import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import * as PUSH_CHANNEL from '../../../src/lib/channels/';
import { expect } from 'chai';
import { ethers } from 'ethers';
import CONSTANTS from '../../../src/lib/constantsV2';

describe('PUSH_CHANNEL.subscribeV2 functionality', () => {
  let signer1: any;
  let account1: string;
  let signer2: any;
  let account2: string;

  beforeEach(async () => {
    const WALLET1 = ethers.Wallet.createRandom();
    signer1 = new ethers.Wallet(WALLET1.privateKey);
    account1 = WALLET1.address;

    const WALLET2 = ethers.Wallet.createRandom();
    signer2 = new ethers.Wallet(WALLET2.privateKey);
    account2 = WALLET2.address;
  });

  it('Should subscribe to the channel via V2 without settings', async () => {
    const res = await PUSH_CHANNEL.subscribeV2({
      signer: signer1,
      channelAddress: 'eip155:11155111:0xD8634C39BBFd4033c0d3289C4515275102423681',
      userAddress: `eip155:11155111:${account1}`,
      env: CONSTANTS.ENV.STAGING,
    });
    expect(res.status).to.be.equal('success');
  });

  it('Should unsubscribe to the channel via V2 without settings', async () => {
    const res = await PUSH_CHANNEL.unsubscribeV2({
      signer: signer1,
      channelAddress: 'eip155:11155111:0xD8634C39BBFd4033c0d3289C4515275102423681',
      userAddress: `eip155:11155111:${account1}`,
      env: CONSTANTS.ENV.STAGING,
    });
    console.log(res)
    expect(res.status).to.be.equal('success');
  });

//   it('Should subscribe to the channel via V2 with settings', async () => {
//     const res = await PUSH_CHANNEL.subscribeV2({
//       signer: signer1,
//       channelAddress: 'eip155:11155111:0xD8634C39BBFd4033c0d3289C4515275102423681',
//       userAddress: `eip155:11155111:${account1}`,
//       env: CONSTANTS.ENV.STAGING,
//       userSetting: '2-1-0+2-1',
//     });
//     expect(res.status).to.be.equal('success');
//   });
});
