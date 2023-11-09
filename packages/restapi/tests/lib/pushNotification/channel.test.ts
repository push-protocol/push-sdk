import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { PushAPI } from '../../../src/lib/pushapi/PushAPI';
import { expect } from 'chai';
import { ethers } from 'ethers';

describe('PushAPI.channel functionality', () => {
  let userAlice: PushAPI;
  let userBob: PushAPI;
  let userKate: PushAPI;
  let signer1: any;
  let account1: string;
  let signer2: any;
  let account2: string;
  let userNoChannel: PushAPI;
  let noChannelSigner: any;
  let noChannelAddress: string;

  beforeEach(async () => {
    signer1 = new ethers.Wallet(`0x${process.env['WALLET_PRIVATE_KEY']}`);
    account1 = await signer1.getAddress();

    const provider = new ethers.providers.JsonRpcProvider(
      // PUBLIC RPC
      'https://goerli.blockpi.network/v1/rpc/public'
    );

    signer2 = new ethers.Wallet(
      `0x${process.env['WALLET_PRIVATE_KEY']}`,
      provider
    );
    account2 = await signer2.getAddress();

    const WALLET = ethers.Wallet.createRandom();
    noChannelSigner = new ethers.Wallet(WALLET.privateKey);
    noChannelAddress = await noChannelSigner.getAddress();

    enum ENV {
      PROD = 'prod',
      STAGING = 'staging',
      DEV = 'dev',
      /**
       * **This is for local development only**
       */
      LOCAL = 'local',
    }
    // initialisation with signer and provider
    userKate = await PushAPI.initialize(signer2, { env: ENV.DEV });
    // initialisation with signer
    userAlice = await PushAPI.initialize(signer2);
    // TODO: remove signer1 after chat makes signer as optional
    //initialisation without signer
    userBob = await PushAPI.initialize(signer1);
    // initialisation with a signer that has no channel
    userNoChannel = await PushAPI.initialize(noChannelSigner);
  });

  describe('channel :: info', () => {
    // TODO: remove skip after signer becomes optional
    it.skip('Without signer and account: Should throw error', async () => {
      await expect(() => userBob.channel.info()).to.Throw;
    });

    it('Without signer but with non-caip account: Should return response', async () => {
      const res = await userBob.channel.info(
        '0x93A829d16DE51745Db0530A0F8E8A9B8CA5370E5'
      );
      // console.log(res)
      expect(res).not.null;
    });

    it('Without signer and with valid caip account: Should return response', async () => {
      const res = await userBob.channel.info(
        'eip155:11155111:0x93A829d16DE51745Db0530A0F8E8A9B8CA5370E5'
      );
      // console.log(res);
      expect(res).not.null;
    });
  });

  describe('channel :: search', () => {
    it('Without signer and account : Should return response', async () => {
      const res = await userBob.channel.search(' ');
      // console.log(res);
      expect(res).not.null;
    });

    it('With signer: Should return response', async () => {
      const res = await userBob.channel.search(' ');
      // console.log(res);
      expect(res).not.null;
    });

    it('Should throw error for empty query', async () => {
      // const res = await userBob.channel.search('')
      await expect(() => userBob.channel.search('')).to.Throw;
    });
  });

  describe('channel :: subscribers', () => {
    // TODO: remove skip after signer becomes optional
    it.skip('Without signer and account : Should throw error', async () => {
      await expect(() => userBob.channel.subscribers()).to.Throw;
    });

    it('Without signer and account : Should return response as address is passed', async () => {
      const res = await userBob.channel.subscribers({
        channel: 'eip155:11155111:0x93A829d16DE51745Db0530A0F8E8A9B8CA5370E5',
      });
      // console.log(res)
      expect(res).not.null;
    });

    it('Without signer and account : Should return response for alias address', async () => {
      const res = await userBob.channel.subscribers({
        channel: 'eip155:80001:0x93A829d16DE51745Db0530A0F8E8A9B8CA5370E5',
      });
      // console.log(res)
      expect(res).not.null;
    });

    it('Without signer and account : Should return response without passing the options', async () => {
      const res = await userKate.channel.subscribers();
      expect(res).not.null;
    });

    it('Without signer and account : Should throw error for invalid caip', async () => {
      await expect(() =>
        userBob.channel.subscribers({
          channel: '0x93A829d16DE51745Db0530A0F8E8A9B8CA5370E5',
        })
      ).to.Throw;
    });
  });

  describe('channel :: send', () => {
    // TODO: remove skip after signer becomes optional
    it.skip('Without signer and account : Should throw error', async () => {
      await expect(() => {
        userBob.channel.send(['*'], {
          notification: {
            title: 'test',
            body: 'test',
          },
        });
      }).to.Throw;
    });

    it('With signer : broadcast  : Should send notification with title and body', async () => {
      const res = await userAlice.channel.send(['*'], {
        notification: {
          title: 'test',
          body: 'test',
        },
      });
      // console.log(res)
      expect(res.status).to.equal(204);
    });

    it('With signer : targeted  : Should send notification with title and body', async () => {
      const res = await userAlice.channel.send(
        ['eip155:11155111:0xD8634C39BBFd4033c0d3289C4515275102423681'],
        {
          notification: {
            title: 'hi',
            body: 'test-targeted',
          },
        }
      );
      expect(res.status).to.equal(204);
    });

    it('With signer : targeted  : Should send notification with title and body', async () => {
      const res = await userAlice.channel.send(
        ['eip155:11155111:0x93A829d16DE51745Db0530A0F8E8A9B8CA5370E5'],
        {
          notification: {
            title: 'hi',
            body: 'test-targeted',
          },
        }
      );
      expect(res.status).to.equal(204);
    });

    it('With signer : subset  : Should send notification with title and body', async () => {
      const res = await userAlice.channel.send(
        [
          'eip155:11155111:0xD8634C39BBFd4033c0d3289C4515275102423681',
          'eip155:11155111:0x93A829d16DE51745Db0530A0F8E8A9B8CA5370E5',
        ],
        {
          notification: {
            title: 'hi',
            body: 'test-targeted',
          },
        }
      );
      expect(res.status).to.equal(204);
    });

    it('With signer : subset  : Should send notification with title and body along with additional options', async () => {
      const res = await userAlice.channel.send(
        [
          'eip155:11155111:0xD8634C39BBFd4033c0d3289C4515275102423681',
          'eip155:11155111:0x93A829d16DE51745Db0530A0F8E8A9B8CA5370E5',
        ],
        {
          notification: {
            title: 'hi',
            body: 'test-targeted',
          },
          payload: {
            title: 'testing first notification',
            body: 'testing with random body',
            cta: 'https://google.com/',
            embed: 'https://avatars.githubusercontent.com/u/64157541?s=200&v=4',
            category: 2,
          },
        }
      );
      expect(res.status).to.equal(204);
    });

    it('With signer : subset  : Should send notification with title and body along with additional options', async () => {
      const res = await userAlice.channel.send(
        [
          'eip155:11155111:0xD8634C39BBFd4033c0d3289C4515275102423681',
          'eip155:11155111:0x93A829d16DE51745Db0530A0F8E8A9B8CA5370E5',
        ],
        {
          notification: {
            title: 'hi',
            body: 'test-subset',
          },
          payload: {
            title: 'testing first subset notification',
            body: 'testing with random body',
            cta: 'https://google.com/',
            embed: 'https://avatars.githubusercontent.com/u/64157541?s=200&v=4',
          },
        }
      );
      expect(res.status).to.equal(204);
    });

    it('With signer : subset  : Should send notification with title and body along with additional options for alias', async () => {
      const res = await userAlice.channel.send(
        [
          'eip155:97:0xD8634C39BBFd4033c0d3289C4515275102423681',
          'eip155:97:0x93A829d16DE51745Db0530A0F8E8A9B8CA5370E5',
        ],
        {
          notification: {
            title: 'hi',
            body: 'test-subset',
          },
          payload: {
            title: 'testing first subset notification',
            body: 'testing with random body',
            cta: 'https://google.com/',
            embed: 'https://avatars.githubusercontent.com/u/64157541?s=200&v=4',
          },
          channel: 'eip155:97:0xD8634C39BBFd4033c0d3289C4515275102423681',
        }
      );
      expect(res.status).to.equal(204);
    });

    it('With signer : subset  : Should send notification with title and body along with additional options for alias', async () => {
      const res = await userAlice.channel.send(
        [
          'eip155:97:0xD8634C39BBFd4033c0d3289C4515275102423681',
          'eip155:97:0x93A829d16DE51745Db0530A0F8E8A9B8CA5370E5',
        ],
        {
          notification: {
            title: 'hi',
            body: 'test-subset',
          },
          payload: {
            title: 'testing first subset notification',
            body: 'testing with random body',
            cta: 'https://google.com/',
            embed: 'https://avatars.githubusercontent.com/u/64157541?s=200&v=4',
          },
          channel: 'eip155:97:0xD8634C39BBFd4033c0d3289C4515275102423681',
        }
      );
      expect(res.status).to.equal(204);
    });
    it('With signer : SIMULATED  : Should send notification with title and body', async () => {
      const res = await userNoChannel.channel.send(
        [`eip155:11155111:${noChannelAddress}`],
        {
          notification: {
            title: 'hi',
            body: 'test-targeted-simulated',
          },
        }
      );
      expect(res.status).to.equal(204);
    });
  });

  describe.skip('channel :: update', () => {
    it('Should update channel meta', async () => {
      const res = await userKate.channel.update({
        name: 'Updated Name',
        description: 'Testing new description',
        url: 'https://google.com',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAz0lEQVR4AcXBsU0EQQyG0e+saWJ7oACiKYDMEZVs6GgSpC2BIhzRwAS0sgk9HKn3gpFOAv3v3V4/3+4U4Z1q5KTy42Ql940qvFONnFSGmCFmiN2+fj7uCBlihpgh1ngwcvKfwjuVIWaIGWKNB+GdauSk8uNkJfeNKryzYogZYoZY40m5b/wlQ8wQM8TayMlKeKcaOVkJ71QjJyuGmCFmiDUe+HFy4VyEd57hx0mV+0ZliBlihlgL71w4FyMnVXhnZeSkiu93qheuDDFDzBD7BcCyMAOfy204AAAAAElFTkSuQmCC',
      });
      //   console.log(res)
      expect(res).not.null;
    }, 10000000000);
  });

  describe.skip('channel :: create', () => {
    it('Should create channel', async () => {
      const res = await userKate.channel.create({
        name: 'SDK Test',
        description: 'Testing new description',
        url: 'https://google.com',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAz0lEQVR4AcXBsU0EQQyG0e+saWJ7oACiKYDMEZVs6GgSpC2BIhzRwAS0sgk9HKn3gpFOAv3v3V4/3+4U4Z1q5KTy42Ql940qvFONnFSGmCFmiN2+fj7uCBlihpgh1ngwcvKfwjuVIWaIGWKNB+GdauSk8uNkJfeNKryzYogZYoZY40m5b/wlQ8wQM8TayMlKeKcaOVkJ71QjJyuGmCFmiDUe+HFy4VyEd57hx0mV+0ZliBlihlgL71w4FyMnVXhnZeSkiu93qheuDDFDzBD7BcCyMAOfy204AAAAAElFTkSuQmCC',
      });
      //   console.log(res)
      expect(res).not.null;
    }, 10000000000);
  });

  describe('channel :: settings', () => {
    it('Should create channel', async () => {
      const res = await userKate.channel.setting([
        {
          type: 2,
          default: 5,
          description: 'My notif setting 2',
          data: { upper: 100, lower: 5, ticker: 10, enabled: true },
        },
        { type: 1, default: 1, description: 'My Notif Settings' },
      ]);
      //   console.log(res)
      expect(res).not.null;
    }, 10000000000);
  });
});
