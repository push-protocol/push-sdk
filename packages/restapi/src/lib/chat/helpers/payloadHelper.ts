import { isValidETHAddress, walletToPCAIP10 } from '../../helpers';
import { getEncryptedRequestCore } from './crypto';
import {
  IConnectedUser,
  GroupDTO,
  SpaceDTO,
  ChatStatus,
  Rules,
  SpaceRules,
  GroupAccess,
  SpaceAccess,
  GroupInfoDTO,
} from '../../types';
import { getEncryptedRequest } from './crypto';
import { ENV } from '../../constants';
import { IPGPHelper, PGPHelper, pgpDecrypt } from './pgp';
import * as AES from './aes';
import { sign } from './pgp';
import { MessageObj } from '../../types/messageTypes';

import * as CryptoJS from 'crypto-js';
export interface ISendMessagePayload {
  fromDID: string;
  toDID: string;
  fromCAIP10: string;
  toCAIP10: string;
  messageObj: MessageObj | string;
  messageType: string;
  encType: string;
  encryptedSecret: string | null | undefined;
  sessionKey: string | null | undefined;
  verificationProof?: string;
  /**
   * @deprecated - Use messageObj instead
   */
  messageContent: string;
  /**
   * @deprecated - Use messageObj instead
   */
  signature: string | null | undefined;
  /**
   * @deprecated - Use messageObj instead
   */
  sigType: string | null | undefined;
}

export interface IRejectRequestPayload {
  fromDID: string;
  toDID: string;
  verificationProof?: string | null | undefined;
}

export interface ICreateGroupRequestPayload {
  groupName: string;
  groupDescription?: string | null;
  members: Array<string>;
  groupImage?: string | null;
  admins: Array<string>;
  isPublic: boolean;
  contractAddressNFT?: string;
  numberOfNFTs?: number;
  contractAddressERC20?: string;
  numberOfERC20?: number;
  groupCreator: string;
  verificationProof: string;
  meta?: string;
  rules?: Rules | null;
}

export interface IUpdateGroupRequestPayload {
  groupName: string;
  groupImage?: string | null;
  members: Array<string>;
  admins: Array<string>;
  address: string;
  verificationProof: string;
  sessionKey: string | null;
  encryptedSecret: string | null;
}

export const sendMessagePayload = async (
  receiverAddress: string,
  senderCreatedUser: IConnectedUser,
  messageObj: MessageObj,
  messageContent: string,
  messageType: string,
  group: GroupInfoDTO | null,
  env: ENV
): Promise<ISendMessagePayload> => {
  return await sendMessagePayloadCore(
    receiverAddress,
    senderCreatedUser,
    messageObj,
    messageContent,
    messageType,
    group,
    env,
    PGPHelper
  );
};

export const sendMessagePayloadCore = async (
  receiverAddress: string,
  senderCreatedUser: IConnectedUser,
  messageObj: MessageObj | string,
  messageContent: string,
  messageType: string,
  group: GroupInfoDTO | null,
  env: ENV,
  pgpHelper: IPGPHelper
): Promise<ISendMessagePayload> => {
  const isGroup = !isValidETHAddress(receiverAddress);

  let secretKey: string;
  if (isGroup && group?.encryptedSecret && group.sessionKey) {
    secretKey = await pgpDecrypt({
      cipherText: group.encryptedSecret,
      toPrivateKeyArmored: senderCreatedUser.privateKey!,
    });
  } else {
    secretKey = AES.generateRandomSecret(15);
  }
  const { message: encryptedMessageContent, signature: deprecatedSignature } =
    await getEncryptedRequestCore(
      receiverAddress,
      senderCreatedUser,
      messageContent,
      isGroup,
      env,
      group,
      secretKey,
      pgpHelper
    );
  const {
    message: encryptedMessageObj,
    encryptionType,
    aesEncryptedSecret,
  } = await getEncryptedRequestCore(
    receiverAddress,
    senderCreatedUser,
    JSON.stringify(messageObj),
    isGroup,
    env,
    group,
    secretKey,
    pgpHelper
  );

  const body: ISendMessagePayload = {
    fromDID: walletToPCAIP10(senderCreatedUser.wallets.split(',')[0]),
    toDID: isGroup ? receiverAddress : walletToPCAIP10(receiverAddress),
    fromCAIP10: walletToPCAIP10(senderCreatedUser.wallets.split(',')[0]),
    toCAIP10: isGroup ? receiverAddress : walletToPCAIP10(receiverAddress),
    messageType,
    messageObj:
      encryptionType === 'PlainText' ? messageObj : encryptedMessageObj,
    encType: encryptionType!,
    sessionKey:
      group && !group.isPublic && encryptionType === 'pgpv1:group'
        ? group.sessionKey
        : null,
    encryptedSecret: aesEncryptedSecret!,
    messageContent: encryptedMessageContent,
    signature: deprecatedSignature, //for backward compatibility
    sigType: 'pgpv3',
  };

  //build verificationProof
  const bodyToBeHashed = {
    fromDID: body.fromDID,
    toDID: body.fromDID,
    fromCAIP10: body.fromCAIP10,
    toCAIP10: body.toCAIP10,
    messageObj: body.messageObj,
    messageType: body.messageType,
    encType: body.encType,
    sessionKey: body.sessionKey,
    encryptedSecret: body.encryptedSecret,
  };
  const hash = CryptoJS.SHA256(JSON.stringify(bodyToBeHashed)).toString();
  const signature: string = await pgpHelper.sign({
    message: hash,
    signingKey: senderCreatedUser.privateKey!,
  });
  body.verificationProof = `pgpv3:${signature}`;
  return body;
};

