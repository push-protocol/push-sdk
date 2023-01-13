import * as PushAPI from '@pushprotocol/restapi';
import { IConnectedUser, IUser } from '@pushprotocol/restapi';
import { Constants } from '../config';
import { IMessageIPFS } from '../types';

type DecryptConverationType = {
  message: IMessageIPFS;
  connectedUser: IConnectedUser; //caip10
  env?: string;
};

export const decryptConversation = async (options: DecryptConverationType) => {
  const { message, connectedUser, env = Constants.ENV.PROD } = options || {};
  let otherPeer: IUser;
  let signatureValidationPubliKey: string; // To do signature verification it depends on who has sent the message
  let gotOtherPeer = false;
  if (message.encType !== 'PlainText') {
    if (!connectedUser.privateKey) {
      throw Error('Decrypted private key is necessary');
    }
    if (message.fromCAIP10 !== connectedUser.wallets.split(',')[0]) {
      if (!gotOtherPeer) {
        otherPeer = await PushAPI.user.get({
          account: message.fromCAIP10,
          env,
        });
        gotOtherPeer = true;
      }
      signatureValidationPubliKey = otherPeer!.publicKey;
    } else {
      signatureValidationPubliKey = connectedUser.publicKey;
    }
    // message.messageContent = await decryptMessage({
    //   encryptedMessage: message.messageContent,
    //   encryptedSecret: message.encryptedSecret,
    //   encryptionType: message.encType,
    //   signature: message.signature,
    //   signatureValidationPubliKey: signatureValidationPubliKey,
    //   pgpPrivateKey: connectedUser.privateKey,
    // });
  }

  return message;
};
