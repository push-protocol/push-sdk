import * as PushAPI from '@pushprotocol/restapi';
import { createSocketConnection, EVENTS } from '@pushprotocol/socket';
import * as dotenv from 'dotenv';
import { ethers } from 'ethers';
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';
import { ENV } from '../types';
import { config } from '../config';
dotenv.config();

// CONFIGS
const { env, showAPIResponse } = config;
// Random Wallet Signers
const signer = ethers.Wallet.createRandom();

// NFT Chat Data
const nftChainId1 = process.env.NFT_CHAIN_ID_1;
const nftContractAddress1 = process.env.NFT_CONTRACT_ADDRESS_1;
const nftTokenId1 = process.env.NFT_TOKEN_ID_1;
const nftHolderWalletPrivatekey1 = process.env.NFT_HOLDER_WALLET_PRIVATE_KEY_1;
const nftSigner1 = nftHolderWalletPrivatekey1
  ? new ethers.Wallet(`0x${nftHolderWalletPrivatekey1}`)
  : undefined;
const nftAccount1 = `nft:eip155:${nftChainId1}:${nftContractAddress1}:${nftTokenId1}`;
const nftProfilePassword1 = process.env.NFT_PROFILE_PASSWORD_1;
const nftChainId2 = process.env.NFT_CHAIN_ID_2;
const nftContractAddress2 = process.env.NFT_CONTRACT_ADDRESS_2;
const nftTokenId2 = process.env.NFT_TOKEN_ID_2;
const nftHolderWalletPrivatekey2 = process.env.NFT_HOLDER_WALLET_PRIVATE_KEY_2;
const nftSigner2 = nftHolderWalletPrivatekey2
  ? new ethers.Wallet(`0x${nftHolderWalletPrivatekey2}`)
  : undefined;
const nftAccount2 = `nft:eip155:${nftChainId2}:${nftContractAddress2}:${nftTokenId2}`;
const nftProfilePassword2 = process.env.NFT_PROFILE_PASSWORD_2;
const nftAccount3 = `nft:eip155:${nftChainId2}:${nftContractAddress2}:10`;
// NFT Group Chat Data
const nftGroupName = uniqueNamesGenerator({
  dictionaries: [adjectives, colors, animals],
});
const updatedNftGroupName = uniqueNamesGenerator({
  dictionaries: [adjectives, colors, animals],
});
const groupDescription = uniqueNamesGenerator({
  dictionaries: [adjectives, colors, animals],
});
const groupImage =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==';

const skipExample = () => {
  const requiredEnvVars = [
    'NFT_CHAIN_ID_1',
    'NFT_CONTRACT_ADDRESS_1',
    'NFT_TOKEN_ID_1',
    'NFT_HOLDER_WALLET_PRIVATE_KEY_1',
    'NFT_PROFILE_PASSWORD_1',
    'NFT_CHAIN_ID_2',
    'NFT_CONTRACT_ADDRESS_2',
    'NFT_TOKEN_ID_2',
    'NFT_HOLDER_WALLET_PRIVATE_KEY_2',
    'NFT_PROFILE_PASSWORD_2',
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      return true; // Skip the example if any of the required env vars is missing
    }
  }

  return false; // All required env vars are present, don't skip the example
};

// Push Chat - Run Chat Use cases
export const runNFTChatLowLevelUseCases = async (): Promise<void> => {
  if (skipExample()) {
    console.warn('Skipping examples as required env vars are missing');
    return;
  }

  console.debug('PushAPI.user.create');
  await PushAPI_nft_user_create();

  console.debug('PushAPI.user.get');
  await PushAPI_nft_user_get();

  console.debug('PushAPI_chat_decryptPGPKey');
  await PushAPI_nft_chat_decryptPGPKey();

  console.debug('PushAPI.chat.chats');
  await PushAPI_nft_chat_chats();

  console.debug('PushAPI.chat.requests');
  await PushAPI_nft_chat_requests();

  console.debug('PushAPI.chat.send');
  const TargetchatId = await PushAPI_nft_chat_send();

  console.debug('PushAPI.chat.approve');
  await PushAPI_nft_chat_approve();

  console.debug('NFT Video Call Notification');
  await PushAPI_nft_chat_video_call_notification(TargetchatId);

  console.debug('PushAPI.chat.createGroup');
  const chatId = await PushAPI_nft_chat_createGroup();

  console.debug('PushAPI.chat.conversationHash');
  await PushAPI_nft_chat_conversationHash();

  console.debug('PushAPI_chat_history');
  await PushAPI_nft_chat_history();

  console.debug('PushAPI.chat.latest');
  await PushAPI_nft_chat_latest();

  console.debug('PushAPI.chat.updateGroup');
  await PushAPI_nft_chat_updateGroup(chatId);

  console.debug('PushAPI.chat.getGroupByName');
  await PushAPI_nft_chat_getGroupByName(updatedNftGroupName);

  console.debug('PushAPI.chat.getGroup');
  await PushAPI_nft_chat_getGroup(chatId);

  console.debug('PushAPI.chat.decryptConversation');
  await PushAPI_nft_chat_decryptConversation();

  console.debug('Push Chat - PushSDKSocket()');
  await PushNFTChatSDKSocket();
};

