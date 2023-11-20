import { ethers } from 'ethers';
import Constants from '../../../src/lib/constants';
import { PushAPI } from '../../../src/lib/pushapi/PushAPI';
import { users } from './data/did';

const _env = Constants.ENV.LOCAL;

/**
 * THIS TEST GROUP IS FOR BENCHMARKING PUBLIC GROUP
 * These tests will be skipped
 */
describe.skip('Public Groups', () => {
  let account: string;
  let account2: string;
  let userAlice: PushAPI;
  let userBob: PushAPI;

  before(async () => {
    /**
     * DATA PREP STEP 1
     */
    // await generateUsers(100000);

    // UserAlice
    const WALLET_PRIVATE_KEY = process.env['WALLET_PRIVATE_KEY'];
    const Pkey = `0x${WALLET_PRIVATE_KEY}`;
    const signer = new ethers.Wallet(Pkey);
    account = `eip155:${signer.address}`;
    userAlice = await PushAPI.initialize(signer, {
      env: _env,
    });

    // UserBob
    const WALLET2 = ethers.Wallet.createRandom();
    const signer2 = new ethers.Wallet(WALLET2.privateKey);
    account2 = `eip155:${signer2.address}`;
    userBob = await PushAPI.initialize(signer2, { env: _env });
  });

  /**
   * DATA PREP STEP 2
   * RUN THIS TO CREATE GRPS ON DB
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
  //   it('10000 Members', async () => {
  //     await createGroupWithPendingMembers(userAlice, 10000);
  //   });
  //   it('15000 Members', async () => {
  //     await createGroupWithPendingMembers(userAlice, 15000);
  //   });
  //   it('25000 Members', async () => {
  //     await createGroupWithPendingMembers(userAlice, 25000);
  //   });
  //   it('50000 Members', async () => {
  //     await createGroupWithPendingMembers(userAlice, 50000);
  //   });
  //   it('75000 Members', async () => {
  //     await createGroupWithPendingMembers(userAlice, 75000);
  //   });

  //   it('100000 Members', async () => {
  //     await createGroupWithPendingMembers(userAlice, 100000);
  //   });
  // });

  /**
   * DATA PREP STEP 3
   * UPDATE chat_members set intent = 1
   * UPDATE W2W SET intent = REPLACE(combined_did, '_', '+');
   */

  describe('Public Group AutoJoin', () => {
    it('10 Members', async () => {
      const chatId =
        '95c76871a28334053ca7cea1adf8e1b78ec40df23c37c251d604d97906deeb76';
      await joinGroupTime(chatId, userBob);
    });
    it('50 Members', async () => {
      const chatId =
        '9998f808242bf002f6e49f5e24f7364b7347022016f52b77b4658cfd9dc72a35';
      await joinGroupTime(chatId, userBob);
    });
    it('100 Members', async () => {
      const chatId =
        '5ef641dac985bec73a2dd838bb01a0502d1abf8b1a91d7d5c972006057fa82ee';
      await joinGroupTime(chatId, userBob);
    });
    it('250 Members', async () => {
      const chatId =
        '061da0c3dd023471bfed143f304f07e7e0c428e7dde7951b09a7ffd20d43dbf6';
      await joinGroupTime(chatId, userBob);
    });
    it('500 Members', async () => {
      const chatId =
        '495f02423c64a9d9505083df90b30f54dea1a0683cfcb373ace98d63bc1e2912';
      await joinGroupTime(chatId, userBob);
    });
    it('1000 Members', async () => {
      const chatId =
        '325f376206d3f8e1bef5f15e7af663da4112ff2e52919e45f33329355aa54207';
      await joinGroupTime(chatId, userBob);
    });
    it('2500 Members', async () => {
      const chatId =
        '02bec25cb746038f196c03d69b7d292a540ede29d4750297f302ab510cd1f864';
      await joinGroupTime(chatId, userBob);
    });
    it('5000 Members', async () => {
      const chatId =
        '7b36d304fbda26792b83e0dda85d928b77abba9a971ed6f950adea0e86112f0d';
      await joinGroupTime(chatId, userBob);
    });
    it('10000 Members', async () => {
      const chatId =
        '8dbb18d7c312928180f9498c8c1cfe662d14bbc96adda8dc4f4ab36fcb06014d';
      await joinGroupTime(chatId, userBob);
    });
    it('15000 Members', async () => {
      const chatId =
        'a92dbe68c1ada0b451725bc0d9499caf75052e9a45cd7835fec4ae96401848ff';
      await joinGroupTime(chatId, userBob);
    });
    it('25000 Members', async () => {
      const chatId =
        'fb0bb517380112fcc18033bf5aec293ce8b5bd02ed83917a506b336f1617a37a';
      await joinGroupTime(chatId, userBob);
    });
    it('50000 Members', async () => {
      const chatId =
        '3ef0d3c7b99bc740d53543f93e0edb3de2179cb2ad81f63ff3cb8e66eae9c782';
      await joinGroupTime(chatId, userBob);
    });
    it('75000 Members', async () => {
      const chatId =
        '7b405834d7ceb3853b130a896eb2feb64fa5ece8991159367439c7b446acd116';
      await joinGroupTime(chatId, userBob);
    });
    it('84000 Members', async () => {
      const chatId =
        '08c4e1b96482ed73ce003ed58325e7fd3d8d22ff34267067f36fe600e62b9849';
      await joinGroupTime(chatId, userBob);
    });
  });

  describe('Public Group Send Message', () => {
    it('10 Members', async () => {
      const chatId =
        '95c76871a28334053ca7cea1adf8e1b78ec40df23c37c251d604d97906deeb76';
      await sendMessageTime(chatId, userAlice);
    });
    it('50 Members', async () => {
      const chatId =
        '9998f808242bf002f6e49f5e24f7364b7347022016f52b77b4658cfd9dc72a35';
      await sendMessageTime(chatId, userAlice);
    });
    it('100 Members', async () => {
      const chatId =
        '5ef641dac985bec73a2dd838bb01a0502d1abf8b1a91d7d5c972006057fa82ee';
      await sendMessageTime(chatId, userAlice);
    });
    it('250 Members', async () => {
      const chatId =
        '061da0c3dd023471bfed143f304f07e7e0c428e7dde7951b09a7ffd20d43dbf6';
      await sendMessageTime(chatId, userAlice);
    });
    it('500 Members', async () => {
      const chatId =
        '495f02423c64a9d9505083df90b30f54dea1a0683cfcb373ace98d63bc1e2912';
      await sendMessageTime(chatId, userAlice);
    });
    it('1000 Members', async () => {
      const chatId =
        '325f376206d3f8e1bef5f15e7af663da4112ff2e52919e45f33329355aa54207';
      await sendMessageTime(chatId, userAlice);
    });
    it('2500 Members', async () => {
      const chatId =
        '02bec25cb746038f196c03d69b7d292a540ede29d4750297f302ab510cd1f864';
      await sendMessageTime(chatId, userAlice);
    });
    it('5000 Members', async () => {
      const chatId =
        '7b36d304fbda26792b83e0dda85d928b77abba9a971ed6f950adea0e86112f0d';
      await sendMessageTime(chatId, userAlice);
    });
    it('10000 Members', async () => {
      const chatId =
        '8dbb18d7c312928180f9498c8c1cfe662d14bbc96adda8dc4f4ab36fcb06014d';
      await sendMessageTime(chatId, userAlice);
    });
    it('15000 Members', async () => {
      const chatId =
        'a92dbe68c1ada0b451725bc0d9499caf75052e9a45cd7835fec4ae96401848ff';
      await sendMessageTime(chatId, userAlice);
    });
    it('25000 Members', async () => {
      const chatId =
        'fb0bb517380112fcc18033bf5aec293ce8b5bd02ed83917a506b336f1617a37a';
      await sendMessageTime(chatId, userAlice);
    });
    it('50000 Members', async () => {
      const chatId =
        '3ef0d3c7b99bc740d53543f93e0edb3de2179cb2ad81f63ff3cb8e66eae9c782';
      await sendMessageTime(chatId, userAlice);
    });
    it('75000 Members', async () => {
      const chatId =
        '7b405834d7ceb3853b130a896eb2feb64fa5ece8991159367439c7b446acd116';
      await sendMessageTime(chatId, userAlice);
    });
    it('84000 Members', async () => {
      const chatId =
        '08c4e1b96482ed73ce003ed58325e7fd3d8d22ff34267067f36fe600e62b9849';
      await sendMessageTime(chatId, userAlice);
    });
  });
});

