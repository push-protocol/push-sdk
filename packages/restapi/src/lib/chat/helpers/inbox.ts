import * as PGP from './pgp';
import Constants, { ENV } from '../../constants';
import { isValidCAIP10NFTAddress, pCAIP10ToWallet } from '../../helpers';
import { IFeeds, IMessageIPFS, IUser, SpaceIFeeds } from '../../types';
import { get as getUser } from '../../user';
import { getCID } from '../ipfs';
import { decryptFeeds, decryptAndVerifyMessage } from './crypto';
import { cache } from '../../helpers/cache';

type InboxListsType = {
  lists: IFeeds[];
  user: string; //caip10
  toDecrypt: boolean;
  pgpPrivateKey?: string;
  env?: ENV;
};

type SpaceInboxListsType = {
  lists: SpaceIFeeds[];
  user: string; //caip10
  toDecrypt: boolean;
  pgpPrivateKey?: string;
  env?: ENV;
};

type TrendingSpaceInboxListsType = {
  lists: SpaceIFeeds[];
  env?: ENV;
};

type DecryptConverationType = {
  messages: IMessageIPFS[];
  connectedUser: IUser; //caip10
  pgpPrivateKey?: string;
  pgpHelper?: PGP.IPGPHelper;
  env?: ENV;
};

export const getInboxLists = async (
  options: InboxListsType,
  pgpHelper = PGP.PGPHelper
): Promise<IFeeds[]> => {
  const {
    lists: feeds,
    user,
    toDecrypt,
    pgpPrivateKey,
    env = Constants.ENV.PROD,
  } = options || {};

  if (toDecrypt) {
    const connectedUser = await getUser({
      account: pCAIP10ToWallet(user),
      env,
    });
    return decryptFeeds({
      feeds,
      connectedUser,
      pgpPrivateKey,
      pgpHelper,
      env,
    });
  }
  return feeds;
};

export const getSpaceInboxLists = async (
  options: SpaceInboxListsType
): Promise<SpaceIFeeds[]> => {
  const {
    lists,
    user,
    toDecrypt,
    pgpPrivateKey,
    env = Constants.ENV.PROD,
  } = options || {};
  const connectedUser = await getUser({ account: pCAIP10ToWallet(user), env });
  const feeds: SpaceIFeeds[] = [];
  for (const list of lists) {
    let message;
    if (list.threadhash !== null) {
      message = await getCID(list.threadhash, { env });
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
    feeds.push({
      ...list,
      msg: message,
      spaceInformation: list.spaceInformation,
    });
  }

  if (toDecrypt)
    return decryptFeeds({
      feeds,
      connectedUser,
      pgpPrivateKey,
      pgpHelper: PGP.PGPHelper,
      env,
    });
  return feeds;
};

export const getTrendingSpaceInboxLists = async (
  options: TrendingSpaceInboxListsType
): Promise<SpaceIFeeds[]> => {
  const { lists, env = Constants.ENV.PROD } = options || {};
  const feeds: SpaceIFeeds[] = [];
  for (const list of lists) {
    let message;
    if (list.threadhash !== null) {
      message = await getCID(list.threadhash, { env });
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
    feeds.push({
      ...list,
      msg: message,
      spaceInformation: list.spaceInformation,
    });
  }
  return feeds;
};

export const decryptConversation = async (options: DecryptConverationType) => {
  const {
    messages,
    connectedUser,
    pgpPrivateKey,
    pgpHelper = PGP.PGPHelper,
    env = Constants.ENV.PROD,
  } = options || {};
  let signatureValidationPubliKey: string; // To do signature verification it depends on who has sent the message
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    if (message.encType !== 'PlainText') {
      // check if message is already decrypted
      if (
        // legacy messages ( no way to know if they are decrypted or not )
        message.messageObj === undefined ||
        // new messages ( if messageObj is string then it is not decrypted )
        typeof message.messageObj === 'string'
      ) {
        if (!pgpPrivateKey) {
          throw Error('Decrypted private key is necessary');
        }
        if (message.fromCAIP10 !== connectedUser.wallets.split(',')[0]) {
          /**
           * CACHE
           */
          const cacheKey = `pgpPubKey-${message.fromCAIP10}`;
          // Check if the pubkey is already in the cache
          if (cache.has(cacheKey)) {
            signatureValidationPubliKey = cache.get(cacheKey);
          } else {
            // If not in cache, fetch from API
            const otherPeer = await getUser({
              account: message.fromCAIP10,
              env,
            });
            // Cache the pubkey data
            cache.set(cacheKey, otherPeer.publicKey);
            signatureValidationPubliKey = otherPeer.publicKey;
          }
        } else {
          signatureValidationPubliKey = connectedUser.publicKey;
        }
        messages[i] = await decryptAndVerifyMessage(
          message,
          signatureValidationPubliKey,
          pgpPrivateKey,
          env,
          pgpHelper
        );
      }
    }
  }
  return messages;
};

//immediately invoked function expression to maintain latestDIDs
export const addDeprecatedInfo = (() => {
  // mapping for LAtest NFT DIDs
  const latestDIDs: { [key: string]: string } = {};
  return (chats: IFeeds[]): IFeeds[] => {
    chats.forEach((chat) => {
      if (isValidCAIP10NFTAddress(chat.did)) {
        const didWithoutTimestamp = chat.did.split(':').slice(0, 5).join(':');
        const timestamp = chat.did.split(':')[5];
        if (
          !latestDIDs[didWithoutTimestamp] ||
          timestamp > latestDIDs[didWithoutTimestamp].split(':')[5]
        ) {
          latestDIDs[didWithoutTimestamp] = chat.did;
        }
      }
    });
    chats.forEach((chat) => {
      if (isValidCAIP10NFTAddress(chat.did)) {
        const didWithoutTimestamp = chat.did.split(':').slice(0, 5).join(':');
        if (latestDIDs[didWithoutTimestamp] !== chat.did) {
          chat['deprecated'] = true;
          chat['deprecatedCode'] = 'NFT Owner Changed';
        }
      }
    });
    return chats;
  };
})();

//immediately invoked function expression to maintain latestDIDs
export const addDeprecatedInfoToMessages = (() => {
  // mapping for LAtest NFT DIDs
  const latestDIDs: { [key: string]: string } = {};
  return (chats: IMessageIPFS[]): IMessageIPFS[] => {
    chats.forEach((chat) => {
      if (isValidCAIP10NFTAddress(chat.fromDID)) {
        const didWithoutTimestamp = chat.fromDID
          .split(':')
          .slice(0, 5)
          .join(':');
        const timestamp = chat.fromDID.split(':')[5];
        if (
          !latestDIDs[didWithoutTimestamp] ||
          timestamp > latestDIDs[didWithoutTimestamp].split(':')[5]
        ) {
          latestDIDs[didWithoutTimestamp] = chat.fromDID;
        }
      }
    });
    chats.forEach((chat) => {
      if (isValidCAIP10NFTAddress(chat.fromDID)) {
        const didWithoutTimestamp = chat.fromDID
          .split(':')
          .slice(0, 5)
          .join(':');
        if (latestDIDs[didWithoutTimestamp] !== chat.fromDID) {
          chat['deprecated'] = true;
          chat['deprecatedCode'] = 'NFT Owner Changed';
        }
      }
    });
    return chats;
  };
})();
