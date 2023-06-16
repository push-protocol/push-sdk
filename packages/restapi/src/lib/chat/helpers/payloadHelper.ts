import { isValidETHAddress, walletToPCAIP10 } from '../../helpers';
import { IConnectedUser, GroupDTO } from '../../types';
import { getEncryptedRequest } from './crypto';
import { getGroup } from '../getGroup';
import { ENV } from '../../constants';
import { sign } from './pgp';
import * as AES from './aes';
export interface ISendMessagePayload {
  fromDID: string;
  toDID: string;
  fromCAIP10: string;
  toCAIP10: string;
  messageObj?: {
    message: string;
    messageType: string;
    meta?: string;
  } | null;
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
  receiverAddress: string,
  senderCreatedUser: IConnectedUser,
  messageObj: null | {
    message: string;
    messageType: string;
    meta?: string;
  },
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

  const secretKey: string = AES.generateRandomSecret(15);
  const { message, encryptionType, aesEncryptedSecret, signature } =
    (await getEncryptedRequest(
      receiverAddress,
      senderCreatedUser,
      messageContent,
      isGroup,
      env,
      group,
      secretKey
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

  if (messageObj) {
    let meta: string | undefined = undefined;
    const message = (
      await getEncryptedRequest(
        receiverAddress,
        senderCreatedUser,
        messageObj.message,
        isGroup,
        env,
        group,
        secretKey
      )
    ).message;
    if (messageObj.meta) {
      meta = (
        await getEncryptedRequest(
          receiverAddress,
          senderCreatedUser,
          messageObj.meta,
          isGroup,
          env,
          group,
          secretKey
        )
      ).message;
    }

    body.messageObj = {
      message: message,
      messageType: messageObj.messageType,
    };
    if (meta) {
      body.messageObj.meta = meta;
    }
    //Construct verification Proof
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
    body.verificationProof = `pgp:${signature}`;
  }
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
