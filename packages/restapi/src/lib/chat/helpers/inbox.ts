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
      messages.push(message);
    }
  }
  console.log(messages)
  if(toDecrypt)
    return decryptConversation({messages,connectedUser,pgpPrivateKey,env});
  return messages;
};

export const decryptConversation = async(options:DecryptConverationType) => {
  const {
    messages,
    connectedUser,
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
  return messages;
};
