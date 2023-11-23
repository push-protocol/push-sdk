import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { ethers } from 'ethers';
import Constants from '../../../src/lib/constants';
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';
import { PushAPI } from '../../../src/lib/pushapi/PushAPI'; // Ensure correct import path
import { GroupDTO, MessageWithCID } from '../../../src/lib/types';

const _env = Constants.ENV.DEV;
let groupName: string;
let groupDescription: string;
const groupImage =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==';
const meta = 'Random Group Meta';
let userAlice: PushAPI;
let userBob: PushAPI;
let userJohn: PushAPI;

describe('Private Groups', () => {
  let account1: string;
  let account2: string;
  let account3: string;
  let group: GroupDTO;
  beforeEach(async () => {
    groupName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    });
    groupDescription = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    });

    const WALLET1 = ethers.Wallet.createRandom();
    const signer1 = new ethers.Wallet(WALLET1.privateKey);
    account1 = `eip155:${signer1.address}`;
    userAlice = await PushAPI.initialize(signer1, { env: _env });

    const WALLET2 = ethers.Wallet.createRandom();
    const signer2 = new ethers.Wallet(WALLET2.privateKey);
    account2 = `eip155:${signer2.address}`;
    userBob = await PushAPI.initialize(signer2, { env: _env });

    const WALLET3 = ethers.Wallet.createRandom();
    const signer3 = new ethers.Wallet(WALLET3.privateKey);
    account3 = `eip155:${signer3.address}`;
    userJohn = await PushAPI.initialize(signer3, { env: _env });

    group = await userAlice.chat.group.create(groupName, {
      description: groupDescription,
      image: groupImage,
      members: [],
      admins: [],
      private: true,
    });
  });
  describe('Private Group Session Keys', () => {
    it('Session Key should be null on Group Creation', async () => {
      expect(group.sessionKey).to.be.null;
    });
    it('Session Key should be null on Adding Members', async () => {
      const updatedGroup = await userAlice.chat.group.add(group.chatId, {
        role: 'MEMBER',
        accounts: [account2],
      });
      expect(updatedGroup.sessionKey).to.be.null;
    });
    it('Session Key should be null on Adding Admins', async () => {
      const updatedGroup = await userAlice.chat.group.add(group.chatId, {
        role: 'ADMIN',
        accounts: [account2],
      });
      expect(updatedGroup.sessionKey).to.be.null;
    });
    it('Session Key should be null on Removing Pending Members', async () => {
      // Added Pending Member
      await userAlice.chat.group.add(group.chatId, {
        role: 'MEMBER',
        accounts: [account2],
      });

      const updatedGroup = await userAlice.chat.group.remove(group.chatId, {
        accounts: [account2],
      });
      expect(updatedGroup.sessionKey).to.be.null;
    });
    it('Session Key should be null on Removing Pending Admins', async () => {
      // Added Pending Admin
      await userAlice.chat.group.add(group.chatId, {
        role: 'ADMIN',
        accounts: [account2],
      });

      const updatedGroup = await userAlice.chat.group.remove(group.chatId, {
        accounts: [account2],
      });
      expect(updatedGroup.sessionKey).to.be.null;
    });
    it('Session Key should not be null and should update on Pending Member Approving Intent', async () => {
      // Added Pending Members
      await userAlice.chat.group.add(group.chatId, {
        role: 'MEMBER',
        accounts: [account2, account3],
      });
      const updatedGroup1 = await userBob.chat.group.join(group.chatId);
      expect(updatedGroup1.sessionKey).to.not.be.null;

      const updatedGroup2 = await userJohn.chat.group.join(group.chatId);
      expect(updatedGroup2.sessionKey).to.not.be.null;

      expect(updatedGroup2.sessionKey).to.not.equal(updatedGroup1.sessionKey);
    });
    it('Session Key should not be null and should update on Pending Admin Approving Intent', async () => {
      // Added Pending Admins
      await userAlice.chat.group.add(group.chatId, {
        role: 'ADMIN',
        accounts: [account2, account3],
      });
      const updatedGroup1 = await userBob.chat.group.join(group.chatId);
      expect(updatedGroup1.sessionKey).to.not.be.null;

      const updatedGroup2 = await userJohn.chat.group.join(group.chatId);
      expect(updatedGroup2.sessionKey).to.not.be.null;

      expect(updatedGroup2.sessionKey).to.not.equal(updatedGroup1.sessionKey);
    });
    it('Session Key should not be null and should update on Removing Non-Pending Member', async () => {
      // Added Pending Member
      await userAlice.chat.group.add(group.chatId, {
        role: 'MEMBER',
        accounts: [account2],
      });
      // Accept Invite
      const updatedGroup1 = await userBob.chat.group.join(group.chatId);
      expect(updatedGroup1.sessionKey).to.not.be.null;

      const updatedGroup2 = await userAlice.chat.group.remove(group.chatId, {
        accounts: [account2],
      });
      expect(updatedGroup2.sessionKey).to.not.be.null;

      expect(updatedGroup2.sessionKey).to.not.equal(updatedGroup1.sessionKey);
    });
    it('Session Key should not be null and should update on Removing Non-Pending Admin', async () => {
      // Added Pending Admin
      await userAlice.chat.group.add(group.chatId, {
        role: 'ADMIN',
        accounts: [account2],
      });
      // Accept Invite
      const updatedGroup1 = await userBob.chat.group.join(group.chatId);
      expect(updatedGroup1.sessionKey).to.not.be.null;

      const updatedGroup2 = await userAlice.chat.group.remove(group.chatId, {
        accounts: [account2],
      });
      expect(updatedGroup2.sessionKey).to.not.be.null;

      expect(updatedGroup2.sessionKey).to.not.equal(updatedGroup1.sessionKey);
    });
    it('Session Key should not be null on AutoJoin', async () => {
      const updatedGroup = await userBob.chat.group.join(group.chatId);
      expect(updatedGroup.sessionKey).to.not.be.null;
    });
    it('Session Key should be null on AutoLeave Pending Member', async () => {
      // Added Pending Member
      await userAlice.chat.group.add(group.chatId, {
        role: 'MEMBER',
        accounts: [account2],
      });
      // Reject Invite
      const updatedGroup = await userBob.chat.group.leave(group.chatId);
      expect(updatedGroup.sessionKey).to.be.null;
    });
    it('Session Key should be null on AutoLeave Pending Admin', async () => {
      // Added Pending Admin
      await userAlice.chat.group.add(group.chatId, {
        role: 'ADMIN',
        accounts: [account2],
      });
      // Reject Invite
      const updatedGroup = await userBob.chat.group.leave(group.chatId);
      expect(updatedGroup.sessionKey).to.be.null;
    });
    it('Session Key should not be null on AutoLeave Non-Pending Member', async () => {
      // Added Pending Member
      await userAlice.chat.group.add(group.chatId, {
        role: 'MEMBER',
        accounts: [account2],
      });
      // Accept Invite
      const updatedGroup1 = await userBob.chat.group.join(group.chatId);
      const updatedGroup = await userBob.chat.group.leave(group.chatId);
      expect(updatedGroup.sessionKey).to.not.be.null;
      expect(updatedGroup.sessionKey).to.not.equal(updatedGroup1.sessionKey);
    });
    it('Session Key should not be null on AutoLeave Non-Pending Admin', async () => {
      // Added Pending Admin
      await userAlice.chat.group.add(group.chatId, {
        role: 'ADMIN',
        accounts: [account2],
      });
      // Accept Invite
      const updatedGroup1 = await userBob.chat.group.join(group.chatId);
      const updatedGroup = await userBob.chat.group.leave(group.chatId);
      expect(updatedGroup.sessionKey).to.not.be.null;
      expect(updatedGroup.sessionKey).to.not.equal(updatedGroup1.sessionKey);
    });
    it('Session Key should not change on promotion of Pending member to admin', async () => {
      // Added Pending Member
      const updatedGroup1 = await userAlice.chat.group.add(group.chatId, {
        role: 'MEMBER',
        accounts: [account2],
      });
      // Promote to Admin
      const updatedGroup2 = await userAlice.chat.group.add(group.chatId, {
        role: 'ADMIN',
        accounts: [account2],
      });
      expect(updatedGroup1.sessionKey).to.be.null;
      expect(updatedGroup1.sessionKey).to.equal(updatedGroup2.sessionKey);
    });
    it('Session Key should not change on promotion of Pending admin to member', async () => {
      // Added Pending Member
      const updatedGroup1 = await userAlice.chat.group.add(group.chatId, {
        role: 'ADMIN',
        accounts: [account2],
      });
      // Promote to Admin
      const updatedGroup2 = await userAlice.chat.group.add(group.chatId, {
        role: 'MEMBER',
        accounts: [account2],
      });
      expect(updatedGroup1.sessionKey).to.be.null;
      expect(updatedGroup1.sessionKey).to.equal(updatedGroup2.sessionKey);
    });
    it('Session Key should not change on promotion of Non-Pending member to admin', async () => {
      const updatedGroup1 = await userBob.chat.group.join(group.chatId);
      // Promote to Admin
      const updatedGroup2 = await userAlice.chat.group.add(group.chatId, {
        role: 'ADMIN',
        accounts: [account2],
      });
      expect(updatedGroup1.sessionKey).to.not.be.null;
      expect(updatedGroup1.sessionKey).to.equal(updatedGroup2.sessionKey);
    });
    it('Session Key should not change on promotion of Non-Pending admin to member', async () => {
      // Added Pending Admin
      await userAlice.chat.group.add(group.chatId, {
        role: 'ADMIN',
        accounts: [account2],
      });
      // Accept Invite
      const updatedGroup1 = await userBob.chat.group.join(group.chatId);
      // Promote to Admin
      const updatedGroup2 = await userAlice.chat.group.add(group.chatId, {
        role: 'MEMBER',
        accounts: [account2],
      });
      expect(updatedGroup1.sessionKey).to.not.be.null;
      expect(updatedGroup1.sessionKey).to.equal(updatedGroup2.sessionKey);
    });
  });
  describe('Private Group Send Message Permissions', () => {
    const Content = 'Sending Message to Private Group';
    it('Non-Member should not be able to send messages', async () => {
      await expect(
        userBob.chat.send(group.chatId, {
          content: 'Sending Message to Private Group',
          type: 'Text',
        })
      ).to.be.rejected;
    });
    it('Pending-Member should not be able to send messages', async () => {
      await userAlice.chat.group.add(group.chatId, {
        role: 'MEMBER',
        accounts: [account2],
      });
      await expect(
        userBob.chat.send(group.chatId, {
          content: 'Sending Message to Private Group',
          type: 'Text',
        })
      ).to.be.rejected;
    });
    it('Pending-Admin should not be able to send messages', async () => {
      await userAlice.chat.group.add(group.chatId, {
        role: 'ADMIN',
        accounts: [account2],
      });
      await expect(
        userBob.chat.send(group.chatId, {
          content: 'Sending Message to Private Group',
          type: 'Text',
        })
      ).to.be.rejected;
    });
    it('Pending-Member who left should not be able to send messages', async () => {
      await userAlice.chat.group.add(group.chatId, {
        role: 'MEMBER',
        accounts: [account2],
      });
      await userBob.chat.group.leave(group.chatId);
      await expect(
        userBob.chat.send(group.chatId, {
          content: 'Sending Message to Private Group',
          type: 'Text',
        })
      ).to.be.rejected;
    });
    it('Pending-Admin who left should not be able to send messages', async () => {
      await userAlice.chat.group.add(group.chatId, {
        role: 'MEMBER',
        accounts: [account2],
      });
      await userBob.chat.group.leave(group.chatId);
      await expect(
        userBob.chat.send(group.chatId, {
          content: 'Sending Message to Private Group',
          type: 'Text',
        })
      ).to.be.rejected;
    });
    it('Member who left should not be able to send messages', async () => {
      await userAlice.chat.group.add(group.chatId, {
        role: 'MEMBER',
        accounts: [account2],
      });
      await userBob.chat.group.join(group.chatId);
      await userBob.chat.group.leave(group.chatId);
      await expect(
        userBob.chat.send(group.chatId, {
          content: 'Sending Message to Private Group',
          type: 'Text',
        })
      ).to.be.rejected;
    });
    it('Admin who left should not be able to send messages', async () => {
      await userAlice.chat.group.add(group.chatId, {
        role: 'ADMIN',
        accounts: [account2],
      });
      await userBob.chat.group.join(group.chatId);
      await userBob.chat.group.leave(group.chatId);
      await expect(
        userBob.chat.send(group.chatId, {
          content: 'Sending Message to Private Group',
          type: 'Text',
        })
      ).to.be.rejected;
    });
    it('Member who were removed should not be able to send messages', async () => {
      await userAlice.chat.group.add(group.chatId, {
        role: 'MEMBER',
        accounts: [account2, account3],
      });
      await userBob.chat.group.join(group.chatId);
      await userAlice.chat.group.remove(group.chatId, {
        accounts: [account2, account3],
      });
      await expect(
        userBob.chat.send(group.chatId, {
          content: 'Sending Message to Private Group',
          type: 'Text',
        })
      ).to.be.rejected;
      await expect(
        userJohn.chat.send(group.chatId, {
          content: 'Sending Message to Private Group',
          type: 'Text',
        })
      ).to.be.rejected;
    });
    it('Admin who were removed should not be able to send messages', async () => {
      await userAlice.chat.group.add(group.chatId, {
        role: 'ADMIN',
        accounts: [account2, account3],
      });
      await userBob.chat.group.join(group.chatId);
      await userBob.chat.group.remove(group.chatId, {
        accounts: [account2, account3],
      });
      await expect(
        userBob.chat.send(group.chatId, {
          content: 'Sending Message to Private Group',
          type: 'Text',
        })
      ).to.be.rejected;
      await expect(
        userJohn.chat.send(group.chatId, {
          content: 'Sending Message to Private Group',
          type: 'Text',
        })
      ).to.be.rejected;
    });
    it('Member should be able to send messages', async () => {
      await userBob.chat.group.join(group.chatId);
      const msg = await userBob.chat.send(group.chatId, {
        content: 'Sending Message to Private Group',
        type: 'Text',
      });
    });
    it('Admin should be able to send messages', async () => {
      await userBob.chat.group.join(group.chatId);
      // Promotion
      await userAlice.chat.group.add(group.chatId, {
        role: 'ADMIN',
        accounts: [account2],
      });
      const msg = await userBob.chat.send(group.chatId, {
        content: 'Sending Message to Private Group',
        type: 'Text',
      });
    });
  });
  describe('Private Group Message Encryption', () => {
    const Content = 'Sending Message to Private Group';
    it('Send Message should have pgp encryption on Create Group', async () => {
      await userAlice.chat.send(group.chatId, {
        content: 'Sending Message to Private Group',
        type: 'Text',
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const msg = ((await userAlice.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg, Content, account1, group.chatId, 'pgp', true);

      // Non member should not be able to decrypt
      const msg2 = ((await userBob.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg2, Content, account1, group.chatId, 'pgp', false);
    });
    it('Send Message should have pgpv1:group encryption on new member joining Group', async () => {
      await userAlice.chat.group.add(group.chatId, {
        role: 'MEMBER',
        accounts: [account2],
      });
      await userBob.chat.group.join(group.chatId);

      await userAlice.chat.send(group.chatId, {
        content: 'Sending Message to Private Group',
        type: 'Text',
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const msg = ((await userAlice.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg, Content, account1, group.chatId, 'pgpv1:group', true);

      const msg2 = ((await userBob.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg2, Content, account1, group.chatId, 'pgpv1:group', true);

      const msg3 = ((await userJohn.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg3, Content, account1, group.chatId, 'pgpv1:group', false);
    });
    it('Pending Menbers should not be able to decrypt message', async () => {
      // Added Pending Member
      await userAlice.chat.group.add(group.chatId, {
        role: 'MEMBER',
        accounts: [account2],
      });

      await userAlice.chat.send(group.chatId, {
        content: 'Sending Message to Private Group',
        type: 'Text',
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const msg = ((await userAlice.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg, Content, account1, group.chatId, 'pgp', true);

      const msg2 = ((await userBob.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg2, Content, account1, group.chatId, 'pgp', false);
    });
    it('Pending Admins should not be able to decrypt message', async () => {
      // Added Pending Member
      await userAlice.chat.group.add(group.chatId, {
        role: 'ADMIN',
        accounts: [account2],
      });

      await userAlice.chat.send(group.chatId, {
        content: 'Sending Message to Private Group',
        type: 'Text',
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const msg = ((await userAlice.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg, Content, account1, group.chatId, 'pgp', true);

      const msg2 = ((await userBob.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg2, Content, account1, group.chatId, 'pgp', false);
    });
    it('Pending Menbers who left should not be able to decrypt message', async () => {
      // Added Pending Member
      await userAlice.chat.group.add(group.chatId, {
        role: 'MEMBER',
        accounts: [account2],
      });

      // Reject Intent
      await userBob.chat.group.leave(group.chatId);

      await userAlice.chat.send(group.chatId, {
        content: 'Sending Message to Private Group',
        type: 'Text',
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const msg = ((await userAlice.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg, Content, account1, group.chatId, 'pgp', true);

      const msg2 = ((await userBob.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg2, Content, account1, group.chatId, 'pgp', false);
    });
    it('Pending Admins who left should not be able to decrypt message', async () => {
      // Added Pending Member
      await userAlice.chat.group.add(group.chatId, {
        role: 'ADMIN',
        accounts: [account2],
      });

      await userAlice.chat.group.remove(group.chatId, {
        accounts: [account2],
      });

      await userAlice.chat.send(group.chatId, {
        content: 'Sending Message to Private Group',
        type: 'Text',
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const msg = ((await userAlice.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg, Content, account1, group.chatId, 'pgp', true);

      const msg2 = ((await userBob.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg2, Content, account1, group.chatId, 'pgp', false);
    });
    it('Pending Menbers who were removed should not be able to decrypt message', async () => {
      // Added Pending Member
      await userAlice.chat.group.add(group.chatId, {
        role: 'MEMBER',
        accounts: [account2],
      });

      await userAlice.chat.group.remove(group.chatId, {
        accounts: [account2],
      });

      await userAlice.chat.send(group.chatId, {
        content: 'Sending Message to Private Group',
        type: 'Text',
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const msg = ((await userAlice.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg, Content, account1, group.chatId, 'pgp', true);

      const msg2 = ((await userBob.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg2, Content, account1, group.chatId, 'pgp', false);
    });
    it('Pending Admins who were removed should not be able to decrypt message', async () => {
      // Added Pending Member
      await userAlice.chat.group.add(group.chatId, {
        role: 'ADMIN',
        accounts: [account2],
      });

      await userAlice.chat.group.remove(group.chatId, {
        accounts: [account2],
      });

      await userAlice.chat.send(group.chatId, {
        content: 'Sending Message to Private Group',
        type: 'Text',
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const msg = ((await userAlice.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg, Content, account1, group.chatId, 'pgp', true);

      const msg2 = ((await userBob.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg2, Content, account1, group.chatId, 'pgp', false);
    });
    it('Non-Pending Menbers should be able to decrypt message', async () => {
      // Added Pending Member
      await userAlice.chat.group.add(group.chatId, {
        role: 'MEMBER',
        accounts: [account2],
      });

      // Accept Intent
      await userBob.chat.group.join(group.chatId);

      await userAlice.chat.send(group.chatId, {
        content: 'Sending Message to Private Group',
        type: 'Text',
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const msg = ((await userAlice.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg, Content, account1, group.chatId, 'pgpv1:group', true);

      const msg2 = ((await userBob.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg2, Content, account1, group.chatId, 'pgpv1:group', true);

      const msg3 = ((await userJohn.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg3, Content, account1, group.chatId, 'pgpv1:group', false);
    });
    it('Non-Pending Admins should be able to decrypt message', async () => {
      // Added Pending Member
      await userAlice.chat.group.add(group.chatId, {
        role: 'ADMIN',
        accounts: [account2],
      });

      // Accept Intent
      await userBob.chat.group.join(group.chatId);

      await userAlice.chat.send(group.chatId, {
        content: 'Sending Message to Private Group',
        type: 'Text',
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const msg = ((await userAlice.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg, Content, account1, group.chatId, 'pgpv1:group', true);

      const msg2 = ((await userBob.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg2, Content, account1, group.chatId, 'pgpv1:group', true);

      const msg3 = ((await userJohn.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg3, Content, account1, group.chatId, 'pgpv1:group', false);
    });
    it('Non-Pending Menbers who left should not be able to decrypt message', async () => {
      // Added Pending Member
      await userAlice.chat.group.add(group.chatId, {
        role: 'MEMBER',
        accounts: [account2],
      });

      // Accept Intent
      await userBob.chat.group.join(group.chatId);
      // Leave Group
      await userBob.chat.group.leave(group.chatId);

      await userAlice.chat.send(group.chatId, {
        content: 'Sending Message to Private Group',
        type: 'Text',
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const msg = ((await userAlice.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg, Content, account1, group.chatId, 'pgpv1:group', true);

      const msg2 = ((await userBob.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg2, Content, account1, group.chatId, 'pgpv1:group', false);
    });
    it('Non-Pending Admins who left should not be able to decrypt message', async () => {
      // Added Pending Member
      await userAlice.chat.group.add(group.chatId, {
        role: 'ADMIN',
        accounts: [account2],
      });

      // Accept Intent
      await userBob.chat.group.join(group.chatId);
      // Leave Group
      await userBob.chat.group.leave(group.chatId);

      await userAlice.chat.send(group.chatId, {
        content: 'Sending Message to Private Group',
        type: 'Text',
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const msg = ((await userAlice.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg, Content, account1, group.chatId, 'pgpv1:group', true);

      const msg2 = ((await userBob.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg2, Content, account1, group.chatId, 'pgpv1:group', false);
    });
    it('Non-Pending Menbers who were removed should not be able to decrypt message', async () => {
      // Added Pending Member
      await userAlice.chat.group.add(group.chatId, {
        role: 'MEMBER',
        accounts: [account2],
      });

      // Accept Intent
      await userBob.chat.group.join(group.chatId);

      await userAlice.chat.group.remove(group.chatId, {
        accounts: [account2],
      });

      await userAlice.chat.send(group.chatId, {
        content: 'Sending Message to Private Group',
        type: 'Text',
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const msg = ((await userAlice.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg, Content, account1, group.chatId, 'pgpv1:group', true);

      const msg2 = ((await userBob.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg2, Content, account1, group.chatId, 'pgpv1:group', false);
    });
    it('Non-Pending Admins who were removed should not be able to decrypt message', async () => {
      // Added Pending Member
      await userAlice.chat.group.add(group.chatId, {
        role: 'ADMIN',
        accounts: [account2],
      });

      // Accept Intent
      await userBob.chat.group.join(group.chatId);
      await userAlice.chat.group.remove(group.chatId, {
        accounts: [account2],
      });

      await userAlice.chat.send(group.chatId, {
        content: 'Sending Message to Private Group',
        type: 'Text',
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const msg = ((await userAlice.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg, Content, account1, group.chatId, 'pgpv1:group', true);

      const msg2 = ((await userBob.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg2, Content, account1, group.chatId, 'pgpv1:group', false);
    });
    it('Autojoin Members should be able to decrypt message', async () => {
      // Autojoin
      await userBob.chat.group.join(group.chatId);

      await userAlice.chat.send(group.chatId, {
        content: 'Sending Message to Private Group',
        type: 'Text',
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const msg = ((await userAlice.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg, Content, account1, group.chatId, 'pgpv1:group', true);

      const msg2 = ((await userBob.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg2, Content, account1, group.chatId, 'pgpv1:group', true);
    });
    it('Autojoin Members who left should not be able to decrypt message', async () => {
      // Autojoin
      await userBob.chat.group.join(group.chatId);
      // Leave
      await userBob.chat.group.leave(group.chatId);

      await userAlice.chat.send(group.chatId, {
        content: 'Sending Message to Private Group',
        type: 'Text',
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const msg = ((await userAlice.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg, Content, account1, group.chatId, 'pgpv1:group', true);

      const msg2 = ((await userBob.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg2, Content, account1, group.chatId, 'pgpv1:group', false);
    });
    it('Autojoin Members who were removed should not be able to decrypt message', async () => {
      // Autojoin
      await userBob.chat.group.join(group.chatId);
      await userAlice.chat.group.remove(group.chatId, {
        accounts: [account2],
      });

      await userAlice.chat.send(group.chatId, {
        content: 'Sending Message to Private Group',
        type: 'Text',
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const msg = ((await userAlice.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg, Content, account1, group.chatId, 'pgpv1:group', true);

      const msg2 = ((await userBob.chat.latest(group.chatId)) as any)[0];
      expectMsg(msg2, Content, account1, group.chatId, 'pgpv1:group', false);
    });
  });
});

/**
 * HELPER FUNCTION
 */
const expectMsg = (
  msg: MessageWithCID,
  expectedContent: string | { [key: string]: any },
  expectedSender: string,
  expectedReceiver: string,
  expectedEncType: 'pgp' | 'pgpv1:group',
  ableToDecrypt: boolean
): void => {
  expect(msg.fromDID).to.include(expectedSender);
  expect(msg.fromCAIP10).to.include(expectedSender);
  expect(msg.toDID).to.include(expectedReceiver);
  expect(msg.toCAIP10).to.include(expectedReceiver);
  expect(msg.messageType).to.equal('Text');
  expect(msg.verificationProof?.split(':')[0]).to.equal('pgpv3');
  //Backward Compatibility check
  expect(msg.sigType).to.equal(msg.verificationProof?.split(':')[0]);
  //Backward Compatibility check ( signature signs messageContent and will be diff from vProof )
  expect(msg.signature).not.to.equal(msg.verificationProof?.split(':')[1]);
  expect(msg.encType).to.equal(expectedEncType);
  if (expectedEncType === 'pgpv1:group') {
    expect(msg.encryptedSecret).to.be.null;
  } else {
    expect(msg.encryptedSecret).not.to.be.null;
  }
  if (ableToDecrypt) {
    expect((msg.messageObj as { content: string }).content).to.be.equal(
      expectedContent
    );
  } else {
    expect(msg.messageObj).to.be.equal('Unable to Decrypt Message');
  }
};
