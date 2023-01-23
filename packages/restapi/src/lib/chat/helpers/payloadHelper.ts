import { walletToPCAIP10 } from '../../helpers';
import { IConnectedUser } from '../../types';
import { getEncryptedRequest } from './crypto';

export interface ISendMessagePayload {
  fromDID: string;
  toDID: string;
  fromCAIP10: string;
  toCAIP10: string;
  messageContent: string;
  messageType: string;
  signature: string;
  encType: string;
  encryptedSecret: string;
  sigType: string;
}

export interface IApproveRequestPayload {
    fromDID: string;
    toDID: string;
    signature: string;
    status: 'Approved';
    sigType: string;
}

export interface ICreateGroupRequestPayload {
    groupName: string,
    members: Array < string > ,
    groupImage: string,
    admins: Array < string > ,
    isPublic: boolean,
    contractAddressNFT ? : string
    numberOfNFTs ? : number,
    contractAddressERC20 ? : string,
    numberOfERC20 ? : number,
    groupCreator: string,
    verificationProof: string
}

export interface IUpdateGroupRequestPayload {
    groupName: string,
    numberOfERC20: number,
    numberOfNFTs: number,
    profilePicture: string,
    addMembers: Array < string >,
    removeMembers: Array < string >,
    admin: string,
    verificationProof: string
}
  
export const sendMessagePayload = async (
  receiverAddress: string,
  senderCreatedUser: IConnectedUser,
  messageContent: string,
  messageType: string,
  env: string
):Promise<ISendMessagePayload> => {
  const { message, encryptionType, aesEncryptedSecret, signature } =
    (await getEncryptedRequest(
      receiverAddress,
      senderCreatedUser,
      messageContent,
      env
    )) || {};
  const body: ISendMessagePayload = {
    fromDID: walletToPCAIP10(senderCreatedUser.wallets.split(',')[0]),
    toDID: walletToPCAIP10(receiverAddress),
    fromCAIP10: walletToPCAIP10(senderCreatedUser.wallets.split(',')[0]),
    toCAIP10: walletToPCAIP10(receiverAddress),
    messageContent: message!,
    messageType,
    signature: signature!,
    encType: encryptionType!,
    encryptedSecret: aesEncryptedSecret!,
    sigType: signature!,
  };
  return body;
};

export const approveRequestPayload =  (
  senderAddress: string,
  account: string,
  status: 'Approved',
):IApproveRequestPayload => {
  const signature = '1';
  const body = {
    fromDID: walletToPCAIP10(senderAddress),
    toDID: walletToPCAIP10(account),
    signature,
    status,
    sigType: 'sigType',
  };
  return body;
};


export const createGroupPayload =  (
    groupName: string,
    members: Array < string > ,
    groupImage: string,
    admins: Array < string > ,
    isPublic: boolean,
    groupCreator: string,
    verificationProof: string,
    contractAddressNFT ? : string,
    numberOfNFTs ? : number,
    contractAddressERC20 ? : string,
    numberOfERC20 ? : number,
):ICreateGroupRequestPayload => {
  const body = {
    groupName: groupName,
    members: members ,
    groupImage: groupImage,
    admins: admins ,
    isPublic: isPublic,
    contractAddressNFT : contractAddressNFT,
    numberOfNFTs : numberOfNFTs,
    contractAddressERC20 : contractAddressERC20,
    numberOfERC20 : numberOfERC20,
    groupCreator: groupCreator,
    verificationProof: verificationProof,
  };
  return body;
};


export const updateGroupPayload =  (
    groupName: string,
    numberOfERC20: number,
    numberOfNFTs: number,
    profilePicture: string,
    addMembers: Array < string >,
    removeMembers: Array < string >,
    admin: string,
    verificationProof: string
):IUpdateGroupRequestPayload => {
  const body = {
    groupName: groupName,
    numberOfERC20: numberOfERC20 ,
    numberOfNFTs: numberOfNFTs,
    profilePicture: profilePicture,
    addMembers: addMembers,
    removeMembers : removeMembers,
    admin : admin,
    verificationProof : verificationProof  
  };
  return body;
};