export const rejectRequestPayload = (
  fromDID: string,
  toDID: string,
  sigType: string,
  signature: string
): IRejectRequestPayload => {
  const body = {
    fromDID,
    toDID,
    verificationProof: sigType + ':' + signature,
  };
  return body;
};

export const createGroupPayload = (
  groupName: string,
  members: Array<string>,
  admins: Array<string>,
  isPublic: boolean,
  groupCreator: string,
  verificationProof: string,
  groupDescription?: string | null,
  groupImage?: string | null,
  contractAddressNFT?: string,
  numberOfNFTs?: number,
  contractAddressERC20?: string,
  numberOfERC20?: number,
  meta?: string,
  groupType?: string | null,
  scheduleAt?: Date | null,
  scheduleEnd?: Date | null,
  rules?: Rules | null
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
    scheduleEnd: scheduleEnd,
    rules: rules,
  };
  return body;
};

export const groupDtoToSpaceDto = (groupDto: GroupDTO): SpaceDTO => {
  const spaceDto: SpaceDTO = {
    members: groupDto.members.map((member) => ({
      wallet: member.wallet,
      publicKey: member.publicKey,
      isSpeaker: member.isAdmin,
      image: member.image,
    })),
    pendingMembers: groupDto.pendingMembers.map((pendingMember) => ({
      wallet: pendingMember.wallet,
      publicKey: pendingMember.publicKey,
      isSpeaker: pendingMember.isAdmin,
      image: pendingMember.image,
    })),
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
    status: groupDto.status ?? null,
    meta: groupDto.meta,
  };

  if (groupDto.rules) {
    spaceDto.rules = {
      entry: groupDto.rules.entry,
    };
  }

  return spaceDto;
};

export const convertSpaceRulesToRules = (spaceRules: SpaceRules): Rules => {
  return {
    entry: spaceRules.entry,
    chat: undefined,
  };
};

export const convertRulesToSpaceRules = (rules: Rules): SpaceRules => {
  return {
    entry: rules.entry,
  };
};

export const groupAccessToSpaceAccess = (group: GroupAccess): SpaceAccess => {
  const spaceAccess: SpaceAccess = {
    entry: group.entry,
  };

  // If rules are present in the entry, map them to the spaceAccess
  if (group.rules) {
    spaceAccess.rules = convertRulesToSpaceRules(group.rules);
  }

  return spaceAccess;
};

export const updateGroupPayload = (
  groupName: string,
  members: Array<string>,
  admins: Array<string>,
  address: string,
  verificationProof: string,
  sessionKey: string | null,
  encryptedSecret: string | null,
  groupDescription?: string | null,
  groupImage?: string | null,
  scheduleAt?: Date | null,
  scheduleEnd?: Date | null,
  status?: ChatStatus | null,
  meta?: string | null,
  rules?: Rules | null
): IUpdateGroupRequestPayload => {
  const body = {
    groupName: groupName,
    groupImage: groupImage,
    groupDescription: groupDescription,
    members: members,
    admins: admins,
    address: address,
    verificationProof: verificationProof,
    sessionKey: sessionKey,
    encryptedSecret: encryptedSecret,
    scheduleAt: scheduleAt,
    scheduleEnd: scheduleEnd,
    status: status,
    ...(meta !== undefined && { meta: meta }),
    ...(rules !== undefined && { rules: rules }),
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
    ? convertToWalletAddressList(
        pendingMembers.filter((admin) => admin.isAdmin)
      )
    : [];

  const adminList = [...adminsFromMembers, ...adminsFromPendingMembers];
  return adminList;
};

export const getSpaceAdminsList = (
  members: {
    wallet: string;
    publicKey: string;
    isSpeaker: boolean;
    image: string;
  }[],
  pendingMembers: {
    wallet: string;
    publicKey: string;
    isSpeaker: boolean;
    image: string;
  }[]
): Array<string> => {
  const adminsFromMembers = members
    ? convertToWalletAddressList(members.filter((admin) => admin.isSpeaker))
    : [];

  const adminsFromPendingMembers = pendingMembers
    ? convertToWalletAddressList(
        pendingMembers.filter((admin) => admin.isSpeaker)
      )
    : [];

  const adminList = [...adminsFromMembers, ...adminsFromPendingMembers];
  return adminList;
};

export const convertToWalletAddressList = (
  memberList: { wallet: string }[]
): string[] => {
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

export const getSpacesMembersList = (
  members: {
    wallet: string;
    publicKey: string;
    isSpeaker: boolean;
    image: string;
  }[],
  pendingMembers: {
    wallet: string;
    publicKey: string;
    isSpeaker: boolean;
    image: string;
  }[]
): Array<string> => {
  const allMembers = [...(members || []), ...(pendingMembers || [])];
  return convertToWalletAddressList(allMembers);
};
