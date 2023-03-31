import * as PGP from './pgp';
import * as AES from './aes';
import { ethers } from 'ethers';
import {
  IConnectedUser,
  IFeeds,
  IMessageIPFSWithCID,
  IUser,
  GroupDTO,
  walletType,
} from '../../types';
import { get } from '../../user';
import { decryptPGPKey, decryptWithWalletRPCMethod, isValidETHAddress, walletToPCAIP10, decryptAndVerifySignature } from '../../helpers';
import { get as getUser } from '../../user';
import { createUserService } from './service';
import Constants, {ENV} from '../../constants';
import { getDomainInformation, getTypeInformation } from './signature';

const SIG_TYPE_V2 = "eip712v2";

interface IEncryptedRequest {
  message: string;
  encryptionType: 'PlainText' | 'pgp';
  aesEncryptedSecret: string;
  signature: string;
}

export const encryptAndSign = async ({
  plainText,
  keys,
  privateKeyArmored,
}: {
  plainText: string;
  keys: Array<string>
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
    keys: keys,
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


export const signMessageWithPGP = async ({
  message,
  privateKeyArmored,
}: {
  message: string;
  privateKeyArmored: string;
}): Promise<{
  signature: string;
  sigType: string;
}> => {
  const signature: string = await PGP.sign({
    message: message,
    signingKey: privateKeyArmored,
  });

  return {
    signature,
    sigType: 'pgp'
  };
};

export const decryptFeeds = async ({
  feeds,
  connectedUser,
  pgpPrivateKey,
  env = Constants.ENV.PROD,
}: {
  feeds: IFeeds[];
  connectedUser: IUser;
  pgpPrivateKey?:string;
  env: ENV;
}): Promise<IFeeds[]> => {
    let otherPeer: IUser;
    let signatureValidationPubliKey: string; // To do signature verification it depends on who has sent the message
    for (const feed of feeds) {
      let gotOtherPeer = false;
      if (feed.msg.encType !== 'PlainText') {
        if (!pgpPrivateKey) {
          throw Error('Decrypted private key is necessary');
        }
        if (feed.msg.fromCAIP10 !== connectedUser.wallets.split(',')[0]) {
          if (!gotOtherPeer) {
            otherPeer = await getUser({ account: feed.msg.fromCAIP10, env });
            gotOtherPeer = true;
          }
          signatureValidationPubliKey = otherPeer!.publicKey!;
        } else {
          signatureValidationPubliKey = connectedUser.publicKey!;
        }
        feed.msg.messageContent = await decryptAndVerifySignature({
          cipherText: feed.msg.messageContent,
          encryptedSecretKey: feed.msg.encryptedSecret,
          publicKeyArmored: signatureValidationPubliKey,
          signatureArmored: feed.msg.signature,
          privateKeyArmored: pgpPrivateKey,
          message: feed.msg
        });
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
            signatureValidationPubliKey = latestUserInfo.publicKey!;
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
        message: savedMsg
      });
    }
  }
  return savedMsg;
};

export const getEncryptedRequest = async (
  receiverAddress: string,
  senderCreatedUser: IConnectedUser,
  message: string,
  isGroup: boolean,
  env: ENV,
  group: GroupDTO | null,
): Promise<IEncryptedRequest | void> => {

  if (!isGroup) {
    const receiverCreatedUser: IUser = await get({
      account: receiverAddress,
      env,
    });
    if (!receiverCreatedUser?.publicKey) {
      if (!isValidETHAddress(receiverAddress)) {
        throw new Error(`Invalid receiver address!`);
      }
      await createUserService({
        user: receiverAddress,
        publicKey: '',
        encryptedPrivateKey: '',
        encryptionType: '',
        signature: 'pgp',
        sigType: 'pgp',
        env,
      });
      // If the user is being created here, that means that user don't have a PGP keys. So this intent will be in plaintext

      const {
      signature
        } = await signMessageWithPGP({
          message: message,
          privateKeyArmored: senderCreatedUser.privateKey!,
        });


      return {
        message: message,
        encryptionType: 'PlainText',
        aesEncryptedSecret: '',
        signature: signature,
      };
    } else {
      // It's possible for a user to be created but the PGP keys still not created

      if (
        !receiverCreatedUser.publicKey.includes(
          '-----BEGIN PGP PUBLIC KEY BLOCK-----'
        )
      ) {

        const {
          signature
        } = await signMessageWithPGP({
          message: message,
          privateKeyArmored: senderCreatedUser.privateKey!,
        });

        return {
          message: message,
          encryptionType: 'PlainText',
          aesEncryptedSecret: '',
          signature: signature,
        };
      } else {
        const {
          cipherText,
          encryptedSecret,
          signature,
        } = await encryptAndSign({
          plainText: message,
          keys: [receiverCreatedUser.publicKey, senderCreatedUser.publicKey],
          privateKeyArmored: senderCreatedUser.privateKey!,
        });
        return {
          message: cipherText,
          encryptionType: 'pgp',
          aesEncryptedSecret: encryptedSecret,
          signature: signature,
        };
      }
    }
  } else if(group) {
      if(group.isPublic) {
         const {
          signature
        } = await signMessageWithPGP({
          message: message,
          privateKeyArmored: senderCreatedUser.privateKey!,
        });
          return {
            message: message,
            encryptionType: 'PlainText',
            aesEncryptedSecret: '',
            signature: signature,
          }
      }
      else {
        const publicKeys: string[] = group.members.map(member => member.publicKey);
        const {
          cipherText,
          encryptedSecret,
          signature,
        } = await encryptAndSign({
          plainText: message,
          keys: publicKeys,
          privateKeyArmored: senderCreatedUser.privateKey!,
        });
        return {
          message: cipherText,
          encryptionType: 'pgp',
          aesEncryptedSecret: encryptedSecret,
          signature: signature,
        };
      }
  }
};

export const getSignature = async (user: string, wallet: walletType, hash: string, isDomainEmpty: boolean) => {
  if(!wallet?.signer) {
    console.warn("This method is deprecated. Provide signer in the function");
    // sending random signature for making it backward compatible
    return { signature: "xyz", sigType: "a" };
  }

  const typeInformation = getTypeInformation();
  const _signer = wallet?.signer;
  let chainId: number;
  try {
    chainId = await _signer.getChainId();
  }
  catch(err) {
    chainId = 1;
  }
  const domain = getDomainInformation(chainId);

  // sign a message using EIP712
  const signedMessage = await _signer?._signTypedData(
    isDomainEmpty ? {} : domain,
    typeInformation,
    { data: hash },
  );

  const verificationProof = isDomainEmpty ? `${SIG_TYPE_V2}:${signedMessage}` : `${SIG_TYPE_V2}:${chainId}:${signedMessage}`

  return { verificationProof };
}

export async function getDecryptedPrivateKey(wallet: walletType, user: any, address: string): Promise<string> {
  let decryptedPrivateKey;
  if (wallet.signer) {
    decryptedPrivateKey = await decryptPGPKey({
      signer: wallet.signer,
      encryptedPGPPrivateKey: user.encryptedPrivateKey
    })
  } else {
    decryptedPrivateKey = await decryptWithWalletRPCMethod(
      user.encryptedPrivateKey,
      address
    );
  }
  return decryptedPrivateKey;
}