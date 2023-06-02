import { isValidETHAddress, walletToPCAIP10 } from '../../helpers';
import { IConnectedUser, GroupDTO, SpaceDTO, ChatStatus } from '../../types';
import { getEncryptedRequest } from './crypto';
import { getGroup } from '../getGroup';
import { ENV } from '../../constants';

export interface ISendMessagePayload {
  fromDID: string;
  toDID: string;
  fromCAIP10: string;
  toCAIP10: string;
  messageContent: string;
  messageType: string;
  signature: string | null | undefined;
  encType: string;
  encryptedSecret: string | null | undefined;
  sigType: string | null | undefined;
  verificationProof?: string | null | undefined;
}

export interface IApproveRequestPayload {
  fromDID: string;
  toDID: string;
  signature: string;
  status: 'Approved';
  sigType: string;
  verificationProof?: string | null | undefined;
}

export interface ICreateGroupRequestPayload {
  groupName: string;
  groupDescription: string | null;
  members: Array<string>;
  groupImage: string | null;
  admins: Array<string>;
  isPublic: boolean;
  contractAddressNFT?: string;
  numberOfNFTs?: number;
  contractAddressERC20?: string;
  numberOfERC20?: number;
  groupCreator: string;
  verificationProof: string;
  meta?: string;
}

export interface IUpdateGroupRequestPayload {
  groupName: string;
  groupImage: string | null;
  members: Array<string>;
  admins: Array<string>;
  address: string;
  verificationProof: string;
}

export const sendMessagePayload = async (
  receiverAddress: string,
  senderCreatedUser: IConnectedUser,
  messageContent: string,
  messageType: string,
  env: ENV
): Promise<ISendMessagePayload> => {
  let isGroup = true;
  if (isValidETHAddress(receiverAddress)) {
    isGroup = false;
  }

  let group: GroupDTO | null = null;

  if (isGroup) {
    group = await getGroup({
      chatId: receiverAddress,
      env: env,
    });

    if (!group) {
      throw new Error(`Group not found!`);
    }
  }

  const { message, encryptionType, aesEncryptedSecret, signature } =
    (await getEncryptedRequest(
      receiverAddress,
      senderCreatedUser,
      messageContent,
      isGroup,
      env,
      group
    )) || {};

  const body: ISendMessagePayload = {
    fromDID: walletToPCAIP10(senderCreatedUser.wallets.split(',')[0]),
    toDID: isGroup ? receiverAddress : walletToPCAIP10(receiverAddress),
    fromCAIP10: walletToPCAIP10(senderCreatedUser.wallets.split(',')[0]),
    toCAIP10: isGroup ? receiverAddress : walletToPCAIP10(receiverAddress),
    messageContent: message!,
    messageType,
    signature: signature!,
    encType: encryptionType!,
    encryptedSecret: aesEncryptedSecret!,
    sigType: 'pgp',
  };
  return body;
};

export const approveRequestPayload = (
  fromDID: string,
  toDID: string,
  status: 'Approved',
  sigType: string,
  signature: string
): IApproveRequestPayload => {
  const body = {
    fromDID,
    toDID,
    signature,
    status,
    sigType,
    verificationProof: sigType + ':' + signature,
  };
  return body;
};

export const createGroupPayload = (
  groupName: string,
  groupDescription: string | null,
  members: Array<string>,
  groupImage: string | null,
  admins: Array<string>,
  isPublic: boolean,
  groupCreator: string,
  verificationProof: string,
  contractAddressNFT?: string,
  numberOfNFTs?: number,
  contractAddressERC20?: string,
  numberOfERC20?: number,
  meta?: string,
  groupType? : string | null,
  scheduleAt?: Date | null,
  scheduleEnd?: Date | null
): ICreateGroupRequestPayload => {
  const body = {
    groupName: groupName,
    groupDescription: groupDescription,
    members: members,
    groupImage: groupImage,
    admins: admins,
    isPublic: isPublic,
    contractAddressNFT: contractAddressNFT,
    numberOfNFTs: numberOfNFTs,
    contractAddressERC20: contractAddressERC20,
    numberOfERC20: numberOfERC20,
    groupCreator: groupCreator,
    verificationProof: verificationProof,
    meta: meta,
    groupType: groupType,
    scheduleAt: scheduleAt,
    scheduleEnd: scheduleEnd
  };
  return body;
};

export const groupDtoToSpaceDto = (groupDto: GroupDTO): SpaceDTO => {
  const spaceDto: SpaceDTO = {
    members: groupDto.members,
    pendingMembers: groupDto.pendingMembers,
    contractAddressERC20: groupDto.contractAddressERC20,
    numberOfERC20: groupDto.numberOfERC20,
    contractAddressNFT: groupDto.contractAddressNFT,
    numberOfNFTTokens: groupDto.numberOfNFTTokens,
    verificationProof: groupDto.verificationProof,
    spaceImage: groupDto.groupImage,
    spaceName: groupDto.groupName,
    isPublic: groupDto.isPublic,
    spaceDescription: groupDto.groupDescription,
    spaceCreator: groupDto.groupCreator,
    spaceId: groupDto.chatId,
    scheduleAt: groupDto.scheduleAt,
    scheduleEnd: groupDto.scheduleEnd,
    status: groupDto.status ?? null
  };
  return spaceDto;
};

export const updateGroupPayload = (
  groupName: string,
  groupImage: string | null,
  groupDescription: string | null,
  members: Array<string>,
  admins: Array<string>,
  address: string,
  verificationProof: string,
  scheduleAt?: Date | null,
  scheduleEnd?: Date | null,
  status?: ChatStatus | null
): IUpdateGroupRequestPayload => {
  const body = {
    groupName: groupName,
    groupImage: groupImage,
    groupDescription: groupDescription,
    members: members,
    admins: admins,
    address: address,
    verificationProof: verificationProof,
    scheduleAt: scheduleAt,
    scheduleEnd: scheduleEnd,
    status: status
  };
  return body;
};

// helper.ts

export const getAdminsList = (
  members: {
    wallet: string;
    publicKey: string;
    isAdmin: boolean;
    image: string;
  }[],
  pendingMembers: {
    wallet: string;
    publicKey: string;
    isAdmin: boolean;
    image: string;
  }[]
): Array<string> => {
  const adminsFromMembers = members
    ? convertToWalletAddressList(members.filter((admin) => admin.isAdmin))
    : [];

  const adminsFromPendingMembers = pendingMembers
    ? convertToWalletAddressList(pendingMembers.filter((admin) => admin.isAdmin))
    : [];

  const adminList = [...adminsFromMembers, ...adminsFromPendingMembers];
  return adminList;
};

export const convertToWalletAddressList = (memberList: { wallet: string }[]): string[] => {
  return memberList ? memberList.map((member) => member.wallet) : [];
};

export const getMembersList = (
  members: {
    wallet: string;
    publicKey: string;
    isAdmin: boolean;
    image: string;
  }[],
  pendingMembers: {
    wallet: string;
    publicKey: string;
    isAdmin: boolean;
    image: string;
  }[]
): Array<string> => {
  const allMembers = [...(members || []), ...(pendingMembers || [])];
  return convertToWalletAddressList(allMembers);
};