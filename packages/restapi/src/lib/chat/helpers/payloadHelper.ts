import { isValidETHAddress, walletToPCAIP10 } from '../../helpers';
import { IConnectedUser, GroupDTO } from '../../types';
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
  groupDescription: string;
  members: Array<string>;
  groupImage: string;
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
  groupImage: string;
  members: Array<string>;
  admins: Array<string>;
  address: string;
  verificationProof: string;
}

export const sendMessagePayload = async (
  fromDID: string,
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
    fromDID: walletToPCAIP10(fromDID),
    toDID: isGroup ? receiverAddress : walletToPCAIP10(receiverAddress),
    fromCAIP10: walletToPCAIP10(fromDID),
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
    fromDID: fromDID,
    toDID: toDID,
    signature,
    status,
    sigType,
    verificationProof: sigType + ':' + signature,
  };
  return body;
};

export const createGroupPayload = (
  groupName: string,
  groupDescription: string,
  members: Array<string>,
  groupImage: string,
  admins: Array<string>,
  isPublic: boolean,
  groupCreator: string,
  verificationProof: string,
  contractAddressNFT?: string,
  numberOfNFTs?: number,
  contractAddressERC20?: string,
  numberOfERC20?: number,
  meta?: string
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
  };
  return body;
};

export const updateGroupPayload = (
  groupName: string,
  groupImage: string,
  groupDescription: string,
  members: Array<string>,
  admins: Array<string>,
  address: string,
  verificationProof: string
): IUpdateGroupRequestPayload => {
  const body = {
    groupName: groupName,
    groupImage: groupImage,
    groupDescription: groupDescription,
    members: members,
    admins: admins,
    address: address,
    verificationProof: verificationProof,
  };
  return body;
};
