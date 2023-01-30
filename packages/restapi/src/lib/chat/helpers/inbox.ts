import Constants from '../../constants';
import { decryptMessage, pCAIP10ToWallet } from '../../helpers';
import { Chat, IConnectedUser, IMessageIPFS, IUser } from '../../types';
import { get as getUser } from '../../user';
import { getCID, Message } from '../ipfs';

type InboxListsType = {
  lists: Chat[];
  user: string; //caip10
  toDecrypt: boolean;
  pgpPrivateKey?: string;
  env?: string;
};
type DecryptConverationType = {
  messages: IMessageIPFS[];
  connectedUser: IUser; //caip10
  toDecrypt: boolean;
  pgpPrivateKey?: string;
  env?: string;
};

export const getInboxLists = async (
  options: InboxListsType
): Promise<IMessageIPFS[]> => {
  const {
    lists,
    user,
    toDecrypt,
    pgpPrivateKey,
    env = Constants.ENV.PROD,
  } = options || {};
  const connectedUser = await getUser({ account: pCAIP10ToWallet(user), env });
  const messages: IMessageIPFS[] = [];
  for (const list of lists) {
    if (list.threadhash !== null) {
      const message = await getCID(list.threadhash, { env });
      const messageWithGroupInfo: IMessageIPFS = { ...message, groupInformation: list.groupInformation }

      messages.push(messageWithGroupInfo);
    }
    // This is for groups that are created without any message
    else {
      messages.push({
        encType: 'PlainText',
        encryptedSecret: '',
        fromCAIP10: '',
        fromDID: '',
        link: '',
        messageContent: '',
        messageType: '',
        sigType: '',
        signature: '',
        toCAIP10: '',
        toDID: '',
        groupInformation: list.groupInformation
      })
    }
  }
  return decryptConversation({ messages, connectedUser, toDecrypt, pgpPrivateKey, env });
};

export const decryptConversation = async (options: DecryptConverationType) => {
  const {
    messages,
    connectedUser,
    toDecrypt,
    pgpPrivateKey,
    env = Constants.ENV.PROD,
  } = options || {};
  let otherPeer: IUser;
  let signatureValidationPubliKey: string; // To do signature verification it depends on who has sent the message
  let gotOtherPeer = false;
  for (const message of messages) {
    if (message.encType !== 'PlainText') {
      if (!pgpPrivateKey) {
        throw Error('Decrypted private key is necessary');
      }
      if (message.fromCAIP10 !== connectedUser.wallets.split(',')[0]) {
        if (!gotOtherPeer) {
          otherPeer = await getUser({ account: message.fromCAIP10, env });
          gotOtherPeer = true;
        }
        signatureValidationPubliKey = otherPeer!.publicKey;
      } else {
        signatureValidationPubliKey = connectedUser.publicKey;
      }
      if (toDecrypt) {
        message.messageContent = await decryptMessage({
          encryptedMessage: message.messageContent,
          encryptedSecret: message.encryptedSecret,
          encryptionType: message.encType,
          signature: message.signature,
          signatureValidationPubliKey: signatureValidationPubliKey,
          pgpPrivateKey,
        });
      }
    }
  }
  return messages;
};
