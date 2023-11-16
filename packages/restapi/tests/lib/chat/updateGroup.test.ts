import { expect } from 'chai';
import { ethers } from 'ethers';
import CONSTANTS from '../../../src/lib/constantsV2';
import {
  createGroup,
  updateGroup,
  removeMembers,
  getGroup,
} from '../../../src/lib/chat';
import { GroupDTO } from '../../../src/lib/types';
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';
const _env = CONSTANTS.ENV.DEV;
let account: string;
let signer: any;
let account2: string;
let signer2: any;
let groupName: string;
let groupDescription: string;
const groupImage =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==';
const meta = 'Random Group Meta';

describe('Update Group', () => {
  beforeEach(() => {
    const WALLET1 = ethers.Wallet.createRandom();
    signer = new ethers.Wallet(WALLET1.privateKey);
    account = `eip155:${signer.address}`;

    const WALLET2 = ethers.Wallet.createRandom();
    signer2 = new ethers.Wallet(WALLET2.privateKey);
    account2 = `eip155:${signer2.address}`;

    groupName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    });
    groupDescription = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    });
  });
  it('Add Meta Property', async () => {
    const admins: string[] = [];
    const members = [
      'eip155:0x736Cd8461132a1B52d95D535230ca4cd4C8bD7e5',
      'eip155:0xDB0Bb1C25e36a5Ec9d199688bB01eADa4e70225E',
    ];
    const group = await createGroup({
      groupName,
      groupDescription,
      members,
      groupImage,
      admins,
      isPublic: true,
      signer,
      env: _env,
    });
    const updatedGroup = await updateGroup({
      groupName,
      groupDescription,
      members: [account, ...members],
      groupImage,
      admins: [account],
      chatId: group.chatId,
      signer,
      env: _env,
      meta,
    });
    await expectGroup(updatedGroup, true, admins, members, true);
  });
  it('Remove Meta Property', async () => {
    const admins: string[] = [];
    const members = [
      'eip155:0x736Cd8461132a1B52d95D535230ca4cd4C8bD7e5',
      'eip155:0xDB0Bb1C25e36a5Ec9d199688bB01eADa4e70225E',
    ];
    const group = await createGroup({
      groupName,
      groupDescription,
      members,
      groupImage,
      admins,
      isPublic: true,
      signer,
      env: _env,
      meta,
    });
    const updatedGroup = await updateGroup({
      groupName,
      groupDescription,
      members: [account, ...members],
      groupImage,
      admins: [account],
      chatId: group.chatId,
      signer,
      env: _env,
      meta: null,
    });
    await expectGroup(updatedGroup, true, admins, members, false);
  });
  it('Unchanged Meta Property', async () => {
    const admins: string[] = [];
    const members = [
      'eip155:0x736Cd8461132a1B52d95D535230ca4cd4C8bD7e5',
      'eip155:0xDB0Bb1C25e36a5Ec9d199688bB01eADa4e70225E',
    ];
    const group = await createGroup({
      groupName,
      groupDescription,
      members,
      groupImage,
      admins,
      isPublic: true,
      signer,
      env: _env,
      meta,
    });
    groupDescription = 'New Grp Desc';
    const updatedGroup = await updateGroup({
      groupName,
      groupDescription,
      members: [account, ...members],
      groupImage,
      admins: [account],
      chatId: group.chatId,
      signer,
      env: _env,
    });
    await expectGroup(updatedGroup, true, admins, members, true);
  });

  it('AutoLeave', async () => {
    const admins: string[] = [];
    const members = [
      account2,
      'eip155:0xDB0Bb1C25e36a5Ec9d199688bB01eADa4e70225E',
    ];
    // creator - account
    const group = await createGroup({
      groupName,
      groupDescription,
      members,
      groupImage,
      admins,
      isPublic: true,
      signer, //acount
      env: _env,
    });

    const updatedMembers = [
      'eip155:0xDB0Bb1C25e36a5Ec9d199688bB01eADa4e70225E',
    ];
    const updatedGroup = await removeMembers({
      members: [account2], // account to be removed
      chatId: group.chatId,
      signer: signer2, //acount2
      env: _env,
    });
    await expectGroup(updatedGroup, true, admins, updatedMembers, false);
  });
});

/**
 * HELPER FUNCTIONS
 */
const expectGroup = async (
  group: GroupDTO,
  isPublic: boolean,
  admins: string[],
  pendingMembers: string[],
  HasMeta: boolean
) => {
  expect(group).to.exist;
  expect(group.members).to.be.an('array');
  expect(group.members.length).to.equal(1);
  expect(group.members[0].wallet).to.equal(account);
  expect(group.members[0].isAdmin).to.be.true;
  expect(group.members[0].image).to.be.a('string');
  expect(group.pendingMembers).to.be.an('array');
  expect(group.pendingMembers.length).to.equal(pendingMembers.length);
  for (let i = 0; i < pendingMembers.length; i++) {
    expect(pendingMembers.includes(group.pendingMembers[i].wallet)).to.be.true;
  }
  expect(group.groupImage).to.equal(groupImage);
  expect(group.groupName).to.equal(groupName);
  expect(group.groupDescription).to.equal(groupDescription);
  expect(group.isPublic).to.equal(isPublic);
  expect(group.groupCreator).to.equal(account);
  expect(group.chatId).to.be.a('string');
  expect(group.scheduleAt).to.be.null;
  expect(group.scheduleEnd).to.be.null;
  expect(group.groupType).to.equal('default');
  expect((group as any).status).to.be.null;
  if (!HasMeta) {
    expect((group as any).meta).to.be.null;
  } else {
    expect((group as any).meta).to.equal(meta);
  }
};
