import { ethers } from 'ethers';
import Constants from '../../../src/lib/constants';
import { PushAPI } from '../../../src/lib/pushapi/PushAPI';

const users: { instance: PushAPI; account: string; signer: any }[] = [];

/**
 * THIS TEST GROUP IS FOR BENCHMARKING SEND MESSAGE FOR PRIVATE GROUP
 * These tests will be skipped
 */
describe.skip('Private Groups', () => {
  const _env = Constants.ENV.LOCAL;
  let account: string;
  let signer: any;
  let userAlice: PushAPI;
  let userBob: PushAPI;
  let account2: string;

  before(async () => {
    // console.log('Generating Users');
    // for (let i = 1; i <= 2000; i++) {
    //   const WALLET = ethers.Wallet.createRandom();
    //   signer = new ethers.Wallet(WALLET.privateKey);
    //   account = `eip155:${signer.address}`;
    //   const instance = await PushAPI.initialize(signer, {
    //     env: _env,
    //     streamOptions: { enabled: false },
    //   });
    //   users.push({
    //     instance,
    //     signer,
    //     account,
    //   });
    //   if (i % 100 == 0) {
    //     console.log('Generated Users : ', i);
    //   }
    // }
    // console.log('Generating Users Done');

    const WALLET_PRIVATE_KEY = process.env['WALLET_PRIVATE_KEY'];
    const Pkey = `0x${WALLET_PRIVATE_KEY}`;
    signer = new ethers.Wallet(Pkey);
    account = `eip155:${signer.address}`;
    userAlice = await PushAPI.initialize(signer, {
      env: _env,
      streamOptions: { enabled: false },
    });

    const WALLET2 = ethers.Wallet.createRandom();
    const signer2 = new ethers.Wallet(WALLET2.privateKey);
    account2 = `eip155:${signer2.address}`;
    userBob = await PushAPI.initialize(signer2, { env: _env });
  });

  describe.skip('Private Group Join', () => {
    it('10 Members', async () => {
      const chatId =
        '8fa6560d68ee168febee36edf92323a60b493add15be3abf3437f6558a513a19';
      await JoinGroupTime(chatId, userBob);
    });
    it('50 Members', async () => {
      const chatId =
        '57a0236f7d8630611804548e7121add271378f9a817e261eb36888e6ef3e9b2b';
      await JoinGroupTime(chatId, userBob);
    });
    it('100 Members', async () => {
      const chatId =
        'bd70ad676cd287156743db927de3c87383f5e9b57e569a90864c610c5472098e';
      await JoinGroupTime(chatId, userBob);
    });
    it('300 Members', async () => {
      const chatId =
        '66be638ff021e4eacb0f882655e43d8f065361dc4d27122d3cceaf60bb1481ea';
      await JoinGroupTime(chatId, userBob);
    });
    it('500 Members', async () => {
      const chatId =
        '100290378de50a9c790df42ea4cd99f563a9fbf0ff7d06b3630e88c91e582af3';
      await JoinGroupTime(chatId, userBob);
    });
    it('1000 Members', async () => {
      const chatId =
        '222290378de50a9c790df42ea4cd99f563a9fbf0ff7d06b3630e88c91e582af3';
      await JoinGroupTime(chatId, userBob);
    });
    it('3000 Members', async () => {
      const chatId =
        '333290378de50a9c790df42ea4cd99f563a9fbf0ff7d06b3630e88c91e582af3';
      await JoinGroupTime(chatId, userBob);
    });
  });

  describe('Private Group Send Message', () => {
    it('10 Members', async () => {
      const chatId =
        '8fa6560d68ee168febee36edf92323a60b493add15be3abf3437f6558a513a19';

      // For updating sessionKey
      // await userBob.chat.group.join(chatId);
      // await userBob.chat.group.leave(chatId);

      const startTime = new Date();
      await userAlice.chat.send(chatId, {
        content: 'Sending Message to Private Grp',
        type: 'Text',
      });
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      console.log('Duration in ms : ', duration);
    });
    it('50 Members', async () => {
      const chatId =
        '57a0236f7d8630611804548e7121add271378f9a817e261eb36888e6ef3e9b2b';

      const startTime = new Date();
      await userAlice.chat.send(chatId, {
        content: 'Sending Message to Private Grp',
        type: 'Text',
      });
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      console.log('Duration in ms : ', duration);
    });
    it('100 Members', async () => {
      /* DO THIS MANNUALY ON PUSH NODES
          UPDATE w2w
          SET intent = (SELECT GROUP_CONCAT(did SEPARATOR '+') FROM w2w_meta LIMIT 100)
          WHERE chat_id = '7b00afa19c56bc89c6e6497192fda6b9d8d9dcd1cdc206da15e6f926170b5b43';
  
          UPDATE w2w
          SET combined_did = (SELECT GROUP_CONCAT(did SEPARATOR '_') FROM w2w_meta LIMIT 100)
          WHERE chat_id = '7b00afa19c56bc89c6e6497192fda6b9d8d9dcd1cdc206da15e6f926170b5b43';
  
          Also add userAlice to combed_did and intent
      */
      const chatId =
        'bd70ad676cd287156743db927de3c87383f5e9b57e569a90864c610c5472098e';

      const startTime = new Date();
      await userAlice.chat.send(chatId, {
        content: 'Sending Message to Private Grp',
        type: 'Text',
      });
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      console.log('Duration in ms : ', duration);
    });
    it('300 Members', async () => {
      // const chatId = await createGroupAndApproveIntents(userAlice, 300);
      const chatId =
        '66be638ff021e4eacb0f882655e43d8f065361dc4d27122d3cceaf60bb1481ea';

      const startTime = new Date();
      await userAlice.chat.send(chatId, {
        content: 'Sending Message to Private Grp',
        type: 'Text',
      });
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      console.log('Duration in ms : ', duration);
    });
    it('500 Members', async () => {
      const chatId =
        '100290378de50a9c790df42ea4cd99f563a9fbf0ff7d06b3630e88c91e582af3';

      const startTime = new Date();
      await userAlice.chat.send(chatId, {
        content: 'Sending Message to Private Grp',
        type: 'Text',
      });
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      console.log('Duration in ms : ', duration);
    });
    it('1000 Members', async () => {
      const chatId =
        '222290378de50a9c790df42ea4cd99f563a9fbf0ff7d06b3630e88c91e582af3';
      const startTime = new Date();
      await userAlice.chat.send(chatId, {
        content: 'Sending Message to Private Grp',
        type: 'Text',
      });
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      console.log('Duration in ms : ', duration);
    });
    it('3000 Members', async () => {
      const chatId =
        '333290378de50a9c790df42ea4cd99f563a9fbf0ff7d06b3630e88c91e582af3';
      const startTime = new Date();
      await userAlice.chat.send(chatId, {
        content: 'Sending Message to Private Grp',
        type: 'Text',
      });
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      console.log('Duration in ms : ', duration);
    });
  });
});

/**
 * Helper Functions
 */
const JoinGroupTime = async (chatId: string, userBob: PushAPI) => {
  const startTime = new Date();
  await userBob.chat.group.join(chatId);
  const endTime = new Date();
  const duration = endTime.getTime() - startTime.getTime();
  console.log('Duration in ms : ', duration);
  await userBob.chat.group.leave(chatId);
};
