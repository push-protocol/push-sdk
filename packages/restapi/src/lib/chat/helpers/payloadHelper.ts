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
    sigType: 'pgp',
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
