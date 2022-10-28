import * as PGP from './pgp';
import * as AES from './aes';
import { ethers } from 'ethers';
import {
  IConnectedUser,
  IFeeds,
  IMessageIPFSWithCID,
  IUser,
} from '../../types';
import { get } from '../../user';
import { walletToPCAIP10 } from '../../helpers';
import {createUserService} from "./user";

interface IEncryptedRequest {
  message: string;
  encryptionType: 'PlainText' | 'pgp';
  aesEncryptedSecret: string;
  signature: string;
}

export const encryptAndSign = async ({
  plainText,
  fromPublicKeyArmored,
  toPublicKeyArmored,
  privateKeyArmored,
}: {
  plainText: string;
  fromPublicKeyArmored: string;
  toPublicKeyArmored: string;
  privateKeyArmored: string;
}): Promise<{
  cipherText: string;
  encryptedSecret: string;
  signature: string;
  sigType: string;
  encType: string;
}> => {
  const secretKey: string = AES.generateRandomSecret(15);
  const cipherText: string = AES.aesEncrypt({ plainText, secretKey });
  const encryptedSecret = await PGP.pgpEncrypt({
    plainText: secretKey,
    fromPublicKeyArmored,
    toPublicKeyArmored,
  });
  const signature: string = await PGP.sign({
    message: cipherText,
    signingKey: privateKeyArmored,
  });
  return {
    cipherText,
    encryptedSecret,
    signature,
    sigType: 'pgp',
    encType: 'pgp',
  };
};

export const decryptAndVerifySignature = async ({
  cipherText,
  encryptedSecretKey,
  publicKeyArmored,
  signatureArmored,
  privateKeyArmored,
}: {
  cipherText: string;
  encryptedSecretKey: string;
  publicKeyArmored: string;
  signatureArmored: string;
  privateKeyArmored: string;
}): Promise<string> => {
  // const privateKeyArmored: string = await DIDHelper.decrypt(JSON.parse(encryptedPrivateKeyArmored), did)
  const secretKey: string = await PGP.pgpDecrypt({
    cipherText: encryptedSecretKey,
    toPrivateKeyArmored: privateKeyArmored,
  });
  await PGP.verifySignature({
    messageContent: cipherText,
    signatureArmored,
    publicKeyArmored,
  });
  return AES.aesDecrypt({ cipherText, secretKey });
};

export const decryptFeeds = async ({
  feeds,
  connectedUser,
}: {
  feeds: IFeeds[];
  connectedUser: IConnectedUser;
}): Promise<IFeeds[]> => {
  if (connectedUser.privateKey) {
    for (const feed of feeds) {
      if (feed.msg.encType !== 'PlainText' && feed.msg.encType !== null) {
        // To do signature verification it depends on who has sent the message
        let signatureValidationPubliKey: string;
        if (feed.msg.fromCAIP10 === connectedUser.wallets.split(',')[0]) {
          signatureValidationPubliKey = connectedUser.publicKey;
        } else {
          signatureValidationPubliKey = feed.publicKey;
        }

        feed.msg.lastMessage = await decryptAndVerifySignature({
          cipherText: feed.msg.lastMessage,
          encryptedSecretKey: feed.msg.encryptedSecret,
          publicKeyArmored: signatureValidationPubliKey,
          signatureArmored: feed.msg.signature,
          privateKeyArmored: connectedUser.privateKey,
        });
      }
    }
  }
  return feeds;
};

interface IDecryptMessage {
  savedMsg: IMessageIPFSWithCID;
  connectedUser: IConnectedUser;
  account: string;
  chainId: number;
  currentChat: IFeeds;
  inbox: IFeeds[];
}

export const decryptMessages = async ({
  savedMsg,
  connectedUser,
  account,
  currentChat,
  inbox,
}: IDecryptMessage): Promise<IMessageIPFSWithCID> => {
  if (connectedUser.privateKey) {
    if (savedMsg.encType !== 'PlainText' && savedMsg.encType !== null) {
      // To do signature verification it depends on who has sent the message
      let signatureValidationPubliKey = '';
      if (savedMsg.fromCAIP10 === walletToPCAIP10(account)) {
        signatureValidationPubliKey = connectedUser.publicKey;
      } else {
        if (!currentChat.publicKey) {
          const latestUserInfo = inbox.find(
            (x) => x.wallets.split(',')[0] === currentChat.wallets.split(',')[0]
          );
          if (latestUserInfo) {
            signatureValidationPubliKey = latestUserInfo.publicKey;
          }
        } else {
          signatureValidationPubliKey = currentChat.publicKey;
        }
      }
      savedMsg.messageContent = await decryptAndVerifySignature({
        cipherText: savedMsg.messageContent,
        encryptedSecretKey: savedMsg.encryptedSecret,
        privateKeyArmored: connectedUser.privateKey,
        publicKeyArmored: signatureValidationPubliKey,
        signatureArmored: savedMsg.signature,
      });
    }
  }
  return savedMsg;
};

export const getEncryptedRequest = async (
  receiverAddress: string,
  senderCreatedUser: IConnectedUser,
  message: string
): Promise<IEncryptedRequest | void> => {
  const receiverCreatedUser: IUser = await get({ account: receiverAddress });
  if (!receiverCreatedUser) {
    if (!ethers.utils.isAddress(receiverAddress)) {
        console.log("Invalid receiver's address");
        return;
    }
    await createUserService({
      user:receiverAddress,
      publicKey:'',
      encryptedPrivateKey: '',
      encryptionType: '',
      signature:'pgp',
      sigType:'pgp',
    });
    // If the user is being created here, that means that user don't have a PGP keys. So this intent will be in plaintext
    return {
      message: message,
      encryptionType: 'PlainText',
      aesEncryptedSecret: '',
      signature: '',
    };
  } else {
    // It's possible for a user to be created but the PGP keys still not created
    if (
      !receiverCreatedUser.publicKey.includes(
        '-----BEGIN PGP PUBLIC KEY BLOCK-----'
      )
    ) {
      return {
        message: message,
        encryptionType: 'PlainText',
        aesEncryptedSecret: '',
        signature: '',
      };
    } else {
      const {
        cipherText,
        encryptedSecret,
        signature: pgpSignature,
      } = await encryptAndSign({
        plainText: message,
        toPublicKeyArmored: receiverCreatedUser.publicKey,
        fromPublicKeyArmored: senderCreatedUser.publicKey,
        privateKeyArmored: senderCreatedUser.privateKey!,
      });
      return {
        message: cipherText,
        encryptionType: 'pgp',
        aesEncryptedSecret: encryptedSecret,
        signature: pgpSignature,
      };
    }
  }
};