// Push Chat - PushAPI.user.create
async function PushAPI_nft_user_create(silent = !showAPIResponse) {
  const user1 = await PushAPI.user.create({
    account: nftAccount1,
    signer: nftSigner1,
    env: env as ENV,
    additionalMeta: { NFTPGP_V1: { password: nftProfilePassword1 as string } },
  });

  const user2 = await PushAPI.user.create({
    account: nftAccount2,
    signer: nftSigner2,
    env: env as ENV,
    additionalMeta: { NFTPGP_V1: { password: nftProfilePassword2 as string } },
  });

  console.debug('PushAPI_nft_user_create | Response - 200 OK');
  if (!silent) {
    console.info(user1);
    console.info(user2);
  }
}

// Push Chat - PushAPI.user.get
async function PushAPI_nft_user_get(silent = !showAPIResponse) {
  const user = await PushAPI.user.get({
    account: nftAccount1,
    env: env as ENV,
  });

  console.debug('PushAPI_nft_user_get | Response - 200 OK');

  if (!silent) {
    console.info(user);
  }
}

// Push Chat - PushAPI.chat.decryptPGPKey
async function PushAPI_nft_chat_decryptPGPKey(silent = !showAPIResponse) {
  // get user and derive encrypted PGP key
  const user = await PushAPI.user.get({
    account: nftAccount1,
    env: env as ENV,
  });

  // decrypt the PGP Key
  const pgpKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,
    account: nftAccount1,
    signer: nftSigner1,
  });

  console.debug('PushAPI_nft_chat_decryptPGPKey | Response - 200 OK');
  if (!silent) {
    console.info(pgpKey);
  }
}

