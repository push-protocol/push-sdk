import Constants, {ENV} from '../../constants';
import { decryptMessage, pCAIP10ToWallet } from '../../helpers';
import { IFeeds, IMessageIPFS, IUser } from '../../types';
import { get as getUser } from '../../user';
import { getCID } from '../ipfs';
import { decryptFeeds } from './crypto';

type InboxListsType = {
  lists: IFeeds[];
  user: string; //caip10
  toDecrypt: boolean;
  pgpPrivateKey?: string;
  env?:  ENV;
};
type DecryptConverationType = {
  messages: IMessageIPFS[];
  connectedUser: IUser; //caip10
  pgpPrivateKey?: string;
  env?:  ENV;
};

export const getInboxLists = async (
  options: InboxListsType
): Promise<IFeeds[]> => {
  const {
    lists,
    user,
    toDecrypt,
    pgpPrivateKey,
    env = Constants.ENV.PROD,
  } = options || {};
  try{
  const connectedUser = await getUser({ account: pCAIP10ToWallet(user), env });
  const feeds: IFeeds[] = [];
  const promiseArrToGetCID:any = [];
  lists.forEach((list) =>
    promiseArrToGetCID.push(
      (() => {
        let message;
        if (list.threadhash !== null) {
            message = getCID(list.threadhash, { env });
        }
        // This is for groups that are created without any message
        else {
          message = {
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
          };
        }
        return message;
      })()
    )
  );


    const messages = await Promise.allSettled(promiseArrToGetCID) as PromiseFulfilledResult<IMessageIPFS>[];
    if(messages.length) {
    lists.forEach((list,i)=> feeds.push(
      {
      ...list,
      msg: getMessage(messages[i]),
    }))
  }

  if (toDecrypt)
    return decryptFeeds({ feeds, connectedUser, pgpPrivateKey, env });
  return feeds;
  }catch(err:any){
    throw new Error(err);
  }
};


const getMessage = (message:PromiseFulfilledResult<IMessageIPFS>):IMessageIPFS => {
if(message.status === 'fulfilled')
{
  return message.value;
}
else{
  return {
    encType: 'PlainText',
    encryptedSecret: '',
    fromCAIP10: '',
    fromDID: '',
    link: '',
    messageContent: 'Message has expired',
    messageType: 'Text',
    sigType: '',
    signature: '',
    toCAIP10: '',
    toDID: '',
    timestamp:0,
  };
}
}

export const decryptConversation = async (options: DecryptConverationType) => {
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
        encryptedPGPPrivateKey: message.messageContent,
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
