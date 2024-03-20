import { ethers } from 'ethers';
import Constants from '../../../src/lib/constants';
import { PushAPI } from '../../../src/lib/pushapi/PushAPI';

const _env = Constants.ENV.PROD;

/**
 * THIS TEST GROUP IS FOR BENCHMARKING CHAT PERFORMANCE
 * These tests will be skipped
 */
describe.skip('CHAT MESSAGES', () => {
  let account: string;
  let account2: string;
  let userAlice: PushAPI;
  let userBob: PushAPI;

  before(async () => {
    // UserAlice
    const WALLET_PRIVATE_KEY = process.env['WALLET_PRIVATE_KEY'];
    const Pkey = `0x${WALLET_PRIVATE_KEY}`;
    const signer = new ethers.Wallet(Pkey);
    account = `eip155:${signer.address}`;
    userAlice = await PushAPI.initialize(signer, {
      env: _env,
      alpha: { feature: [Constants.ALPHA_FEATURES.SCALABILITY_V2] },
    });

    // UserBob
    const WALLET2 = ethers.Wallet.createRandom();
    const signer2 = new ethers.Wallet(WALLET2.privateKey);
    account2 = `eip155:${signer2.address}`;
    userBob = await PushAPI.initialize(signer2, {
      env: _env,
      alpha: { feature: [Constants.ALPHA_FEATURES.SCALABILITY_V2] },
    });

    // Send Request to UserBob
    await userAlice.chat.send(account2, {
      content: 'Hello',
      type: 'Text',
    });
    // Accept Request from UserAlice
    await userBob.chat.accept(account);

    console.log('Users initialized');
  });

  let currentChatmessages = 1;

  /**
   * HELPER FUNCTIONS
   */
  /**
   * EXCANGE MESSAGES BETWEEN TWO USERS
   * asumme chat request is already sent and accepted
   * @param userAlice
   * @param userBob
   */
  const exchangeMessages = async (
    userAlice: PushAPI,
    userBob: PushAPI,
    account1: string,
    account2: string,
    messageCount: number
  ) => {
    // Exchange some messages (50 each)
    for (let i = currentChatmessages + 1; i <= messageCount; i++) {
      if (i % 2 === 0) {
        await userAlice.chat.send(account2, {
          content: `Hello Bob${i}`,
          type: 'Text',
        });
      } else {
        await userBob.chat.send(account1, {
          content: `Hey Alice${i}`,
          type: 'Text',
        });
      }

      if (i % 100 === 0) {
        console.log('Messages exchanged : ', i);
      }
    }

    currentChatmessages =
      currentChatmessages > messageCount ? currentChatmessages : messageCount;
  };

  const getLatestMessageTime = async () => {
    const startTime = new Date();
    await userAlice.chat.latest(account2);
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    console.log('Chat.latest - Duration in ms : ', duration);
  };

  const getHistoricalMessagesTime = async () => {
    const startTime = new Date();
    const messages = await userAlice.chat.history(account2, { limit: 30 });
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    console.log('Chat.hostory - Duration in ms : ', duration);
  };

  const sendMessageAvgTime = async (msgCount: number) => {
    const startTime = new Date();
    const prevCount = currentChatmessages;
    await exchangeMessages(userAlice, userBob, account, account2, msgCount);
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    const messagesSent = currentChatmessages - prevCount;
    console.log('Chat.send - Duration in ms : ', duration / messagesSent);
  };

  const sendRequestsToNewUsers = async (userCount: number) => {
    for (let i = 0; i < userCount; i++) {
      const WALLET = ethers.Wallet.createRandom();
      const signer = new ethers.Wallet(WALLET.privateKey);
      const account = `eip155:${signer.address}`;
      await userAlice.chat.send(account, {
        content: 'Hello',
        type: 'Text',
      });
    }
  };

  it('Chat.list', async () => {
    // await sendRequestsToNewUsers(29);
    const startTime = new Date();
    const chats = await userAlice.chat.list('CHATS', { limit: 10 });
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    console.log(chats.length);
    console.log('Chat.list - Duration in ms : ', duration);
  });
  it('10 messages', async () => {
    await sendMessageAvgTime(10);
    // await getLatestMessageTime();
    // await getHistoricalMessagesTime();
  });
  it('50 messages', async () => {
    await sendMessageAvgTime(50);
    // await getLatestMessageTime();
    // await getHistoricalMessagesTime();
  });
  it('100 messages', async () => {
    await sendMessageAvgTime(100);
    // await getLatestMessageTime();
    // await getHistoricalMessagesTime();
  });
  it('250 messages', async () => {
    // await sendMessageAvgTime(250);
    await getLatestMessageTime();
    await getHistoricalMessagesTime();
  });
});
