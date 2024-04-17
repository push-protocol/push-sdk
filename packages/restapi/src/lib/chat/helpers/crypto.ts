import * as PGP from './pgp';
import * as AES from './aes';
import * as CryptoJS from 'crypto-js';
import {
  IConnectedUser,
  IFeeds,
  IMessageIPFSWithCID,
  IUser,
  GroupDTO,
  walletType,
  IMessageIPFS,
  GroupInfoDTO,
} from '../../types';
import { get } from '../../user';
import {
  Signer,
  decryptPGPKey,
  decryptWithWalletRPCMethod,
  isValidPushCAIP,
} from '../../helpers';
import { get as getUser } from '../../user';
import { createUserService } from './service';
import Constants, { ENV } from '../../constants';
import { getDomainInformation, getTypeInformation } from './signature';
import { IPGPHelper } from './pgp';
import { aesDecrypt } from './aes';
import { getEncryptedSecret } from './getEncryptedSecret';
import { getGroup } from '../getGroup';
import { cache } from '../../helpers/cache';
import { getCID } from '../ipfs';

const SIG_TYPE_V2 = 'eip712v2';

interface IEncryptedRequest {
  message: string;
  encryptionType: 'PlainText' | 'pgp' | 'pgpv1:group';
  aesEncryptedSecret: string | null;
  signature: string;
}
interface IDecryptMessage {
  savedMsg: IMessageIPFSWithCID;
  connectedUser: IConnectedUser;
  account: string;
  chainId: number;
  currentChat: IFeeds;
  inbox: IFeeds[];
  pgpHelper: IPGPHelper;
}

export const encryptAndSign = async ({
  plainText,
  keys,
  privateKeyArmored,
  secretKey,
}: {
  plainText: string;
  keys: Array<string>;
  privateKeyArmored: string;
  secretKey: string;
}): Promise<{
  cipherText: string;
  encryptedSecret: string;
  signature: string;
  sigType: string;
  encType: string;
}> => {
  return await encryptAndSignCore({
    plainText,
    keys,
    privateKeyArmored,
    secretKey,
    pgpHelper: PGP.PGPHelper,
  });
};

