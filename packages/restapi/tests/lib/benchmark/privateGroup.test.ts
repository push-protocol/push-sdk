import { ethers } from 'ethers';
import Constants from '../../../src/lib/constants';
import { PushAPI } from '../../../src/lib/pushapi/PushAPI';

const users: { instance: PushAPI; account: string; signer: any }[] = [];
const _env = Constants.ENV.LOCAL;

/**
 * THIS TEST GROUP IS FOR BENCHMARKING SEND MESSAGE FOR PRIVATE GROUP
 * These tests will be skipped
 */
describe('Private Groups', () => {
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

  /**
   * STEP 1 - RUN THIS TO CREATE GRPS ON DB
   * THIS IS A 1 TIME THING
   */
  // describe('Create Group Data', () => {
  //   it('10 Members', async () => {
  //     await createGroupWithPendingMembers(userAlice, 10);
  //   });
  //   it('50 Members', async () => {
  //     await createGroupWithPendingMembers(userAlice, 50);
  //   });
  //   it('100 Members', async () => {
  //     await createGroupWithPendingMembers(userAlice, 100);
  //   });
  //   it('250 Members', async () => {
  //     await createGroupWithPendingMembers(userAlice, 250);
  //   });
  //   it('500 Members', async () => {
  //     await createGroupWithPendingMembers(userAlice, 500);
  //   });
  //   it('1000 Members', async () => {
  //     await createGroupWithPendingMembers(userAlice, 1000);
  //   });
  //   it('2500 Members', async () => {
  //     await createGroupWithPendingMembers(userAlice, 2500);
  //   });
  //   it('5000 Members', async () => {
  //     await createGroupWithPendingMembers(userAlice, 5000);
  //   });
  // });

  /**
   * STEP 2 - RUN THESE QUERIES
   * UPDATE chat_members set intent = 1
   * UPDATE W2W SET intent = REPLACE(combined_did, '_', '+');
   */

  /**
   * STEP 3 - AUTOJOIN
   * This is imp for generating session keys so , do skip this test
   */
  describe.skip('Private Group AutoJoin', () => {
    it('10 Members', async () => {
      const chatId =
        '9e8bea378b4e4860956c177146786c2e96a0db8aa7c4156299181b3e56290a57';
      await JoinGroupTime(chatId, userBob);
    });
    it('50 Members', async () => {
      const chatId =
        '822349a63cbf1423f46bda0bc2beadc91bce7a56c3217e3112c8b44393755fb3';
      await JoinGroupTime(chatId, userBob);
    });
    it('100 Members', async () => {
      const chatId =
        '6c5713714fbad5cf768f401d338f2d75fbe9aec78f5276a3d381706dea66f916';
      await JoinGroupTime(chatId, userBob);
    });
    it('250 Members', async () => {
      const chatId =
        'c1c80ecd0aade64d8dd2427699cb395e41391ab6c37d6acca49f449876fd00d5';
      await JoinGroupTime(chatId, userBob);
    });
    it('500 Members', async () => {
      const chatId =
        '0994f7f8782c2880476bb775ceeb07e042c8b3550750a9cc0c1cb2b2b7b252c8';
      await JoinGroupTime(chatId, userBob);
    });
    it('1000 Members', async () => {
      const chatId =
        'edb1d9a2930aca2dbf51e4dcb03c2dee3e4ba4dd8a467a8a1eaedb38d0b6eebd';
      await JoinGroupTime(chatId, userBob);
    });
    it('2500 Members', async () => {
      const chatId =
        'fc905114348630e30e25b36559b5b3e57035c45bf01549c67727148eef0761cf';
      await JoinGroupTime(chatId, userBob);
    });
    it('5000 Members', async () => {
      const chatId =
        '33c9295913786a8c446ceca46af8ee29a3a7144ba63071c24e5f05a5407bccdf';
      await JoinGroupTime(chatId, userBob);
    });
  });

  // describe('Private Group AutoJoin', () => {
  //   it('10 Members', async () => {
  //     await createGroupAndAutoJoin(userAlice, userBob, 10);
  //   });
  //   it('50 Members', async () => {
  //     await createGroupAndAutoJoin(userAlice, userBob, 50);
  //   });
  //   it('100 Members', async () => {
  //     await createGroupAndAutoJoin(userAlice, userBob, 100);
  //   });
  //   it('250 Members', async () => {
  //     await createGroupAndAutoJoin(userAlice, userBob, 250);
  //   });
  //   it('500 Members', async () => {
  //     await createGroupAndAutoJoin(userAlice, userBob, 500);
  //   });
  // });

  describe('Private Group Send Message', () => {
    it('10 Members', async () => {
      const chatId =
        '9e8bea378b4e4860956c177146786c2e96a0db8aa7c4156299181b3e56290a57';
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
        '822349a63cbf1423f46bda0bc2beadc91bce7a56c3217e3112c8b44393755fb3';
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
        '6c5713714fbad5cf768f401d338f2d75fbe9aec78f5276a3d381706dea66f916';

      const startTime = new Date();
      await userAlice.chat.send(chatId, {
        content: 'Sending Message to Private Grp',
        type: 'Text',
      });
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      console.log('Duration in ms : ', duration);
    });
    it('250 Members', async () => {
      const chatId =
        'c1c80ecd0aade64d8dd2427699cb395e41391ab6c37d6acca49f449876fd00d5';

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
        '0994f7f8782c2880476bb775ceeb07e042c8b3550750a9cc0c1cb2b2b7b252c8';

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
        'edb1d9a2930aca2dbf51e4dcb03c2dee3e4ba4dd8a467a8a1eaedb38d0b6eebd';
      const startTime = new Date();
      await userAlice.chat.send(chatId, {
        content: 'Sending Message to Private Grp',
        type: 'Text',
      });
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      console.log('Duration in ms : ', duration);
    });
    it('2500 Members', async () => {
      const chatId =
        'fc905114348630e30e25b36559b5b3e57035c45bf01549c67727148eef0761cf';
      const startTime = new Date();
      await userAlice.chat.send(chatId, {
        content: 'Sending Message to Private Grp',
        type: 'Text',
      });
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      console.log('Duration in ms : ', duration);
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

  describe('Update Group with Pending members', () => {
    it.only('10 Members', async () => {
      const chatId =
        'd8892a41ccbb7d0c627d1e3976f3a0bd64540d1d535b1a339680f2ce5b0fbcf0';
      await updateGroupWithPendingMembers(userAlice, chatId, 500);
    });
  });

  // describe('Private Group Send Message', () => {
  //   it('10 Members', async () => {
  //     await createGroupAndSendMessages(userAlice, 10);
  //   });
  //   it('50 Members', async () => {
  //     await createGroupAndSendMessages(userAlice, 50);
  //   });
  //   it('100 Members', async () => {
  //     await createGroupAndSendMessages(userAlice, 100);
  //   });
  //   it('250 Members', async () => {
  //     await createGroupAndSendMessages(userAlice, 250);
  //   });
  //   it('500 Members', async () => {
  //     await createGroupAndSendMessages(userAlice, 500);
  //   });
  // });
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
    if (currentMemberCount + 1000 > memberCount) {
      currentMemberCount = memberCount;
    } else {
      currentMemberCount += 1000;
    }
    const nextUsersIndex = currentMemberCount - 1;

    const membersToBeAdded: string[] = [];
    for (let i = currentUsersIndex; i < nextUsersIndex; i++) {
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
 * CREATE GROUP WITH GIVEN MEMBERS COUNT PENDING MEMBERS
 * @dev - Added members are pending members
 */
const updateGroupWithPendingMembers = async (
  user: PushAPI,
  chatId: string,
  memberCount: number
): Promise<string> => {
  /**
   * STEP 1: Generate ENOUGH USERS
   */
  console.log('Generating Users');
 const users = await generateUsers(memberCount);

  /**
   * STEP 2: Add Members to Group
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
      membersToBeAdded.push(users[i]);
    }
    await user.chat.group.add(chatId, {
      role: 'MEMBER',
      accounts: membersToBeAdded,
    });
  }
  console.log('Added Members to Group : ', currentMemberCount);
  return chatId;
};

const generateUsers = async (memberCount: number): Promise<string[]> => {
  let users: string[] = []; // Now 'users' is explicitly typed as an array of strings
  let generationCount = 0;
  const batchSize = 20;

  while (generationCount < memberCount) {
    const userPromises: Promise<string>[] = []; // An array to hold the promises which will resolve to strings
    for (let i = 0; i < batchSize && generationCount < memberCount; i++) {
      userPromises.push(
        (async () => {
          const WALLET = ethers.Wallet.createRandom();
          const signer = new ethers.Wallet(WALLET.privateKey);
          const account = `eip155:${signer.address}`;
          // Assume that PushAPI.initialize resolves successfully and you don't need anything from the resolved value
          await PushAPI.initialize(signer, {
            env: _env,
            streamOptions: { enabled: false },
          });
          return account; // This resolves to a string
        })()
      );
      generationCount++;
    }

    // Wait for all promises in the batch to resolve, and then spread their results into the 'users' array
    const batchResults = await Promise.all(userPromises);
    users = [...users, ...batchResults];

    if (generationCount % 100 == 0) {
      console.log('Generated Users : ', generationCount);
    }
  }

  console.log(
    `User Generation Completed, users generated : ${generationCount}`
  );
  return users; // 'users' is an array of strings representing accounts
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

const createGroupAndAutoJoin = async (
  user1: PushAPI,
  user2: PushAPI,
  memberCount: number
): Promise<void> => {
  const chatId = await createGroupWithNonPendingMembers(user1, memberCount);
  const startTime = new Date();
  await user2.chat.group.join(chatId);
  const endTime = new Date();
  const duration = endTime.getTime() - startTime.getTime();
  console.log('Duration in ms : ', duration);
};
