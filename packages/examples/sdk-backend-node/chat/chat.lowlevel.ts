import * as PushAPI from '@pushprotocol/restapi';
import { createSocketConnection, EVENTS } from '@pushprotocol/socket';
import { ethers } from 'ethers';
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';
import { ENV } from '../types';
import { config } from '../config';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { createWalletClient, http } from 'viem';
import { sepolia } from 'viem/chains';

// CONFIGS
const { env, showAPIResponse } = config;

/***************** SAMPLE SIGNER GENERATION *********************/
/**
 * USING VIEM
 */
// Random Wallet Signers
const signer = createWalletClient({
  account: privateKeyToAccount(generatePrivateKey()),
  chain: sepolia,
  transport: http(),
});
const signerAddress = signer.account.address;
const secondSigner = createWalletClient({
  account: privateKeyToAccount(generatePrivateKey()),
  chain: sepolia,
  transport: http(),
});
const secondSignerAddress = secondSigner.account.address;
// Dummy Wallet Addresses
const randomWallet1 = privateKeyToAccount(generatePrivateKey()).address;
const randomWallet2 = privateKeyToAccount(generatePrivateKey()).address;
const randomWallet3 = privateKeyToAccount(generatePrivateKey()).address;

/**
 * USING ETHERS
 */
// // Random Wallet Signers
// const signer = ethers.Wallet.createRandom();
// const signerAddress = signer.address;
// const secondSigner = ethers.Wallet.createRandom();
// const secondSignerAddress = secondSigner.address;
// // Dummy Wallet Addresses
// const randomWallet1 = ethers.Wallet.createRandom().address;
// const randomWallet2 = ethers.Wallet.createRandom().address;
// const randomWallet3 = ethers.Wallet.createRandom().address;

/************************************************************* */

// Group Chat Data
const groupName = uniqueNamesGenerator({
  dictionaries: [adjectives, colors, animals],
});
const groupDescription = uniqueNamesGenerator({
  dictionaries: [adjectives, colors, animals],
});
const groupImage =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==';

// Push Chat - Run Chat Use cases
export const runChatLowlevelUseCases = async (): Promise<void> => {
  console.log('PushAPI.user.create');
  await PushAPI_user_create();

  console.log('PushAPI.user.get');
  await PushAPI_user_get();

  console.log('PushAPI_chat_decryptPGPKey');
  await PushAPI_chat_decryptPGPKey();

  console.log('PushAPI.chat.chats');
  await PushAPI_chat_chats();

  console.log('PushAPI.chat.requests');
  await PushAPI_chat_requests();

  console.log('PushAPI.chat.send');
  const TargetChatId = await PushAPI_chat_send();

  console.log('PushAPI.chat.approve');
  await PushAPI_chat_approve();

  console.log('PushAPI chat Video call Notification');
  await PushAPI_chat_video_call_notification(TargetChatId);

  console.log('PushAPI.chat.createGroup');
  const { chatId, name } = await PushAPI_chat_createGroup();

  console.log('PushAPI.chat.conversationHash');
  await PushAPI_chat_conversationHash();

  console.log('PushAPI_chat_history');
  await PushAPI_chat_history();

  console.log('PushAPI.chat.latest');
  await PushAPI_chat_latest();

  console.log('PushAPI.chat.updateGroup');
  await PushAPI_chat_updateGroup(chatId);

  console.log('PushAPI.chat.getGroupByName');
  await PushAPI_chat_getGroupByName(name);

  console.log('PushAPI.chat.getGroup');
  await PushAPI_chat_getGroup(chatId);

  console.log('PushAPI.chat.decryptConversation');
  await PushAPI_chat_decryptConversation();

  console.log('Push Chat - PushSDKSocket()');
  await PushChatSDKSocket();
};

// Push Chat - PushAPI.user.create
async function PushAPI_user_create(silent = !showAPIResponse) {
  const user = await PushAPI.user.create({
    signer: signer,
    env: env as ENV,
  });

  const user_2 = await PushAPI.user.create({
    signer: secondSigner,
    env: env as ENV,
  });

  console.log('PushAPI_user_create | Response - 200 OK');
  if (!silent) {
    console.log(user);
    console.log(user_2);
  }

  return user;
}

