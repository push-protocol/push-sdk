import { isValidETHAddress, walletToPCAIP10 } from '../../helpers';
import { IConnectedUser, GroupDTO, SpaceDTO, ChatStatus } from '../../types';
import { getEncryptedRequest } from './crypto';
import Constants, { ENV } from '../../constants';
import * as AES from './aes';
import { META_MESSAGE_META } from '../../types/metaTypes';
import { pgpDecrypt, sign } from './pgp';
import * as CryptoJS from 'crypto-js';
export interface ISendMessagePayload {
  fromDID: string;
  toDID: string;
  fromCAIP10: string;
  toCAIP10: string;
  messageObj:
    | {
        content: string;
        meta?: META_MESSAGE_META;
      }
    | string;
  messageType: string;
  encType: string;
  encryptedSecret: string | null | undefined;
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
  sessionKey?: string | null;
}

export interface IApproveRequestPayload {
  fromDID: string;
  toDID: string;
  signature: string;
  status: 'Approved';
  sigType: string;
  verificationProof?: string | null | undefined;
  sessionKey?: string | null;
  encryptedSecret?: string | null;
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
  sessionKey: string | null;
  encryptedSecret: string | null;
}

export const sendMessagePayload = async (
  receiverAddress: string,
  senderCreatedUser: IConnectedUser,
  messageObj: {
    content: string;
    meta?: META_MESSAGE_META;
  },
  messageContent: string,
  messageType: string,
  group: GroupDTO | null,
  env: ENV
): Promise<ISendMessagePayload> => {
  const isGroup = !isValidETHAddress(receiverAddress);
  let secretKey: string;
  let newGroupEncryption = false;
  if (
    isGroup &&
    !group!.isPublic &&
    group!.members!.length > Constants.MAX_GROUP_MEMBERS_PRIVATE
  ) {
    const encryptedSecret = group!.encryptedSecret!;
    secretKey = await pgpDecrypt({
      cipherText: encryptedSecret,
      toPrivateKeyArmored: senderCreatedUser.privateKey!,
    });
    newGroupEncryption = true;
  } else {
    secretKey = AES.generateRandomSecret(15);
  }

  const { message: encryptedMessageContent, signature: deprecatedSignature } =
    await getEncryptedRequest(
      receiverAddress,
      senderCreatedUser,
      messageContent,
      isGroup,
      env,
      group,
      secretKey,
      newGroupEncryption
    );
  const {
    message: encryptedMessageObj,
    encryptionType,
    aesEncryptedSecret,
  } = await getEncryptedRequest(
    receiverAddress,
    senderCreatedUser,
    JSON.stringify(messageObj),
    isGroup,
    env,
    group,
    secretKey,
    newGroupEncryption
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
    encryptedSecret: newGroupEncryption ? null : aesEncryptedSecret!,
    messageContent: encryptedMessageContent,
    signature: deprecatedSignature, //for backward compatibility
    sigType: 'pgpv2',
    sessionKey: group?.sessionKey,
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
    encryptedSecret: body.encryptedSecret,
  };
  const hash = CryptoJS.SHA256(JSON.stringify(bodyToBeHashed)).toString();
  const signature: string = await sign({
    message: hash,
    signingKey: senderCreatedUser.privateKey!,
  });
  body.verificationProof = `pgpv2:${signature}`;
  return body;
};

export const approveRequestPayload = (
  fromDID: string,
  toDID: string,
  status: 'Approved',
  sigType: string,
  signature: string,
  sessionKey: string | null = null,
  encryptedSecret: string | null = null
): IApproveRequestPayload => {
  const body = {
    fromDID,
    toDID,
    signature,
    status,
    sigType,
    sessionKey,
    encryptedSecret,
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
  groupType?: string | null,
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
    scheduleEnd: scheduleEnd,
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
  sessionKey: string | null,
  encryptedSecret: string | null,
  scheduleAt?: Date | null,
  scheduleEnd?: Date | null,
  status?: ChatStatus | null,
  meta?: string | null
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
    status: status,
    ...(meta !== undefined && { meta: meta }),
    sessionKey: sessionKey,
    encryptedSecret: encryptedSecret,
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
