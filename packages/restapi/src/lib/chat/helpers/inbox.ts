import Constants from '../../constants';
import { decryptMessage, pCAIP10ToWallet } from '../../helpers';
import { Chat, IUser } from '../../types';
import { get as getUser } from '../../user';
import { getCID, Message } from '../ipfs';

type InboxListsType = {
  lists: Chat[];
  user: string; //caip10
  toDecrypt: boolean;
  pgpPrivateKey?: string;
  env?: string;
};

export const getInboxLists = async (options: InboxListsType): Promise<Message[]> => {
  const {
    lists,
    user,
    toDecrypt,
    pgpPrivateKey,
    env = Constants.ENV.PROD,
  } = options || {};
  const connectedUser = await getUser({ account: pCAIP10ToWallet(user), env });
  const messages: Message[] = [];
  for (const list of lists) {
    if (list.threadhash !== null) {
      const message = await getCID(list.threadhash, { env });
      messages.push(message);
    }
  }
  let otherPeer: IUser;
  let signatureValidationPubliKey: string; // To do signature verification it depends on who has sent the message
  let gotOtherPeer = false;
  for (const message of messages) {
    if (message.encType !== 'PlainText') {
      if (!pgpPrivateKey) {
        throw Error('pgpPrivateKey is necessary')
      }
      if (message.fromCAIP10 !== user) {
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
  return messages
};