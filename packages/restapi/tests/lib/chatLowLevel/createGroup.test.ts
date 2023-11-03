import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { ethers } from 'ethers';
import Constants from '../../../src/lib/constants';
import { createGroup } from '../../../src/lib/chat';
import { GroupDTO } from '../../../src/lib/types';
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';
const _env = Constants.ENV.DEV;
let account: string;
let signer: any;
let groupName: string;
let groupDescription: string;
const groupImage =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==';
const meta = 'Random Group Meta';

describe('Create Group', () => {
  beforeEach(() => {
    const WALLET1 = ethers.Wallet.createRandom();
    signer = new ethers.Wallet(WALLET1.privateKey);
    account = `eip155:${signer.address}`;

    groupName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    });
    groupDescription = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    });
  });
  it('View Control - Public | Meta Property', async () => {
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
    await expectGroup(group, true, admins, members, true);
  });
  it('View Control - Public | Without Meta Property', async () => {
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
    await expectGroup(group, true, admins, members, false);
  });
  it('View Control - Private | Meta Property', async () => {
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
      isPublic: false,
      signer,
      env: _env,
      meta,
    });
    await expectGroup(group, false, admins, members, true);
  });
  it('View Control - Private | Without Meta Property', async () => {
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
      isPublic: false,
      signer,
      env: _env,
    });
    await expectGroup(group, false, admins, members, false);
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
  expect(pendingMembers.includes(group.pendingMembers[0].wallet)).to.be.true;
  expect(pendingMembers.includes(group.pendingMembers[1].wallet)).to.be.true;
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
  expect((group as any).eventType).to.equal('create');
  if (!HasMeta) {
    expect((group as any).meta).to.be.null;
  } else {
    expect((group as any).meta).to.equal(meta);
  }
};
