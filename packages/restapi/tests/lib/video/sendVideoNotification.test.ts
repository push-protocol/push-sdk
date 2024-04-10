import { expect } from 'chai';
import { ethers } from 'ethers';

import { create } from '../../../src/lib/user';
import { sendNotification } from '../../../src/lib/payloads';
import { approve, send } from '../../../src/lib/chat';
import { MessageType } from '../../../src/lib/constants';

import {
  VIDEO_CALL_TYPE,
  VIDEO_NOTIFICATION_ACCESS_TYPE,
} from '../../../src/lib/payloads/constants';
import { VideoCallStatus } from '../../../src';
import { ENV } from '../../../src/lib/constants';

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

// accessing env dynamically using process.env
type EnvStrings = keyof typeof ENV;
const envMode = process.env.ENV as EnvStrings;
const env = ENV[envMode];

// Test suite for sendNotification functionality for video calls
describe('sendNotification functionality for video calls', () => {
  // Define variables for two signers and their accounts
  let signer1: any;
  let decryptedPrivateKey1: string;
  let account1: string;
  let signer2: any;
  let decryptedPrivateKey2: string;
  let account2: string;

  let chatId: string;

  // Before running the tests, set up the signers and accounts
  before(async () => {
    // Create the first signer
    const WALLET1 = ethers.Wallet.createRandom();
    signer1 = new ethers.Wallet(WALLET1.privateKey);
    // Get the address of the first account
    account1 = signer1.address;

    // Create the second signer
    const WALLET2 = ethers.Wallet.createRandom();
    signer2 = new ethers.Wallet(WALLET2.privateKey);
    // Get the address of the second account
    account2 = WALLET2.address;

    // Create the first user using the first signer
    const user1 = await create({
      signer: signer1,
      env,
    });
    decryptedPrivateKey1 = user1.decryptedPrivateKey!;

    // Create the second user using the second signer
    const user2 = await create({
      signer: signer2,
      env,
    });
    decryptedPrivateKey2 = user2.decryptedPrivateKey!;

    // Send a message from the first user to the second user
    const sendApiResponse = await send({
      message: {
        content: 'Hey I want to video call.',
        type: MessageType.TEXT,
      },
      receiverAddress: account2,
      signer: signer1,
      pgpPrivateKey: decryptedPrivateKey1,
      env,
    });

    chatId = sendApiResponse.chatId;

    // Approve the message from the first user
    await approve({
      status: 'Approved',
      senderAddress: account1,
      signer: signer2,
      pgpPrivateKey: decryptedPrivateKey2,
      env,
    });
  });

  it('Should send INITIALIZED video call notification with rules object', async () => {
    // Send a notification and store the response
    const res = await sendNotification({
      senderType: 1,
      pgpPrivateKey: decryptedPrivateKey1,
      env,
      signer: signer1,
      type: NOTIFICATION_TYPE.TARGETTED,
      identityType: IDENTITY_TYPE.DIRECT_PAYLOAD,
      rules: {
        access: {
          type: VIDEO_NOTIFICATION_ACCESS_TYPE.PUSH_CHAT,
          data: { chatId },
        },
      },
      notification: {
        title: 'VIDEO CALL',
        body: 'VIDEO CALL',
      },
      payload: {
        title: 'VIDEO CALL',
        body: 'VIDEO CALL',
        cta: '',
        img: '',
        additionalMeta: {
          type: `${VIDEO_CALL_TYPE.PUSH_VIDEO}+1`,
          data: JSON.stringify({
            senderAddress: account1,
            recipientAddress: account2,
            chatId,
            signalData: null,
            status: VideoCallStatus.INITIALIZED,
          }),
        },
      },
      channel: `eip155:11155111:${account1}`,
      recipients: `eip155:11155111:${account2}`,
    });

    // Check that the response status is 204
    expect(res.status).to.be.equal(204);
  });

  it('Should send INITIALIZED video call notification with chatId for backwards compatibility', async () => {
    // Send a notification and store the response
    const res = await sendNotification({
      env,
      senderType: 1,
      pgpPrivateKey: decryptedPrivateKey1,
      signer: signer1,
      type: NOTIFICATION_TYPE.TARGETTED,
      identityType: IDENTITY_TYPE.DIRECT_PAYLOAD,
      chatId,
      notification: {
        title: 'VIDEO CALL',
        body: 'VIDEO CALL',
      },
      payload: {
        title: 'VIDEO CALL',
        body: 'VIDEO CALL',
        cta: '',
        img: '',
        additionalMeta: {
          type: `${VIDEO_CALL_TYPE.PUSH_VIDEO}+1`,
          data: JSON.stringify({
            senderAddress: account1,
            recipientAddress: account2,
            chatId,
            signalData: null,
            status: VideoCallStatus.INITIALIZED,
          }),
        },
      },
      channel: `eip155:11155111:${account1}`,
      recipients: `eip155:11155111:${account2}`,
    });

    // Check that the response status is 204
    expect(res.status).to.be.equal(204);
  });
});
