import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import * as PUSH_PAYLOAD from '../../../src/lib/payloads';
import { expect } from 'chai';
import { ethers } from 'ethers';

describe('PUSH_PAYLOAD.sendNotification functionality', () => {
  let signer1: any;
  let account1: string;
  let signer2: any;
  let account2: string;

  beforeEach(async () => {
    signer1 = new ethers.Wallet(
      '0xb9d00f786e1d024cfed08f696a775217ff75501f4aacef5ec0795fc4a2eb9df1'
    );
    account1 = signer1.address;

    const WALLET2 = ethers.Wallet.createRandom();
    signer2 = new ethers.Wallet(WALLET2.privateKey);
    account2 = WALLET2.address;
  });

  it('Should send notification with setting index', async () => {
    enum IDENTITY_TYPE {
      MINIMAL = 0,
      IPFS = 1,
      DIRECT_PAYLOAD = 2,
      SUBGRAPH = 3,
    }

    enum NOTIFICATION_TYPE {
      BROADCAST = 1,
      TARGETTED = 3,
      SUBSET = 4,
    }

    enum ENV {
      PROD = 'prod',
      STAGING = 'staging',
      DEV = 'dev',
      /**
       * **This is for local development only**
       */
      LOCAL = 'local',
    }
    const res = await PUSH_PAYLOAD.sendNotification({
      env: ENV.DEV,
      signer: signer1,
      type: NOTIFICATION_TYPE.BROADCAST,
      identityType: IDENTITY_TYPE.DIRECT_PAYLOAD,

      notification: {
        title: 'hey',
        body: 'hey',
      },
      payload: {
        title: 'hey',
        body: 'hey',
        cta: '',
        img: '',
        index: '1-2-10',
      },
      channel: `eip155:5:${account1}`,
    });
    expect(res.status).to.be.equal(204);
  });
});