// Push Chat - PushAPI.chat.chats
async function PushAPI_nft_chat_chats(silent = !showAPIResponse) {
  // Fetch user
  const user = await PushAPI.user.get({
    account: nftAccount1,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,

    signer: nftSigner1,
  });

  // Actual api
  const response = await PushAPI.chat.chats({
    account: nftAccount1,
    toDecrypt: true,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  console.debug('PushAPI_nft_chat_chats | Response - 200 OK');
  if (!silent) {
    console.info(response);
  }
}

// Push Chat - PushAPI.chat.requests
async function PushAPI_nft_chat_requests(silent = !showAPIResponse) {
  // Fetch user
  const user = await PushAPI.user.get({
    account: nftAccount1,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,

    signer: nftSigner1,
  });

  // Actual api
  const response = await PushAPI.chat.requests({
    account: nftAccount1,
    toDecrypt: true,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  console.debug('PushAPI_nft_chat_requests | Response - 200 OK');
  if (!silent) {
    console.info(response);
  }
}

// Push Chat - PushAPI.chat.conversationHash
async function PushAPI_nft_chat_conversationHash(silent = !showAPIResponse) {
  // conversation hash are also called link inside chat messages
  const conversationHash = await PushAPI.chat.conversationHash({
    account: nftAccount1,
    conversationId: nftAccount2, // 2nd address
    env: env as ENV,
  });

  console.debug('PushAPI_nft_chat_conversationHash | Response - 200 OK');
  if (!silent) {
    console.info(conversationHash);
  }
}

// Push Chat - PushAPI.chat.latest
async function PushAPI_nft_chat_latest(silent = !showAPIResponse) {
  // Fetch user
  const user = await PushAPI.user.get({
    account: nftAccount1,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,
    signer: nftSigner1,
  });

  // Fetch conversation hash
  // conversation hash are also called link inside chat messages
  const conversationHash = await PushAPI.chat.conversationHash({
    account: nftAccount1,
    conversationId: nftAccount2, // 2nd address
    env: env as ENV,
  });

  // Actual API
  const response = await PushAPI.chat.latest({
    threadhash: conversationHash.threadHash, // get conversation hash from conversationHash function and send the response threadhash here
    account: nftAccount1,
    toDecrypt: true,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  console.debug('PushAPI_nft_chat_latest | Response - 200 OK');
  if (!silent) {
    console.info(response);
  }
}

// Push Chat - PushAPI.chat.history
async function PushAPI_nft_chat_history(silent = !showAPIResponse) {
  // Fetch user
  const user = await PushAPI.user.get({
    account: nftAccount1,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,
    signer: nftSigner1,
  });

  // Fetch conversation hash
  // conversation hash are also called link inside chat messages
  const conversationHash = await PushAPI.chat.conversationHash({
    account: nftAccount1,
    conversationId: nftAccount2, // 2nd address
    env: env as ENV,
  });

  // Actual API
  const response = await PushAPI.chat.history({
    threadhash: conversationHash.threadHash, // get conversation hash from conversationHash function and send the response threadhash here
    account: nftAccount1,
    limit: 5,
    toDecrypt: true,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  console.debug('PushAPI_nft_chat_history | Response - 200 OK');
  if (!silent) {
    console.info(response);
  }
}

// Push Chat - PushAPI.chat.send
// // Will send a message to the user or chat request in case user hasn't approved them
async function PushAPI_nft_chat_send(silent = !showAPIResponse) {
  // Fetch user
  const user = await PushAPI.user.get({
    account: nftAccount1,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,
    signer: nftSigner1,
  });

  // Actual api
  const response = await PushAPI.chat.send({
    messageObj: {
      content: "Gm gm! It's me... Mario",
    },
    messageType: 'Text', // can be "Text" | "Image" | "File" | "GIF"
    receiverAddress: nftAccount2,
    account: nftAccount1,
    signer: signer,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  console.debug('PushAPI_nft_chat_send | Response - 200 OK');
  if (!silent) {
    console.info(response);
  }
  return response.chatId;
}

// Push Chat - Approve
async function PushAPI_nft_chat_approve(silent = !showAPIResponse) {
  // Fetch user
  const user = await PushAPI.user.get({
    account: nftAccount2,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,

    signer: nftSigner2,
  });

  // Actual api
  const approve = await PushAPI.chat.approve({
    status: 'Approved',
    senderAddress: nftAccount1, // receiver's address or chatId of a group
    account: nftAccount2,
    signer: nftSigner2,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  console.debug('PushAPI_nft_chat_approve | Response - 200 OK');
  if (!silent) {
    console.info(approve);
  }
}

async function PushAPI_nft_chat_video_call_notification(
  chatId: string,
  silent = !showAPIResponse
) {
  // Fetch user
  const user = await PushAPI.user.get({
    account: nftAccount1,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,
    signer: nftSigner1,
  });

  const apiResponse = await PushAPI.payloads.sendNotification({
    senderType: 1,
    signer: nftSigner1,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    chatId: chatId,
    type: 1, // target
    identityType: 2, // direct payload
    notification: {
      title: `VC TITLE:`,
      body: `VC BODY`,
    },
    payload: {
      title: `payload title`,
      body: `sample msg body`,
      cta: '',
      img: '',
      additionalMeta: {
        type: '1+1',
        data: 'Random DATA',
        domain: 'push.org',
      },
    },
    recipients: nftAccount1, // recipient address
    channel: nftAccount1, // your channel address
    env: env as ENV,
  });

  console.debug('PushAPI.payloads.sendNotification | Response - 204 OK');
  if (!silent) {
    console.info(apiResponse);
  }
}

// Push Chat - PushAPI.chat.createGroup
async function PushAPI_nft_chat_createGroup(
  silent = !showAPIResponse
): Promise<string> {
  // Fetch user
  const user = await PushAPI.user.get({
    account: nftAccount1,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,

    signer: nftSigner1,
  });

  // Actual API
  // Convert image to base 64 and pass
  const response = await PushAPI.chat.createGroup({
    groupName: nftGroupName,
    groupDescription,
    members: [nftAccount2, nftAccount3],
    groupImage,
    admins: [], // takes signer as admin automatically, add more if you want to
    isPublic: true,
    account: nftAccount1,
    signer: signer,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  console.debug('PushAPI_nft_chat_createGroup | Response - 200 OK');
  if (!silent) {
    console.info(response);
  }
  return response.chatId;
}

// Push Chat - PushAPI.chat.updateGroup
async function PushAPI_nft_chat_updateGroup(
  chatId: string,
  silent = !showAPIResponse
) {
  // Fetch user
  const user = await PushAPI.user.get({
    account: nftAccount1,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,

    signer: nftSigner1,
  });

  // Actual API
  // Convert image to base 64 and pass
  // This is an idempotent operation, meaning it requires all group info to be passed no matter if only few things change
  // Why so? To ensure that verificationProof always is able to replicate the current group info (trustless since signature is stored with the info)
  const response = await PushAPI.chat.updateGroup({
    chatId,
    groupName: updatedNftGroupName,
    groupDescription,
    members: [nftAccount2, nftAccount3, nftAccount1],
    groupImage,
    admins: [nftAccount1],
    account: nftAccount1,
    signer: nftSigner1,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  console.debug('PushAPI_nft_chat_updateGroup | Response - 200 OK');
  if (!silent) {
    console.info(response);
  }
}

// Push Chat - PushAPI.chat.getGroupByName
async function PushAPI_nft_chat_getGroupByName(
  name: string,
  silent = !showAPIResponse
) {
  const response = await PushAPI.chat.getGroupByName({
    groupName: name,
    env: env as ENV,
  });

  console.debug('PushAPI_nft_chat_getGroupByName | Response - 200 OK');
  if (!silent) {
    console.info(response);
  }
}

// Push Chat - PushAPI.chat.getGroup
async function PushAPI_nft_chat_getGroup(
  chatId: string,
  silent = !showAPIResponse
) {
  const response = await PushAPI.chat.getGroup({
    chatId: chatId,
    env: env as ENV,
  });

  console.debug('PushAPI_nft_chat_getGroup | Response - 200 OK');
  if (!silent) {
    console.info(response);
  }
}

// Push Chat - PushAPI.chat.decryptConversation
async function PushAPI_nft_chat_decryptConversation(silent = !showAPIResponse) {
  // Fetch user
  const user = await PushAPI.user.get({
    account: nftAccount1,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,

    signer: nftSigner1,
  });

  // Fetch conversation hash
  // conversation hash are also called link inside chat messages
  const conversationHash = await PushAPI.chat.conversationHash({
    account: nftAccount1,
    conversationId: nftAccount2, // 2nd address
    env: env as ENV,
  });

  // Chat History
  const encryptedChats = await PushAPI.chat.history({
    threadhash: conversationHash.threadHash, // get conversation hash from conversationHash function and send the response threadhash here
    account: nftAccount1,
    limit: 5,
    toDecrypt: false,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  // Decrypted Chat
  const decryptedChat = await PushAPI.chat.decryptConversation({
    messages: encryptedChats, // array of message object fetched from chat.history method
    connectedUser: user, // user meta data object fetched from chat.get method
    pgpPrivateKey: pgpDecrpyptedPvtKey, //decrypted private key
    env: env as ENV,
  });

  console.debug('PushAPI_nft_chat_decryptConversation | Response - 200 OK');
  if (!silent) {
    console.info(decryptedChat);
  }
}

// Push Chat - Socket Connection
async function PushNFTChatSDKSocket(silent = !showAPIResponse) {
  const pushSDKSocket = createSocketConnection({
    user: nftAccount1,
    socketType: 'chat',
    socketOptions: { autoConnect: true, reconnectionAttempts: 3 },
    env: env as ENV,
  });

  if (!pushSDKSocket) {
    throw new Error('Socket not connected');
  }

  pushSDKSocket.on(EVENTS.CONNECT, async () => {
    console.debug('Socket Connected - will disconnect after 4 seconds');

    // send a chat from other wallet to this one to see the result
    // Fetch user
    const user = await PushAPI.user.get({
      account: nftAccount1,
      env: env as ENV,
    });

    // Decrypt PGP Key
    const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
      encryptedPGPPrivateKey: user.encryptedPrivateKey,

      signer: nftSigner1,
    });

    // Actual api
    const response = await PushAPI.chat.send({
      messageContent: "Gm gm! It's me... Mario",
      messageType: 'Text',
      receiverAddress: nftAccount2,
      account: nftAccount1,
      signer: nftSigner1,
      pgpPrivateKey: pgpDecrpyptedPvtKey,
      env: env as ENV,
    });
    console.debug('PushAPI_nft_chat_send | Response - 200 OK');
  });

  pushSDKSocket.on(EVENTS.DISCONNECT, () => {
    console.debug('Socket Disconnected');
  });

  pushSDKSocket.on(EVENTS.CHAT_RECEIVED_MESSAGE, (message) => {
    // feedItem is the notification data when that notification was received
    console.debug('Incoming Push Chat message from Socket');
    if (!silent) {
      console.info(message);
    }

    // disconnect socket after this, not to be done in real implementations
    pushSDKSocket.disconnect();
  });

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  await delay(4000);
}
