import * as PUSH_CHANNELS from '../../../src/lib/channels';
import { expect } from 'chai';
import { ethers } from 'ethers';

describe('PUSH_CHANNELS.sendNotification functionality', () => {
  let signer1: any;
  let account1: string;
  let signer2: any;
  let account2: string;
  enum ENV {
    PROD = 'prod',
    STAGING = 'staging',
    DEV = 'dev',
    /**
     * **This is for local development only**
     */
    LOCAL = 'local',
  }
  beforeEach(async () => {
    signer1 = new ethers.Wallet(
      '0xb9d00f786e1d024cfed08f696a775217ff75501f4aacef5ec0795fc4a2eb9df1'
    );
    account1 = signer1.address;

    const WALLET2 = ethers.Wallet.createRandom();
    signer2 = new ethers.Wallet(WALLET2.privateKey);
    account2 = WALLET2.address;
  });
  describe('getChannelNotifications', async () => {
    it('Should fetch notifications of a channel', async () => {
      const res = await PUSH_CHANNELS.getChannelNotifications({
        channel: '0xD8634C39BBFd4033c0d3289C4515275102423681',
        env: ENV.DEV,
      });
      console.log(res);
    });
    it('Should should fetch notifications of a channel based on filter', async () => {
      const res = await PUSH_CHANNELS.getChannelNotifications({
        channel: '0xD8634C39BBFd4033c0d3289C4515275102423681',
        env: ENV.DEV,
        filter: 1,
      });
      console.log(res);
    });
    it('Should should fetch notifications of a channel based on filter and in standard format', async () => {
      const res = await PUSH_CHANNELS.getChannelNotifications({
        channel: '0xD8634C39BBFd4033c0d3289C4515275102423681',
        env: ENV.DEV,
        filter: 1,
        raw: false,
      });
      console.log(res);
    });
    it('Should should fetch notifications of a channel based on filter and in standard format', async () => {
        const res = await PUSH_CHANNELS.getChannelNotifications({
          channel: '0xD8634C39BBFd4033c0d3289C4515275102423681',
          env: ENV.DEV,
          filter: 1,
          raw: false,
          page: 1,
          limit: 20
        });
        console.log(res);
      });
  });
});
