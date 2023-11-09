import { ethers } from 'ethers';
import Constants from '../../../src/lib/constants';
import { PushAPI } from '../../../src/lib/pushapi/PushAPI';

const users: { instance: PushAPI; account: string; signer: any }[] = [];
const _env = Constants.ENV.LOCAL;

/**
 * THIS TEST GROUP IS FOR BENCHMARKING SEND MESSAGE FOR PRIVATE GROUP
 * These tests will be skipped
 */
describe.only('Private Groups', () => {
  let account: string;
  let account2: string;
  let userAlice: PushAPI;
  let userBob: PushAPI;

  before(async () => {
    const WALLET_PRIVATE_KEY = process.env['WALLET_PRIVATE_KEY'];
    const Pkey = `0x${WALLET_PRIVATE_KEY}`;
    const signer = new ethers.Wallet(Pkey);
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

  // describe.skip('Private Group Send Message', () => {
  //   it('10 Members', async () => {
  //     const chatId =
  //       '8fa6560d68ee168febee36edf92323a60b493add15be3abf3437f6558a513a19';

  //     // For updating sessionKey
  //     // await userBob.chat.group.join(chatId);
  //     // await userBob.chat.group.leave(chatId);

  //     const startTime = new Date();
  //     await userAlice.chat.send(chatId, {
  //       content: 'Sending Message to Private Grp',
  //       type: 'Text',
  //     });
  //     const endTime = new Date();
  //     const duration = endTime.getTime() - startTime.getTime();
  //     console.log('Duration in ms : ', duration);
  //   });
  //   it('50 Members', async () => {
  //     const chatId =
  //       '57a0236f7d8630611804548e7121add271378f9a817e261eb36888e6ef3e9b2b';

  //     const startTime = new Date();
  //     await userAlice.chat.send(chatId, {
  //       content: 'Sending Message to Private Grp',
  //       type: 'Text',
  //     });
  //     const endTime = new Date();
  //     const duration = endTime.getTime() - startTime.getTime();
  //     console.log('Duration in ms : ', duration);
  //   });
  //   it('100 Members', async () => {
  //     /* DO THIS MANNUALY ON PUSH NODES
  //         UPDATE w2w
  //         SET intent = (SELECT GROUP_CONCAT(did SEPARATOR '+') FROM w2w_meta LIMIT 100)
  //         WHERE chat_id = '7b00afa19c56bc89c6e6497192fda6b9d8d9dcd1cdc206da15e6f926170b5b43';

  //         UPDATE w2w
  //         SET combined_did = (SELECT GROUP_CONCAT(did SEPARATOR '_') FROM w2w_meta LIMIT 100)
  //         WHERE chat_id = '7b00afa19c56bc89c6e6497192fda6b9d8d9dcd1cdc206da15e6f926170b5b43';

  //         Also add userAlice to combed_did and intent
  //     */
  //     const chatId =
  //       'bd70ad676cd287156743db927de3c87383f5e9b57e569a90864c610c5472098e';

  //     const startTime = new Date();
  //     await userAlice.chat.send(chatId, {
  //       content: 'Sending Message to Private Grp',
  //       type: 'Text',
  //     });
  //     const endTime = new Date();
  //     const duration = endTime.getTime() - startTime.getTime();
  //     console.log('Duration in ms : ', duration);
  //   });
  //   it('300 Members', async () => {
  //     // const chatId = await createGroupAndApproveIntents(userAlice, 300);
  //     const chatId =
  //       '66be638ff021e4eacb0f882655e43d8f065361dc4d27122d3cceaf60bb1481ea';

  //     const startTime = new Date();
  //     await userAlice.chat.send(chatId, {
  //       content: 'Sending Message to Private Grp',
  //       type: 'Text',
  //     });
  //     const endTime = new Date();
  //     const duration = endTime.getTime() - startTime.getTime();
  //     console.log('Duration in ms : ', duration);
  //   });
  //   it('500 Members', async () => {
  //     const chatId =
  //       '100290378de50a9c790df42ea4cd99f563a9fbf0ff7d06b3630e88c91e582af3';

  //     const startTime = new Date();
  //     await userAlice.chat.send(chatId, {
  //       content: 'Sending Message to Private Grp',
  //       type: 'Text',
  //     });
  //     const endTime = new Date();
  //     const duration = endTime.getTime() - startTime.getTime();
  //     console.log('Duration in ms : ', duration);
  //   });
  //   it('1000 Members', async () => {
  //     const chatId =
  //       '222290378de50a9c790df42ea4cd99f563a9fbf0ff7d06b3630e88c91e582af3';
  //     const startTime = new Date();
  //     await userAlice.chat.send(chatId, {
  //       content: 'Sending Message to Private Grp',
  //       type: 'Text',
  //     });
  //     const endTime = new Date();
  //     const duration = endTime.getTime() - startTime.getTime();
  //     console.log('Duration in ms : ', duration);
  //   });
  //   it('3000 Members', async () => {
  //     const chatId =
  //       '333290378de50a9c790df42ea4cd99f563a9fbf0ff7d06b3630e88c91e582af3';
  //     const startTime = new Date();
  //     await userAlice.chat.send(chatId, {
  //       content: 'Sending Message to Private Grp',
  //       type: 'Text',
  //     });
  //     const endTime = new Date();
  //     const duration = endTime.getTime() - startTime.getTime();
  //     console.log('Duration in ms : ', duration);
  //   });
  // });

  describe('Private Group Send Message', () => {
    it('10 Members', async () => {
      await createGroupAndSendMessages(userAlice, 10);
    });
    it('50 Members', async () => {
      await createGroupAndSendMessages(userAlice, 50);
    });
    it('100 Members', async () => {
      await createGroupAndSendMessages(userAlice, 100);
    });
    it('250 Members', async () => {
      await createGroupAndSendMessages(userAlice, 250);
    });
    it('500 Members', async () => {
      await createGroupAndSendMessages(userAlice, 500);
    });
    it('1000 Members', async () => {
      await createGroupAndSendMessages(userAlice, 1000);
    });
    it('2500 Members', async () => {
      await createGroupAndSendMessages(userAlice, 2500);
    });
    it('5000 Members', async () => {
      await createGroupAndSendMessages(userAlice, 5000);
    });
    it('10000 Members', async () => {
      await createGroupAndSendMessages(userAlice, 10000);
    });
    it('15000 Members', async () => {
      await createGroupAndSendMessages(userAlice, 15000);
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

/**
 * CREATE GROUP WITH GIVEN MEMBERS COUNT PENDING MEMBERS
 * @dev - Added members are pending members
 */
const createGroupWithPendingMembers = async (
  user: PushAPI,
  memberCount: number
): Promise<string> => {
  /**
   * STEP 1: Generate ENOUGH USERS
   * Note - Group already has 1 member ( Group Creator ), thus we need to generate memberCount - 1 users
   */
  console.log('Generating Users');
  let generationCount = 0;
  while (users.length < memberCount - 1) {
    const WALLET = ethers.Wallet.createRandom();
    const signer = new ethers.Wallet(WALLET.privateKey);
    const account = `eip155:${signer.address}`;
    const instance = await PushAPI.initialize(signer, {
      env: _env,
      streamOptions: { enabled: false },
    });
    users.push({
      instance,
      signer,
      account,
    });
    generationCount++;
    if (generationCount % 100 == 0) {
      console.log('Generated Users : ', generationCount);
    }
  }
  console.log(
    `User Generation Completed, users generated : ${generationCount}`
  );

  /**
   * STEP 2: Create Private Group
   */
  console.log('Creating Group with no members');
  const createdGroup = await user.chat.group.create(
    `Benchmark Grp with ${memberCount} members`,
    {
      description: 'benchmark desc',
      image: `benchmark img`,
      members: [],
      admins: [],
      private: true,
    }
  );
  console.log('Created Group with no members');

  /**
   * STEP 3: Add Members to Group
   * Note - At max 100 members can be added at once
   */
  console.log('Adding Members to Group');
  let currentMemberCount = 1;
  while (currentMemberCount < memberCount) {
    const currentUsersIndex = currentMemberCount - 1;
    if (currentMemberCount + 100 > memberCount) {
      currentMemberCount = memberCount;
    } else {
      currentMemberCount += 100;
    }
    const nextUsersIndex = currentMemberCount - 1;

    const membersToBeAdded = [];
    for (let i = currentUsersIndex; i <= nextUsersIndex; i++) {
      membersToBeAdded.push(users[i].account);
    }
    await user.chat.group.add(createdGroup.chatId, {
      role: 'MEMBER',
      accounts: membersToBeAdded,
    });
  }
  console.log('Added Members to Group : ', currentMemberCount);
  return createdGroup.chatId;
};

/**
 * CREATE GROUP WITH GIVEN MEMBERS COUNT NON-PENDING MEMBERS
 * @dev - Added members are pending members
 */
const createGroupWithNonPendingMembers = async (
  user: PushAPI,
  memberCount: number
): Promise<string> => {
  /**
   * STEP 1: Generate ENOUGH USERS
   * Note - Group already has 1 member ( Group Creator ), thus we need to generate memberCount - 1 users
   */
  console.log('Generating Users');
  let generationCount = 0;
  while (users.length < memberCount - 1) {
    const WALLET = ethers.Wallet.createRandom();
    const signer = new ethers.Wallet(WALLET.privateKey);
    const account = `eip155:${signer.address}`;
    const instance = await PushAPI.initialize(signer, {
      env: _env,
      streamOptions: { enabled: false },
    });
    users.push({
      instance,
      signer,
      account,
    });
    generationCount++;
    if (generationCount % 100 == 0) {
      console.log('Generated Users : ', generationCount);
    }
  }
  console.log(`User Generation Completed`);

  /**
   * STEP 2: Create Private Group
   */
  console.log('Creating Group with no members');
  const createdGroup = await user.chat.group.create(
    `Benchmark Grp with ${memberCount} members`,
    {
      description: 'benchmark desc',
      image: `benchmark img`,
      members: [],
      admins: [],
      private: true,
    }
  );
  console.log('Created Group with no members');

  /**
   * STEP 3: AutoJoin Group
   */
  console.log('Members AutoJoining Group');
  for (let i = 0; i < memberCount - 1; i++) {
    await users[i].instance.chat.group.join(createdGroup.chatId);
  }
  console.log('Added Members to Group');
  return createdGroup.chatId;
};

const createGroupAndSendMessages = async (
  user: PushAPI,
  memberCount: number
): Promise<void> => {
  const chatId = await createGroupWithNonPendingMembers(user, memberCount);
  const startTime = new Date();
  await user.chat.send(chatId, {
    content: 'Sending Message to Private Grp',
    type: 'Text',
  });
  const endTime = new Date();
  const duration = endTime.getTime() - startTime.getTime();
  console.log('Duration in ms : ', duration);
};