// Push Chat - PushAPI.user.get
async function PushAPI_user_get(silent = !showAPIResponse) {
  const user = await PushAPI.user.get({
    account: `eip155:${signerAddress}`,
    env: env as ENV,
  });

  console.log('PushAPI_user_get | Response - 200 OK');

  if (!silent) {
    console.log(user);
  }
}

// Push Chat - PushAPI.chat.decryptPGPKey
async function PushAPI_chat_decryptPGPKey(silent = !showAPIResponse) {
  // get user and derive encrypted PGP key
  const user = await PushAPI.user.get({
    account: `eip155:${signerAddress}`,
    env: env as ENV,
  });

  // decrypt the PGP Key
  const pgpKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,

    signer: signer,
  });

  console.log('PushAPI_chat_decryptPGPKey | Response - 200 OK');
  if (!silent) {
    console.log(pgpKey);
  }
}

// Push Chat - PushAPI.chat.chats
async function PushAPI_chat_chats(silent = !showAPIResponse) {
  // Fetch user
  const user = await PushAPI.user.get({
    account: `eip155:${signerAddress}`,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,

    signer: signer,
  });

  // Actual api
  const response = await PushAPI.chat.chats({
    account: `eip155:${signerAddress}`,
    toDecrypt: true,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  console.log('PushAPI_chat_chats | Response - 200 OK');
  if (!silent) {
    console.log(response);
  }
}

// Push Chat - PushAPI.chat.requests
async function PushAPI_chat_requests(silent = !showAPIResponse) {
  // Fetch user
  const user = await PushAPI.user.get({
    account: `eip155:${signerAddress}`,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,

    signer: signer,
  });

  // Actual api
  const response = await PushAPI.chat.requests({
    account: `eip155:${signerAddress}`,
    toDecrypt: true,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  console.log('PushAPI_chat_requests | Response - 200 OK');
  if (!silent) {
    console.log(response);
  }
}

// Push Chat - PushAPI.chat.conversationHash
async function PushAPI_chat_conversationHash(silent = !showAPIResponse) {
  // conversation hash are also called link inside chat messages
  const conversationHash = await PushAPI.chat.conversationHash({
    account: `eip155:${signerAddress}`,
    conversationId: `eip155:${secondSignerAddress}`, // 2nd address
    env: env as ENV,
  });

  console.log('PushAPI_chat_conversationHash | Response - 200 OK');
  if (!silent) {
    console.log(conversationHash);
  }
}

// Push Chat - PushAPI.chat.latest
async function PushAPI_chat_latest(silent = !showAPIResponse) {
  // Fetch user
  const user = await PushAPI.user.get({
    account: `eip155:${signerAddress}`,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,

    signer: signer,
  });

  // Fetch conversation hash
  // conversation hash are also called link inside chat messages
  const conversationHash = await PushAPI.chat.conversationHash({
    account: `eip155:${signerAddress}`,
    conversationId: `eip155:${secondSignerAddress}`, // 2nd address
    env: env as ENV,
  });

  // Actual API
  const response = await PushAPI.chat.latest({
    threadhash: conversationHash.threadHash, // get conversation hash from conversationHash function and send the response threadhash here
    account: `eip155:${signerAddress}`,
    toDecrypt: true,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  console.log('PushAPI_chat_latest | Response - 200 OK');
  if (!silent) {
    console.log(response);
  }
}

// Push Chat - PushAPI.chat.history
async function PushAPI_chat_history(silent = !showAPIResponse) {
  // Fetch user
  const user = await PushAPI.user.get({
    account: `eip155:${signerAddress}`,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,

    signer: signer,
  });

  // Fetch conversation hash
  // conversation hash are also called link inside chat messages
  const conversationHash = await PushAPI.chat.conversationHash({
    account: `eip155:${signerAddress}`,
    conversationId: `eip155:${secondSignerAddress}`, // 2nd address
    env: env as ENV,
  });

  // Actual API
  const response = await PushAPI.chat.history({
    threadhash: conversationHash.threadHash, // get conversation hash from conversationHash function and send the response threadhash here
    account: `eip155:${signerAddress}`,
    limit: 5,
    toDecrypt: true,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  console.log('PushAPI_chat_history | Response - 200 OK');
  if (!silent) {
    console.log(response);
  }
}

// Push Chat - PushAPI.chat.send
// // Will send a message to the user or chat request in case user hasn't approved them
async function PushAPI_chat_send(silent = !showAPIResponse) {
  // Fetch user
  const user = await PushAPI.user.get({
    account: `eip155:${signerAddress}`,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,

    signer: signer,
  });

  // Actual api
  const response = await PushAPI.chat.send({
    messageObj: {
      content: "Gm gm! It's me... Mario",
    },
    messageType: 'Text', // can be "Text" | "Image" | "File" | "GIF"
    receiverAddress: secondSignerAddress,

    signer: signer,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  console.log('PushAPI_chat_send | Response - 200 OK');
  if (!silent) {
    console.log(response);
  }
  return response.chatId;
}

// Push Chat - Approve
async function PushAPI_chat_approve(silent = !showAPIResponse) {
  // Fetch user
  const user = await PushAPI.user.get({
    account: `eip155:${secondSignerAddress}`,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,

    signer: secondSigner,
  });

  // Actual api
  const approve = await PushAPI.chat.approve({
    status: 'Approved',
    senderAddress: signerAddress, // receiver's address or chatId of a group

    signer: secondSigner,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  console.log('PushAPI_chat_approve | Response - 200 OK');
  if (!silent) {
    console.log(approve);
  }
}

// Push Chat - PushAPI.chat.createGroup
async function PushAPI_chat_createGroup(
  silent = !showAPIResponse
): Promise<{ chatId: string; name: string }> {
  // Fetch user
  const user = await PushAPI.user.get({
    account: `eip155:${signerAddress}`,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,

    signer: signer,
  });

  // Actual API
  // Convert image to base 64 and pass
  const response = await PushAPI.chat.createGroup({
    groupName,
    groupDescription,
    members: [`eip155:${randomWallet1}`, `eip155:${randomWallet2}`],
    groupImage,
    admins: [], // takes signer as admin automatically, add more if you want to
    isPublic: true,

    signer: signer,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  console.log('PushAPI_chat_createGroup | Response - 200 OK');
  if (!silent) {
    console.log(response);
  }
  return { chatId: response.chatId, name: response.groupName };
}

// Push Chat - PushAPI.chat.updateGroup
async function PushAPI_chat_updateGroup(
  chatId: string,
  silent = !showAPIResponse
) {
  // Fetch user
  const user = await PushAPI.user.get({
    account: `eip155:${signerAddress}`,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,

    signer: signer,
  });

  // Actual API
  // Convert image to base 64 and pass
  // This is an idempotent operation, meaning it requires all group info to be passed no matter if only few things change
  // Why so? To ensure that verificationProof always is able to replicate the current group info (trustless since signature is stored with the info)
  const response = await PushAPI.chat.updateGroup({
    chatId,
    groupName,
    groupDescription,
    members: [
      `eip155:${randomWallet1}`,
      `eip155:${randomWallet2}`,
      `eip155:${randomWallet3}`,
      `eip155:${signerAddress}`,
    ],
    groupImage,
    admins: [`eip155:${signerAddress}`], // takes signer as admin automatically, add more if you want to

    signer: signer,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  console.log('PushAPI_chat_updateGroup | Response - 200 OK');
  if (!silent) {
    console.log(response);
  }
}

// Push Chat - PushAPI.chat.getGroupByName
async function PushAPI_chat_getGroupByName(
  name: string,
  silent = !showAPIResponse
) {
  const response = await PushAPI.chat.getGroupByName({
    groupName: name,
    env: env as ENV,
  });

  console.log('PushAPI_chat_getGroupByName | Response - 200 OK');
  if (!silent) {
    console.log(response);
  }
}

// Push Chat - PushAPI.chat.getGroup
async function PushAPI_chat_getGroup(
  chatId: string,
  silent = !showAPIResponse
) {
  const response = await PushAPI.chat.getGroup({
    chatId: chatId,
    env: env as ENV,
  });

  console.log('PushAPI_chat_getGroup | Response - 200 OK');
  if (!silent) {
    console.log(response);
  }
}

// Push Chat - PushAPI.chat.decryptConversation
async function PushAPI_chat_decryptConversation(silent = !showAPIResponse) {
  // Fetch user
  const user = await PushAPI.user.get({
    account: `eip155:${signerAddress}`,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,

    signer: signer,
  });

  // Fetch conversation hash
  // conversation hash are also called link inside chat messages
  const conversationHash = await PushAPI.chat.conversationHash({
    account: `eip155:${signerAddress}`,
    conversationId: `eip155:${secondSignerAddress}`, // 2nd address
    env: env as ENV,
  });

  // Chat History
  const encryptedChats = await PushAPI.chat.history({
    threadhash: conversationHash.threadHash, // get conversation hash from conversationHash function and send the response threadhash here
    account: `eip155:${signerAddress}`,
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

  console.log('PushAPI_chat_decryptConversation | Response - 200 OK');
  if (!silent) {
    console.log(decryptedChat);
  }
}

// Push Chat - Socket Connection
async function PushChatSDKSocket(silent = !showAPIResponse) {
  const pushSDKSocket = createSocketConnection({
    user: `eip155:${signerAddress}`,
    socketType: 'chat',
    socketOptions: { autoConnect: true, reconnectionAttempts: 3 },
    env: env as ENV,
  });

  if (!pushSDKSocket) {
    throw new Error('Socket not connected');
  }

  pushSDKSocket.on(EVENTS.CONNECT, async () => {
    console.log('Socket Connected - will disconnect after 4 seconds');

    // send a chat from other wallet to this one to see the result
    // Fetch user
    const user = await PushAPI.user.get({
      account: `eip155:${secondSignerAddress}`,
      env: env as ENV,
    });

    // Decrypt PGP Key
    const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
      encryptedPGPPrivateKey: user.encryptedPrivateKey,

      signer: secondSigner,
    });

    // Actual api
    const response = await PushAPI.chat.send({
      messageContent: "Gm gm! It's me... Mario",
      messageType: 'Text',
      receiverAddress: `eip155:${signerAddress}`,

      signer: secondSigner,
      pgpPrivateKey: pgpDecrpyptedPvtKey,
      env: env as ENV,
    });
    console.log('PushAPI_chat_send | Response - 200 OK');
  });

  pushSDKSocket.on(EVENTS.DISCONNECT, () => {
    console.log('Socket Disconnected');
  });

  pushSDKSocket.on(EVENTS.CHAT_RECEIVED_MESSAGE, (message) => {
    // feedItem is the notification data when that notification was received
    console.log('Incoming Push Chat message from Socket');
    if (!silent) {
      console.log(message);
    }

    // disconnect socket after this, not to be done in real implementations
    pushSDKSocket.disconnect();
  });

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  await delay(4000);
}

async function PushAPI_chat_video_call_notification(
  chatId: string,
  silent = !showAPIResponse
) {
  // Fetch user
  const user = await PushAPI.user.get({
    account: signerAddress,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,
    signer: signer,
  });
  // get PGP KEy
  const apiResponse = await PushAPI.payloads.sendNotification({
    senderType: 1,
    signer: signer,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    chatId: chatId,
    type: 3, // target
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
    recipients: secondSignerAddress, // recipient address
    channel: signerAddress, // your channel address
    env: env as ENV,
  });

  console.log('PushAPI.payloads.sendNotification | Response - 204 OK');
  if (!silent) {
    console.log(apiResponse);
  }
}
