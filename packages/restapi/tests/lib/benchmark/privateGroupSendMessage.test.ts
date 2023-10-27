import { ethers } from 'ethers';
import Constants from '../../../src/lib/constants';
import { PushAPI } from '../../../src/lib/pushapi/PushAPI';

const users: { instance: PushAPI; account: string; signer: any }[] = [];

/**
 * THIS TEST GROUP IS FOR BENCHMARKING SEND MESSAGE FOR PRIVATE GROUP
 * These tests will be skipped
 */
describe.skip('Send Message', () => {
  const _env = Constants.ENV.LOCAL;
  let account: string;
  let signer: any;
  let userAlice: PushAPI;

  before(async () => {
    console.log('Generating Users');
    for (let i = 1; i <= 1000; i++) {
      const WALLET = ethers.Wallet.createRandom();
      signer = new ethers.Wallet(WALLET.privateKey);
      account = `eip155:${signer.address}`;
      const instance = await PushAPI.initialize(signer, {
        env: _env,
        streamOptions: { enabled: false },
      });
      users.push({
        instance,
        signer,
        account,
      });
      if (i % 100 == 0) {
        console.log('Generated Users : ', i);
      }
    }
    console.log('Generating Users Done');
  });

  beforeEach(async () => {
    const WALLET_PRIVATE_KEY = process.env['WALLET_PRIVATE_KEY'];
    const Pkey = `0x${WALLET_PRIVATE_KEY}`;
    signer = new ethers.Wallet(Pkey);
    account = `eip155:${signer.address}`;
    console.log(account);
    userAlice = await PushAPI.initialize(signer, {
      env: _env,
      streamOptions: { enabled: false },
    });
  });
  it('10 Members', async () => {
    const chatId = await createGroupAndApproveIntents(userAlice, 10);
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
    const chatId = await createGroupAndApproveIntents(userAlice, 50);
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
    // const chatId =
    //   'd27f17b7afdb845bc9c6d5f741256a72f8defdc547a2de2de1f821288cc795b0';

    const chatId = await createGroupAndApproveIntents(userAlice, 100);
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
    /* DO THIS MANNUALY ON PUSH NODES
        UPDATE w2w
        SET intent = (SELECT GROUP_CONCAT(did SEPARATOR '+') FROM w2w_meta LIMIT 100)
        WHERE chat_id = '7b00afa19c56bc89c6e6497192fda6b9d8d9dcd1cdc206da15e6f926170b5b43';

        UPDATE w2w
        SET combined_did = (SELECT GROUP_CONCAT(did SEPARATOR '_') FROM w2w_meta LIMIT 100)
        WHERE chat_id = '7b00afa19c56bc89c6e6497192fda6b9d8d9dcd1cdc206da15e6f926170b5b43';
    */
    // const chatId =
    //   'd27f17b7afdb845bc9c6d5f741256a72f8defdc547a2de2de1f821288cc795b0';
    const chatId = await createGroupAndApproveIntents(userAlice, 300);
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
    const chatId = await createGroupAndApproveIntents(userAlice, 500);
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
    const chatId = await createGroupAndApproveIntents(userAlice, 1000);
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

/**
 * HELPER FUNCTIONS
 */
const createGroupAndApproveIntents = async (
  user: PushAPI,
  memberNum: number
): Promise<string> => {
  /**
   * 1. Create an empty group
   */
  const createdGroup = await user.chat.group.create('Test Grp', {
    description: 'Test Desc',
    image: 'Test Img',
    members: [],
    admins: [],
    private: true,
  });
  /**
   * 2. Generate addresses
   */
  const accounts: string[] = [];
  for (let i = 0; i < memberNum; i++) {
    accounts.push(users[i].account);
  }

  /**
   * 3. Add members
   */
  await user.chat.group.add(createdGroup.chatId, {
    role: 'MEMBER',
    accounts,
  });

  /**
   * 4. Approve intents for all members
   */
  for (let i = 0; i < memberNum; i++) {
    const tmpUser = users[i].instance;
    await tmpUser.chat.group.join(createdGroup.chatId);
  }

  return createdGroup.chatId;
};
