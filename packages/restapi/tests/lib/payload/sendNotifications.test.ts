import { expect } from 'chai';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
import { sendNotification } from '../../../src/lib/payloads/sendNotifications';
import * as testData from './testData';
import { ENV } from '../../../src/lib/constants';
import { getFeeds } from '../../../src/lib/user';
import { decryptFeed } from '../../../src/lib/utils/decryptFeed';
import { decryptPGPKey } from '../../../src/lib/helpers';
import { get } from '../../../src/lib/user/getUser';
describe('sendNotifications', () => {
  let signer1: any;
  let account1: any;
  beforeEach(async () => {
    signer1 = new ethers.Wallet(`0x${process.env['WALLET_PRIVATE_KEY']}`);
    account1 = await signer1.getAddress();
  });
  describe('sendNotification', async () => {
    it('Should send pgp encrypted notification for targetted recipient', async () => {
      const res = await sendNotification({
        ...testData.TEST_ENC_RAW_PAYLOAD,
        recipients: testData.TARGETED_RECIPIENT,
        env: ENV.DEV,
        signer: signer1
      });
      expect(res.status).to.equal(204);
      const feeds = await getFeeds({
        user: testData.TARGETED_RECIPIENT,
        env: ENV.DEV
      });
      console.log(feeds)
    });

    it("Should send pgp encrypted notification for subset recipients", async ()=> {
        const res = await sendNotification({
            ...testData.TEST_ENC_SUBSET_RAW_PAYLOAD,
            recipients: testData.SUBSET_RECIPIENT,
            env: ENV.DEV,
            signer: signer1
        })
        expect(res.status).to.equal(204);
        const userfeeds1 = await getFeeds({
            user: testData.SUBSET_RECIPIENT[0],
            env: ENV.DEV
          });
        console.log(userfeeds1)
        const userfeeds2 = await getFeeds({
            user: testData.SUBSET_RECIPIENT[1],
            env: ENV.DEV
          });
        console.log(userfeeds2)
    })

    it("Should send pgp encrypted notification for broadcast recipients", async ()=> {
      const res = await sendNotification({
          ...testData.TEST_ENC_BROADCAST_RAW_PAYLOAD,
          env: ENV.DEV,
          signer: signer1
      })
      expect(res.status).to.equal(204);
      const userfeeds1 = await getFeeds({
          user: '0x5ac9e6205eaca2bbba6ef716fd9aabd76326eeee',
          env: ENV.DEV
        });
      console.log(userfeeds1)
      const userfeeds2 = await getFeeds({
          user: '0x57c1d4dbfbc9f8cb77709493cc43eaa3cd505432',
          env: ENV.DEV
        });
      console.log(userfeeds2)
  })

    it('Should send pk encrypted targetted notification', async()=>{
        const res = await sendNotification({
            ...testData.TEST_ENC_RAW_PAYLOAD,
            recipients: testData.TEST_PK_ENC_RECIPIENT,
            env: ENV.DEV,
            signer: signer1
        })
        console.log(res.status)
    })

    it('Should send delegate notification', async()=>{
        const res = await sendNotification({
            ...testData.TEST_ENC_RAW_PAYLOAD,
            recipients: testData.TARGETED_RECIPIENT,
            env: ENV.DEV,
            signer: signer1,
            channel: 'eip155:11155111:0xD8634C39BBFd4033c0d3289C4515275102423681'
        })
        console.log(res.status)
    })
  });

  describe('decrypt encrypted feed', async () => {
    it('Should decrypt targetted feed', async () => {
      const userInfo = await get({
        account: testData.TARGETED_RECIPIENT,
        env: ENV.DEV
      });
      const decryptedPGPPrivateKey = await decryptPGPKey({
        encryptedPGPPrivateKey: userInfo.encryptedPrivateKey,
        account: account1,
        signer: signer1,
        env: ENV.DEV
      });

      const decryptedFeed = await decryptFeed({
        feed: testData.TEST_PGP_ENCRYPTED_FEED,
        decryptionKey: decryptedPGPPrivateKey
      })
    });
  });
});