export const encryptAndSignCore = async ({
  plainText,
  keys,
  privateKeyArmored,
  secretKey,
  pgpHelper,
}: {
  plainText: string;
  keys: Array<string>;
  privateKeyArmored: string;
  secretKey: string;
  pgpHelper: PGP.IPGPHelper;
}): Promise<{
  cipherText: string;
  encryptedSecret: string;
  signature: string;
  sigType: string;
  encType: string;
}> => {
  const cipherText: string = AES.aesEncrypt({ plainText, secretKey });
  const encryptedSecret = await pgpHelper.pgpEncrypt({
    plainText: secretKey,
    keys: keys,
  });
  const signature: string = await pgpHelper.sign({
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
  return await signMessageWithPGPCore({
    message,
    privateKeyArmored,
    pgpHelper: PGP.PGPHelper,
  });
};

export const signMessageWithPGPCore = async ({
  message,
  privateKeyArmored,
  pgpHelper,
}: {
  message: string;
  privateKeyArmored: string;
  pgpHelper: PGP.IPGPHelper;
}): Promise<{
  signature: string;
  sigType: string;
}> => {
  const signature: string = await pgpHelper.sign({
    message: message,
    signingKey: privateKeyArmored,
  });

  return {
    signature,
    sigType: 'pgp',
  };
};

export const decryptFeeds = async ({
  feeds,
  connectedUser,
  pgpPrivateKey,
  env = Constants.ENV.PROD,
  pgpHelper,
}: {
  feeds: IFeeds[];
  connectedUser: IUser;
  pgpPrivateKey?: string;
  pgpHelper: PGP.IPGPHelper;
  env: ENV;
}): Promise<IFeeds[]> => {
  const validateAndDecryptFeed = async (feed: IFeeds) => {
    if (!pgpPrivateKey) {
      throw new Error('Decrypted private key is necessary');
    }

    if (feed.msg.encType !== 'PlainText') {
      const senderCAIP10 = feed.msg.fromCAIP10;
      const isSenderConnectedUser =
        senderCAIP10 === connectedUser.wallets.split(',')[0];
      let publicKey: string;

      if (!isSenderConnectedUser) {
        /**
         * CACHE
         */
        const cacheKey = `pgpPubKey-${senderCAIP10}`;
        // Check if the pubkey is already in the cache
        if (cache.has(cacheKey)) {
          publicKey = cache.get(cacheKey);
        } else {
          // If not in cache, fetch from API
          const otherPeer = await getUser({ account: senderCAIP10, env });
          // Cache the pubkey data
          cache.set(cacheKey, otherPeer.publicKey);
          publicKey = otherPeer.publicKey;
        }
      } else {
        publicKey = connectedUser.publicKey;
      }

      feed.msg = await decryptAndVerifyMessage(
        feed.msg,
        publicKey,
        pgpPrivateKey,
        env,
        pgpHelper
      );
    }
  };

  for (const feed of feeds) {
    await validateAndDecryptFeed(feed);
  }

  return feeds;
};

export const getEncryptedRequest = async (
  receiverAddress: string,
  senderCreatedUser: IConnectedUser,
  message: string,
  isGroup: boolean,
  env: ENV,
  group: GroupInfoDTO | null,
  secretKey: string
): Promise<IEncryptedRequest> => {
  return await getEncryptedRequestCore(
    receiverAddress,
    senderCreatedUser,
    message,
    isGroup,
    env,
    group,
    secretKey,
    PGP.PGPHelper
  );
};

export const getEncryptedRequestCore = async (
  receiverAddress: string,
  senderCreatedUser: IConnectedUser,
  message: string,
  isGroup: boolean,
  env: ENV,
  group: GroupInfoDTO | null,
  secretKey: string,
  pgpHelper: PGP.IPGPHelper
): Promise<IEncryptedRequest> => {
  if (!isGroup) {
    const receiverCreatedUser: IUser = await get({
      account: receiverAddress,
      env,
    });
    if (!receiverCreatedUser?.publicKey) {
      if (!isValidPushCAIP(receiverAddress)) {
        throw new Error(`Invalid receiver address!`);
      }
      await createUserService({
        user: receiverAddress,
        publicKey: '',
        encryptedPrivateKey: '',
        env,
      });
      // If the user is being created here, that means that user don't have a PGP keys. So this intent will be in plaintext

      const { signature } = await signMessageWithPGPCore({
        message: message,
        privateKeyArmored: senderCreatedUser.privateKey!,
        pgpHelper: pgpHelper,
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
        const { signature } = await signMessageWithPGPCore({
          message: message,
          privateKeyArmored: senderCreatedUser.privateKey!,
          pgpHelper: pgpHelper,
        });

        return {
          message: message,
          encryptionType: 'PlainText',
          aesEncryptedSecret: '',
          signature: signature,
        };
      } else {
        const { cipherText, encryptedSecret, signature } =
          await encryptAndSignCore({
            plainText: message,
            keys: [receiverCreatedUser.publicKey, senderCreatedUser.publicKey],
            privateKeyArmored: senderCreatedUser.privateKey!,
            secretKey,
            pgpHelper: pgpHelper,
          });
        return {
          message: cipherText,
          encryptionType: 'pgp',
          aesEncryptedSecret: encryptedSecret,
          signature: signature,
        };
      }
    }
  } else if (group) {
    if (group.isPublic) {
      const { signature } = await signMessageWithPGPCore({
        message: message,
        privateKeyArmored: senderCreatedUser.privateKey!,
        pgpHelper: pgpHelper,
      });
      return {
        message: message,
        encryptionType: 'PlainText',
        aesEncryptedSecret: '',
        signature: signature,
      };
    } else {
      // Private Groups

      // 1. Private Groups with session keys
      if (group.sessionKey && group.encryptedSecret) {
        const cipherText: string = AES.aesEncrypt({
          plainText: message,
          secretKey,
        });

        const signature: string = await pgpHelper.sign({
          message: cipherText,
          signingKey: senderCreatedUser.privateKey!,
        });

        return {
          message: cipherText,
          encryptionType: 'pgpv1:group',
          aesEncryptedSecret: null,
          signature: signature,
        };
      } else {
        // do a getGroupCall to get keys of all members
        const groupWithMembers: GroupDTO = await getGroup({
          chatId: group.chatId,
          env: env,
        });

        const publicKeys: string[] = groupWithMembers.members.map(
          (member) => member.publicKey
        );
        const { cipherText, encryptedSecret, signature } =
          await encryptAndSignCore({
            plainText: message,
            keys: publicKeys,
            privateKeyArmored: senderCreatedUser.privateKey!,
            secretKey,
            pgpHelper: pgpHelper,
          });
        return {
          message: cipherText,
          encryptionType: 'pgp',
          aesEncryptedSecret: encryptedSecret,
          signature: signature,
        };
      }
    }
  } else {
    throw new Error('Unable to find Group Data');
  }
};

export const getEip191Signature = async (
  wallet: walletType,
  message: string,
  version: 'v1' | 'v2' = 'v1'
) => {
  if (!wallet?.signer) {
    console.warn('This method is deprecated. Provide signer in the function');
    // sending random signature for making it backward compatible
    return { signature: 'xyz', sigType: 'a' };
  }
  const _signer = wallet?.signer;
  // EIP191 signature

  const pushSigner = new Signer(_signer);
  const signature = await pushSigner.signMessage(message);
  const sigType = version === 'v1' ? 'eip191' : 'eip191v2';
  return { verificationProof: `${sigType}:${signature}` };
};

export const getEip712Signature = async (
  wallet: walletType,
  hash: string,
  isDomainEmpty: boolean
) => {
  if (!wallet?.signer) {
    console.warn('This method is deprecated. Provide signer in the function');
    // sending random signature for making it backward compatible
    return { signature: 'xyz', sigType: 'a' };
  }

  const typeInformation = getTypeInformation();
  const _signer = wallet?.signer;
  const pushSigner = new Signer(_signer);
  let chainId: number;
  try {
    chainId = await pushSigner.getChainId();
  } catch (err) {
    chainId = 1;
  }
  const domain = getDomainInformation(chainId);

  // sign a message using EIP712
  const signedMessage = await pushSigner.signTypedData(
    isDomainEmpty ? {} : domain,
    typeInformation,
    { data: hash },
    'Data'
  );
  const verificationProof = isDomainEmpty
    ? `${SIG_TYPE_V2}:${signedMessage}`
    : `${SIG_TYPE_V2}:${chainId}:${signedMessage}`;
  return { verificationProof };
};

export async function getDecryptedPrivateKey(
  wallet: walletType,
  user: any,
  address: string,
  env: ENV
): Promise<string> {
  let decryptedPrivateKey;
  if (wallet.signer) {
    decryptedPrivateKey = await decryptPGPKey({
      signer: wallet.signer,
      encryptedPGPPrivateKey: user.encryptedPrivateKey,
      env,
    });
  } else {
    decryptedPrivateKey = await decryptWithWalletRPCMethod(
      user.encryptedPrivateKey,
      address
    );
  }
  return decryptedPrivateKey;
}

/**
 * Decrypts and verifies a Push Chat Message
 * @param message encrypted chat message
 * @param pgpPublicKey pgp public key of signer of message - used for verification
 * @param pgpPrivateKey pgp private key of receiver - used for decryption
 */
export const decryptAndVerifyMessage = async (
  message: IMessageIPFS | IMessageIPFSWithCID,
  pgpPublicKey: string,
  pgpPrivateKey: string,
  env: ENV,
  pgpHelper = PGP.PGPHelper
): Promise<IMessageIPFS | IMessageIPFSWithCID> => {
  /**
   * VERIFICATION
   * If verification proof is present then check that else check messageContent Signature
   */
  if (
    message.verificationProof &&
    message.verificationProof.split(':')[0] === 'pgpv2'
  ) {
    const bodyToBeHashed = {
      fromDID: message.fromDID,
      toDID: message.fromDID,
      fromCAIP10: message.fromCAIP10,
      toCAIP10: message.toCAIP10,
      messageObj: message.messageObj,
      messageType: message.messageType,
      encType: message.encType,
      encryptedSecret: message.encryptedSecret,
    };
    const hash = CryptoJS.SHA256(JSON.stringify(bodyToBeHashed)).toString();
    const signature = message.verificationProof.split(':')[1];
    await pgpHelper.verifySignature({
      messageContent: hash,
      signatureArmored: signature,
      publicKeyArmored: pgpPublicKey,
    });
  } else if (
    message.verificationProof &&
    message.verificationProof.split(':')[0] === 'pgpv3'
  ) {
    const bodyToBeHashed = {
      fromDID: message.fromDID,
      toDID: message.fromDID,
      fromCAIP10: message.fromCAIP10,
      toCAIP10: message.toCAIP10,
      messageObj: message.messageObj,
      messageType: message.messageType,
      encType: message.encType,
      sessionKey: message.sessionKey,
      encryptedSecret: message.encryptedSecret,
    };
    const hash = CryptoJS.SHA256(JSON.stringify(bodyToBeHashed)).toString();
    const signature = message.verificationProof.split(':')[1];
    await pgpHelper.verifySignature({
      messageContent: hash,
      signatureArmored: signature,
      publicKeyArmored: pgpPublicKey,
    });
  } else {
    if (message.link == null) {
      const bodyToBeHashed = {
        fromDID: message.fromDID,
        toDID: message.toDID,
        messageContent: message.messageContent,
        messageType: message.messageType,
      };
      const hash = CryptoJS.SHA256(JSON.stringify(bodyToBeHashed)).toString();
      try {
        await pgpHelper.verifySignature({
          messageContent: hash,
          signatureArmored: message.signature,
          publicKeyArmored: pgpPublicKey,
        });
      } catch (err) {
        await pgpHelper.verifySignature({
          messageContent: message.messageContent,
          signatureArmored: message.signature,
          publicKeyArmored: pgpPublicKey,
        });
      }
    } else {
      await pgpHelper.verifySignature({
        messageContent: message.messageContent,
        signatureArmored: message.signature,
        publicKeyArmored: pgpPublicKey,
      });
    }
  }

  /**
   * DECRYPTION
   * 1. Fetch encryptedSecret for given sessionKey ( if encType is pgpv1:group - v2 private group )
   * 1. Decrypt encryptedSecret using pgpPrivateKey
   * 2. Decrypt messageObj & messageContent using decryptedSecret
   */
  const decryptedMessage: IMessageIPFS | IMessageIPFSWithCID = { ...message };
  try {
    let decryptedSecret: string;
    if (message.encType === 'pgpv1:group') {
      /**
       * CACHE [ sessionKey -> decryptedSecret ]
       */
      const cacheKey = `sessionKey-${message.sessionKey}`;
      if (cache.has(cacheKey)) {
        decryptedSecret = cache.get(cacheKey);
      } else {
        /**
         * Get encryptedSecret from Backend using sessionKey for this encryption type
         */
        const encryptedSecret = await getEncryptedSecret({
          sessionKey: message.sessionKey as string,
          env,
        });
        decryptedSecret = await pgpHelper.pgpDecrypt({
          cipherText: encryptedSecret,
          toPrivateKeyArmored: pgpPrivateKey,
        });
        cache.set(cacheKey, decryptedSecret);
      }
    } else {
      decryptedSecret = await pgpHelper.pgpDecrypt({
        cipherText: message.encryptedSecret,
        toPrivateKeyArmored: pgpPrivateKey,
      });
    }

    decryptedMessage.messageContent = aesDecrypt({
      cipherText: message.messageContent,
      secretKey: decryptedSecret,
    });
    if (message.messageObj) {
      const decryptedMessageObj = aesDecrypt({
        cipherText: message.messageObj as string,
        secretKey: decryptedSecret,
      });
      /**
       * @dev - messageObj can be an invalid JSON string which needs to be handled
       * @dev - swift sdk sends messageObj as invalid json string
       */
      try {
        decryptedMessage.messageObj = JSON.parse(decryptedMessageObj);
      } catch (err) {
        decryptedMessage.messageObj = decryptedMessageObj;
      }

      try {
        if ((decryptedMessage.messageObj as any).reference) {
          const reference = (decryptedMessage.messageObj as any).reference;
          if (reference && reference.split(':').length === 1) {
            const message: any = await getCID(reference, { env });
            (decryptedMessage.messageObj as any).reference = message.cid;
          }
        }
      } catch (err) {
        // Ignore Dangling Reference
      }
    }
  } catch (err) {
    decryptedMessage.messageContent = decryptedMessage.messageObj =
      'Unable to Decrypt Message';
  }

  return decryptedMessage;
};