/**
 * Helper Functions
 */
const joinGroupTime = async (chatId: string, userBob: PushAPI) => {
  const startTime = new Date();
  await userBob.chat.group.join(chatId);
  const endTime = new Date();
  const duration = endTime.getTime() - startTime.getTime();
  console.log('Duration in ms : ', duration);
  await userBob.chat.group.leave(chatId);
};
const sendMessageTime = async (chatId: string, userAlice: PushAPI) => {
  const startTime = new Date();
  await userAlice.chat.send(chatId, {
    content: 'Sending Message to Public Grp',
    type: 'Text',
  });
  const endTime = new Date();
  const duration = endTime.getTime() - startTime.getTime();
  console.log('Duration in ms : ', duration);
  // timeout for 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 5000));
};
const generateUsers = async (memberCount: number): Promise<string[]> => {
  let users: string[] = []; // Now 'users' is explicitly typed as an array of strings
  let generationCount = 0;
  const batchSize = 100;

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
 * CREATE GROUP WITH GIVEN MEMBERS COUNT PENDING MEMBERS
 * @dev - Added members are pending members
 */
const createGroupWithPendingMembers = async (
  user: PushAPI,
  memberCount: number
): Promise<string> => {
  /**
   * STEP 2: Create Public Group
   */
  console.log('Creating Group with no members');
  const createdGroup = await user.chat.group.create(
    `Benchmark Grp with ${memberCount} members`,
    {
      description: 'benchmark desc',
      image: `benchmark img`,
      members: [],
      admins: [],
      private: false,
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
      membersToBeAdded.push(users[i]);
    }
    await user.chat.group.add(createdGroup.chatId, {
      role: 'MEMBER',
      accounts: membersToBeAdded,
    });
  }
  console.log('Added Members to Group : ', currentMemberCount);
  return createdGroup.chatId;
};
