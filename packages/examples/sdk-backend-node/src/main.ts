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
dotenv.config();

enum ENV {
  PROD = 'prod',
  STAGING = 'staging',
  DEV = 'dev',
  /**
   * **This is for local development only**
   */
  LOCAL = 'local',
}

// CONFIGS
const env = process.env.PUSH_NODE_NETWORK; // choose ENV.STAGING or ENV.PROD
const showAPIResponse = process.env.SHOW_API_RESPONSE === 'true' ? true : false; // choose to show or hide API responses

// If you own a channel, you can use your channel address as well
const channelPrivateKey: string = process.env.WALLET_PRIVATE_KEY!;
const signerChannel = new ethers.Wallet(`0x${channelPrivateKey}`);
const channelAddress = signerChannel.address;

// Addresses that will be used to
const signer = ethers.Wallet.createRandom();
const signerSecondAccount = ethers.Wallet.createRandom();

// generate some dummy wallets as well
const randomWallet1 = ethers.Wallet.createRandom().address;
const randomWallet2 = ethers.Wallet.createRandom().address;
const randomWallet3 = ethers.Wallet.createRandom().address;

// Group Chat Data
const groupName = uniqueNamesGenerator({
  dictionaries: [adjectives, colors, animals],
});
const groupDescription = uniqueNamesGenerator({
  dictionaries: [adjectives, colors, animals],
});
const groupImage =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==';

const spaceName = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
  });

const spaceDescription = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
  });

const spaceImage =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==';


// NFT Chat Data
const nftChainId1 = process.env.NFT_CHAIN_ID_1;
const nftContractAddress1 = process.env.NFT_CONTRACT_ADDRESS_1;
const nftTokenId1 = process.env.NFT_TOKEN_ID_1;
const nftHolderWalletPrivatekey1 = process.env.NFT_HOLDER_WALLET_PRIVATE_KEY_1;
const nftSigner1 = new ethers.Wallet(`0x${nftHolderWalletPrivatekey1}`);
const nftAccount1 = `nft:eip155:${nftChainId1}:${nftContractAddress1}:${nftTokenId1}`;
const nftProfilePassword1 = process.env.NFT_PROFILE_PASSWORD_1;
const nftChainId2 = process.env.NFT_CHAIN_ID_2;
const nftContractAddress2 = process.env.NFT_CONTRACT_ADDRESS_2;
const nftTokenId2 = process.env.NFT_TOKEN_ID_2;
const nftHolderWalletPrivatekey2 = process.env.NFT_HOLDER_WALLET_PRIVATE_KEY_2;
const nftSigner2 = new ethers.Wallet(`0x${nftHolderWalletPrivatekey2}`);
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

// Video Data
const videoChainId = +process.env.VIDEO_CHAIN_ID;
let videoData = PushAPI.video.initVideoCallData;
const videoSetData: (
  fn: (data: PushAPI.VideoCallData) => PushAPI.VideoCallData
) => void = (fn) => {
  videoData = fn(videoData);
};
let videoObject = null;
const videoLocalStream = null; // get the local stream
const videoSenderAddress = process.env.VIDEO_SENDER_ADDRESS;
const videoRecipientAddress = process.env.VIDEO_RECIPEINT_ADDRESS;
const videoChatId = process.env.VIDEO_CHAT_ID;
let videoSignalData_1 = null;

// Push Notification - Run Notifications Use cases
async function runNotificaitonsUseCases() {
  console.log(`
  ███    ██  ██████  ████████ ██ ███████ ██  ██████  █████  ████████ ██  ██████  ███    ██ ███████
  ████   ██ ██    ██    ██    ██ ██      ██ ██      ██   ██    ██    ██ ██    ██ ████   ██ ██
  ██ ██  ██ ██    ██    ██    ██ █████   ██ ██      ███████    ██    ██ ██    ██ ██ ██  ██ ███████
  ██  ██ ██ ██    ██    ██    ██ ██      ██ ██      ██   ██    ██    ██ ██    ██ ██  ██ ██      ██
  ██   ████  ██████     ██    ██ ██      ██  ██████ ██   ██    ██    ██  ██████  ██   ████ ███████
`);
  console.log('PushAPI.user.getFeeds');
  await PushAPI_user_getFeeds();

  console.log('PushAPI.user.getFeeds [Spam]');
  await PushAPI_user_getFeeds__spam();

  console.log('PushAPI.user.getSubscriptions');
  await PushAPI_user_getSubscriptions();

  console.log('PushAPI.channels.getChannel()');
  await PushAPI_channels_getChannel();

  console.log('PushAPI.channels.search()');
  await PushAPI_channels_search();

  console.log('PushAPI.channels.subscribe()');
  await PushAPI_channels_subscribe();

  console.log('PushAPI.channels.unsubscribe()');
  await PushAPI_channels_unsubscribe();

  // IMPORTANT: VARIOUS OTHER NOTIFICATIONS FORMAT SUPPORTED
  // EXAMPLES HERE: https://github.com/ethereum-push-notification-service/push-sdk/blob/main/packages/restapi/README.md
  console.log(
    'PushAPI.payloads.sendNotification() [Direct Payload, Single Recipient]'
  );
  await PushAPI_payloads_sendNotification__direct_payload_single_recipient();

  console.log(
    'PushAPI.payloads.sendNotification() [Direct Payload, Batch of Recipients (Subset)]'
  );
  await PushAPI_payloads_sendNotification__direct_payload_group_of_recipient_subset();

  console.log(
    'PushAPI.payloads.sendNotification() [Direct Payload, All Recipients (Broadcast)]'
  );
  await PushAPI_payloads_sendNotification__direct_payload_all_recipients_brodcast();

  console.log('PushAPI.channels._getSubscribers()');
  await PushAPI_channels_getSubscribers();

  console.log('Push Notification - PushSDKSocket()');
  await PushSDKSocket();
}

// Push Notification - PushAPI.user.getFeeds
async function PushAPI_user_getFeeds(silent = !showAPIResponse) {
  const notifications = await PushAPI.user.getFeeds({
    user: `eip155:5:${signer.address}`, // user address in CAIP
    env: env as ENV,
  });

  console.log('PushAPI.user.getFeeds | Response - 200 OK');
  if (!silent) {
    console.log(notifications);
  }
}

// Push Notification - PushAPI.user.getFeeds - Spam
async function PushAPI_user_getFeeds__spam(silent = !showAPIResponse) {
  const notifications = await PushAPI.user.getFeeds({
    user: `eip155:5:${signer.address}`, // user address in CAIP
    spam: true,
    env: env as ENV,
  });

  console.log('PushAPI.user.getFeeds [Spam] | Response - 200 OK');
  if (!silent) {
    console.log(notifications);
  }
}

// Push Notification - PushAPI.user.getSubscriptions
async function PushAPI_user_getSubscriptions(silent = !showAPIResponse) {
  const subscriptions = await PushAPI.user.getSubscriptions({
    user: `eip155:5:${signer.address}`, // user address in CAIP
    env: env as ENV,
  });

  console.log('PushAPI.user.getSubscriptions | Response - 200 OK');
  if (!silent) {
    console.log(subscriptions);
  }
}

// Push Notification - PushAPI.channels.getChannel
async function PushAPI_channels_getChannel(silent = !showAPIResponse) {
  const channelData = await PushAPI.channels.getChannel({
    channel: channelAddress,
    env: env as ENV,
  });

  console.log('PushAPI.channels.getChannel | Response - 200 OK');
  if (!silent) {
    console.log(channelData);
  }
}

// Push Notification - PushAPI.channels.search
async function PushAPI_channels_search(silent = !showAPIResponse) {
  const channelsData = await PushAPI.channels.search({
    query: 'push', // a search query
    page: 1, // page index
    limit: 20, // no of items per page
    env: env as ENV,
  });

  console.log('PushAPI.channels.search | Response - 200 OK');
  if (!silent) {
    console.log(channelsData);
  }
}

// Push Notification - PushAPI.channels.subscribe
async function PushAPI_channels_subscribe(silent = !showAPIResponse) {
  const response = await PushAPI.channels.subscribe({
    signer: signer,
    channelAddress: `eip155:5:${channelAddress}`, // channel address in CAIP
    userAddress: `eip155:5:${signer.address}`, // user address in CAIP
    onSuccess: () => {
      console.log('opt in success');
    },
    onError: () => {
      console.error('opt in error');
    },
    env: env as ENV,
  });

  console.log('PushAPI.channels.subscribe | Response - 200 OK');
  if (!silent) {
    console.log(response);
  }
}

// Push Notification - PushAPI.channels.unsubscribe
async function PushAPI_channels_unsubscribe(silent = !showAPIResponse) {
  const response = await PushAPI.channels.unsubscribe({
    signer: signer,
    channelAddress: `eip155:5:${channelAddress}`, // channel address in CAIP
    userAddress: `eip155:5:${signer.address}`, // user address in CAIP
    onSuccess: () => {
      console.log('opt out success');
    },
    onError: () => {
      console.error('opt out error');
    },
    env: env as ENV,
  });

  console.log('PushAPI.channels.unsubscribe | Response - 200 OK');
  if (!silent) {
    console.log(response);
  }
}

// Push Notification - Send Notifications
// Direct payload for single recipient(target)
// PushAPI.payloads.sendNotification
async function PushAPI_payloads_sendNotification__direct_payload_single_recipient(
  silent = !showAPIResponse
) {
  const apiResponse = await PushAPI.payloads.sendNotification({
    signer: signerChannel, // Need to resolve to channel address
    type: 3, // target
    identityType: 2, // direct payload
    notification: {
      title: `notification TITLE:`,
      body: `notification BODY`,
    },
    payload: {
      title: `payload title`,
      body: `sample msg body`,
      cta: '',
      img: '',
    },
    recipients: `eip155:5:${signer.address}`, // recipient address
    channel: `eip155:5:${signerChannel.address}`, // your channel address
    env: env as ENV,
  });

  console.log('PushAPI.payloads.sendNotification | Response - 204 OK');
  if (!silent) {
    console.log(apiResponse);
  }
}

// Push Notification - Direct payload for group of recipients(subset)
// PushAPI.payloads.sendNotification
async function PushAPI_payloads_sendNotification__direct_payload_group_of_recipient_subset(
  silent = !showAPIResponse
) {
  const apiResponse = await PushAPI.payloads.sendNotification({
    signer: signerChannel, // Need to resolve to channel address
    type: 4, // subset
    identityType: 2, // direct payload
    notification: {
      title: `notification TITLE:`,
      body: `notification BODY`,
    },
    payload: {
      title: `payload title`,
      body: `sample msg body`,
      cta: '',
      img: '',
    },
    recipients: [
      `eip155:5:${signer.address}`,
      `eip155:5:${signerSecondAccount.address}`,
    ], // recipient addresses
    channel: `eip155:5:${signerChannel.address}`, // your channel address
    env: env as ENV,
  });

  console.log('PushAPI.payloads.sendNotification | Response - 204 OK');
  if (!silent) {
    console.log(apiResponse);
  }
}

// Push Notification - Direct payload for all recipients(broadcast)
// PushAPI.payloads.sendNotification
async function PushAPI_payloads_sendNotification__direct_payload_all_recipients_brodcast(
  silent = !showAPIResponse
) {
  const apiResponse = await PushAPI.payloads.sendNotification({
    signer: signerChannel, // Needs to resolve to channel address
    type: 1, // broadcast
    identityType: 2, // direct payload
    notification: {
      title: `notification TITLE:`,
      body: `notification BODY`,
    },
    payload: {
      title: `payload title`,
      body: `sample msg body`,
      cta: '',
      img: '',
    },
    channel: `eip155:5:${signerChannel.address}`, // your channel address
    env: env as ENV,
  });

  console.log('PushAPI.payloads.sendNotification | Response - 204 OK');
  if (!silent) {
    console.log(apiResponse);
  }
}

// Push Notification - Get Subscribers list from channels (DEPRECATED)
async function PushAPI_channels_getSubscribers(silent = !showAPIResponse) {
  const subscribers = await PushAPI.channels._getSubscribers({
    channel: `eip155:5:${channelAddress}`, // channel address in CAIP
    env: env as ENV,
  });

  console.log('PushAPI.channels._getSubscribers | Response - 200 OK');
  if (!silent) {
    console.log(subscribers);
  }
}

// Push Notification - Socket Connection
async function PushSDKSocket(silent = !showAPIResponse) {
  const pushSDKSocket = createSocketConnection({
    user: `eip155:5:${signer.address}`, // CAIP, see below
    socketOptions: { autoConnect: false },
    env: env as ENV,
  });

  if (!pushSDKSocket) {
    throw new Error('PushSDKSocket | Socket Connection Failed');
  }

  pushSDKSocket.connect();

  pushSDKSocket.on(EVENTS.CONNECT, async () => {
    console.log('Socket Connected - will disconnect after 4 seconds');

    // send a notification to see the result
    await PushAPI_payloads_sendNotification__direct_payload_single_recipient(
      true
    );
  });

  pushSDKSocket.on(EVENTS.DISCONNECT, () => {
    console.log('Socket Disconnected');
  });

  pushSDKSocket.on(EVENTS.USER_FEEDS, (feedItem) => {
    // feedItem is the notification data when that notification was received
    console.log('Incoming Feed from Socket');
    if (!silent) {
      console.log(feedItem);
    }

    // disconnect socket after this, not to be done in real implementations
    pushSDKSocket.disconnect();
  });

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  await delay(4000);
}

// Push Chat - Run Chat Use cases
async function runChatUseCases() {
  console.log(`
  ██████  ██   ██  █████  ████████
  ██      ██   ██ ██   ██    ██
  ██      ███████ ███████    ██
  ██      ██   ██ ██   ██    ██
  ██████  ██   ██ ██   ██    ██
`);
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
  const chatId = await PushAPI_chat_createGroup();

  console.log('PushAPI.chat.conversationHash');
  await PushAPI_chat_conversationHash();

  console.log('PushAPI_chat_history');
  await PushAPI_chat_history();

  console.log('PushAPI.chat.latest');
  await PushAPI_chat_latest();

  console.log('PushAPI.chat.updateGroup');
  await PushAPI_chat_updateGroup(chatId);

  console.log('PushAPI.chat.getGroupByName');
  await PushAPI_chat_getGroupByName();

  console.log('PushAPI.chat.getGroup');
  await PushAPI_chat_getGroup(chatId);

  console.log('PushAPI.chat.decryptConversation');
  await PushAPI_chat_decryptConversation();

  console.log('Push Chat - PushSDKSocket()');
  await PushChatSDKSocket();
}

// Push Chat - PushAPI.user.create
async function PushAPI_user_create(silent = !showAPIResponse) {
  const user = await PushAPI.user.create({
    signer: signer,
    env: env as ENV,
  });

  const user_2 = await PushAPI.user.create({
    signer: signerSecondAccount,
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
    account: `eip155:${signer.address}`,
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
    account: `eip155:${signer.address}`,
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
    account: `eip155:${signer.address}`,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,

    signer: signer,
  });

  // Actual api
  const response = await PushAPI.chat.chats({
    account: `eip155:${signer.address}`,
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
    account: `eip155:${signer.address}`,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,

    signer: signer,
  });

  // Actual api
  const response = await PushAPI.chat.requests({
    account: `eip155:${signer.address}`,
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
    account: `eip155:${signer.address}`,
    conversationId: `eip155:${signerSecondAccount.address}`, // 2nd address
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
    account: `eip155:${signer.address}`,
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
    account: `eip155:${signer.address}`,
    conversationId: `eip155:${signerSecondAccount.address}`, // 2nd address
    env: env as ENV,
  });

  // Actual API
  const response = await PushAPI.chat.latest({
    threadhash: conversationHash.threadHash, // get conversation hash from conversationHash function and send the response threadhash here
    account: `eip155:${signer.address}`,
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
    account: `eip155:${signer.address}`,
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
    account: `eip155:${signer.address}`,
    conversationId: `eip155:${signerSecondAccount.address}`, // 2nd address
    env: env as ENV,
  });

  // Actual API
  const response = await PushAPI.chat.history({
    threadhash: conversationHash.threadHash, // get conversation hash from conversationHash function and send the response threadhash here
    account: `eip155:${signer.address}`,
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
    account: `eip155:${signer.address}`,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,

    signer: signer,
  });

  // Actual api
  const response = await PushAPI.chat.send({
    messageContent: "Gm gm! It's me... Mario",
    messageType: 'Text', // can be "Text" | "Image" | "File" | "GIF"
    receiverAddress: signerSecondAccount.address,

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
    account: `eip155:${signerSecondAccount.address}`,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,

    signer: signerSecondAccount,
  });

  // Actual api
  const approve = await PushAPI.chat.approve({
    status: 'Approved',
    senderAddress: signer.address, // receiver's address or chatId of a group

    signer: signerSecondAccount,
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
): Promise<string> {
  // Fetch user
  const user = await PushAPI.user.get({
    account: `eip155:${signer.address}`,
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
  return response.chatId;
}

// Push Chat - PushAPI.chat.updateGroup
async function PushAPI_chat_updateGroup(
  chatId: string,
  silent = !showAPIResponse
) {
  // Fetch user
  const user = await PushAPI.user.get({
    account: `eip155:${signer.address}`,
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
      `eip155:${signer.address}`,
    ],
    groupImage,
    admins: [`eip155:${signer.address}`], // takes signer as admin automatically, add more if you want to

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
async function PushAPI_chat_getGroupByName(silent = !showAPIResponse) {
  const response = await PushAPI.chat.getGroupByName({
    groupName: 'Push Group Chat 3',
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
    account: `eip155:${signer.address}`,
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
    account: `eip155:${signer.address}`,
    conversationId: `eip155:${signerSecondAccount.address}`, // 2nd address
    env: env as ENV,
  });

  // Chat History
  const encryptedChats = await PushAPI.chat.history({
    threadhash: conversationHash.threadHash, // get conversation hash from conversationHash function and send the response threadhash here
    account: `eip155:${signer.address}`,
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
    user: `eip155:${signer.address}`,
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
      account: `eip155:${signerSecondAccount.address}`,
      env: env as ENV,
    });

    // Decrypt PGP Key
    const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
      encryptedPGPPrivateKey: user.encryptedPrivateKey,

      signer: signerSecondAccount,
    });

    // Actual api
    const response = await PushAPI.chat.send({
      messageContent: "Gm gm! It's me... Mario",
      messageType: 'Text',
      receiverAddress: `eip155:${signer.address}`,

      signer: signerSecondAccount,
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
    account: signer.address,
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
    recipients: signerSecondAccount.address, // recipient address
    channel: signer.address, // your channel address
    env: env as ENV,
  });

  console.log('PushAPI.payloads.sendNotification | Response - 204 OK');
  if (!silent) {
    console.log(apiResponse);
  }
}


// Push Space - PushAPI.space.create
async function PushAPI_space_create(
  silent = !showAPIResponse
): Promise<string> {
  // Fetch user
  const user = await PushAPI.user.get({
    account: `eip155:${signer.address}`,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,
    signer: signer,
  });

  const response = await PushAPI.space.create({
    spaceName,
    spaceDescription,
    members: [`eip155:${randomWallet1}`, `eip155:${randomWallet2}`],
    spaceImage,
    admins: [],
    isPublic: true,
    signer: signer,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
    scheduleAt: new Date("2023-07-15T14:48:00.000Z"),
    scheduleEnd: new Date("2023-07-15T15:48:00.000Z")
  });
  console.log('PushAPI_chat_createSpace | Response - 200 OK');
  if (!silent) {
    console.log(response);
  }
  return response.spaceId;
}

// Push Space - PushAPI.space.update
async function PushAPI_space_update(
  spaceId: string,
  silent = !showAPIResponse
) {
  // Fetch user
  const user = await PushAPI.user.get({
    account: `eip155:${signer.address}`,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,

    signer: signer,
  });

  // Actual API
  // Convert image to base 64 and pass
  // This is an idempotent operation, meaning it requires all space info to be passed no matter if only few things change
  // Why so? To ensure that verificationProof always is able to replicate the current space info (trustless since signature is stored with the info)
  const response = await PushAPI.space.update({
    spaceId,
    spaceName,
    spaceDescription,
    members: [
      `eip155:${randomWallet1}`,
      `eip155:${randomWallet2}`,
      `eip155:${randomWallet3}`,
      `eip155:${signer.address}`,
    ],
    spaceImage,
    admins: [`eip155:${signer.address}`], // takes signer as admin automatically, add more if you want to
    scheduleAt: new Date("2023-07-15T14:48:00.000Z"),
    scheduleEnd: new Date("2023-07-15T15:48:00.000Z"),
    status: PushAPI.ChatStatus.PENDING,
    signer: signer,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  console.log('PushAPI_space_update | Response - 200 OK');
  if (!silent) {
    console.log(response);
  }
}

// Push Space - PushAPI.space.get
async function PushAPI_space_get(
  spaceId: string,
  silent = !showAPIResponse
) {
  const response = await PushAPI.space.get({
    spaceId: spaceId,
    env: env as ENV,
  });

  console.log('PushAPI_space_get | Response - 200 OK');
  if (!silent) {
    console.log(response);
  }
}

// Push Space - PushAPI.space.start
// Push Space - PushAPI.space.stop
async function PushAPI_space_start_and_stop(
  silent = !showAPIResponse
): Promise<string> {
  // Fetch user
  const user = await PushAPI.user.get({
    account: `eip155:${signer.address}`,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,
    signer: signer,
  });

  const now = new Date();
  const start = new Date(now.getTime() + 10 * 60000)
  const end = new Date(now.getTime() + 60 * 60000);

  const response = await PushAPI.space.create({
    spaceName: uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    }),
    spaceDescription,
    members: [`eip155:${randomWallet1}`, `eip155:${randomWallet2}`],
    spaceImage,
    admins: [],
    isPublic: true,
    signer: signer,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
    scheduleAt: start,  // Sets scheduleAt to the current time + 10 min
    scheduleEnd: end,  // Sets scheduleEnd to 60 minutes from now
  });
  console.log('PushAPI_chat_createSpace | Response - 200 OK');
  if (!silent) {
    console.log(response);
  }

  const spaceId = response.spaceId

    // This is causing bug - Aman to check
  /*response = await PushAPI.space.start({
    spaceId: spaceId,
    env: env as ENV,
    signer: signer,
  });*/

  console.log('PushAPI_space_start | Response - 200 OK');
  if (!silent) {
    console.log(response);
  }

  // This is causing bug - Aman to check
  /*response = await PushAPI.space.stop({
    spaceId: spaceId,
    env: env as ENV,
    signer: signer,
  });*/

  console.log('PushAPI_space_stop | Response - 200 OK');
  if (!silent) {
    console.log(response);
  }
  return spaceId;
}


// Push Space - PushAPI.space.approve
async function PushAPI_space_approve(
  silent = !showAPIResponse
): Promise<string> {
  // Fetch user
  const user = await PushAPI.user.get({
    account: `eip155:${signer.address}`,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,
    signer: signer,
  });

  const now = new Date();

  const start = new Date(now.getTime() + 10 * 60000)
  const end = new Date(now.getTime() + 60 * 60000);

  const response = await PushAPI.space.create({
    spaceName: uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    }),
    spaceDescription,
    members: [`eip155:${randomWallet1}`, `eip155:${randomWallet2}`],
    spaceImage,
    admins: [],
    isPublic: true,
    signer: signer,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
    scheduleAt: start,  // Sets scheduleAt to the current time + 10 min
    scheduleEnd: end,  // Sets scheduleEnd to 60 minutes from now
  });
  console.log('PushAPI_chat_createSpace | Response - 200 OK');
  if (!silent) {
    console.log(response);
  }

  const spaceId = response.spaceId

  const secondUser = await PushAPI.user.get({
    account: `eip155:${signerSecondAccount.address}`,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKeyUser2 = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: secondUser.encryptedPrivateKey,

    signer: signerSecondAccount,
  });

  // Actual api
  const approveResponse = await PushAPI.chat.approve({
    status: 'Approved',
    senderAddress: spaceId, // receiver's address or spaceId of a group
    signer: signerSecondAccount,
    pgpPrivateKey: pgpDecrpyptedPvtKeyUser2,
    env: env as ENV,
  });

  console.log('PushAPI_space_approve | Response - 200 OK');
  if (!silent) {
    console.log(approveResponse);
  }
  return spaceId;
}

// Push Space - PushAPI.space.addListeners
async function PushAPI_space_add_listeners(
  spaceId: string,
  silent = !showAPIResponse
) {
  // Fetch user
  const user = await PushAPI.user.get({
    account: `eip155:${signer.address}`,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,

    signer: signer,
  });

  
  const response = await PushAPI.space.addListeners({
    spaceId,
    listeners: [
      `eip155:${ethers.Wallet.createRandom().address}`,
      `eip155:${ethers.Wallet.createRandom().address}`,
      `eip155:${ethers.Wallet.createRandom().address}`,
    ],   
    signer: signer,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  console.log('PushAPI_space_addListeners | Response - 200 OK');
  if (!silent) {
    console.log(response);
  }
}

// Push Space - PushAPI.space.removeListeners
async function PushAPI_space_remove_listeners(
  spaceId: string,
  silent = !showAPIResponse
) {
  // Fetch user
  const user = await PushAPI.user.get({
    account: `eip155:${signer.address}`,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,

    signer: signer,
  });

  const a1 = ethers.Wallet.createRandom().address;
  const a2 = ethers.Wallet.createRandom().address;
  const a3 = ethers.Wallet.createRandom().address;

  const response = await PushAPI.space.addListeners({
    spaceId,
    listeners: [
      `eip155:${a1}`,
      `eip155:${a2}`,
      `eip155:${a3}`,
    ],   
    signer: signer,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  console.log('PushAPI_space_addListeners | Response - 200 OK');
  if (!silent) {
    console.log(response);
  }

  const response2 = await PushAPI.space.removeListeners({
    spaceId,
    listeners: [
      `eip155:${a1}`,
      `eip155:${a2}`,
      `eip155:${a3}`,
    ],   
    signer: signer,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  console.log('PushAPI_space_removeListeners | Response - 200 OK');
  if (!silent) {
    console.log(response2);
  }
}

// Push Space - PushAPI.space.addSpeakers
async function PushAPI_space_add_speakers(
  spaceId: string,
  silent = !showAPIResponse
) {
  // Fetch user
  const user = await PushAPI.user.get({
    account: `eip155:${signer.address}`,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,

    signer: signer,
  });

  
  const response = await PushAPI.space.addSpeakers({
    spaceId,
    speakers: [
      `eip155:${ethers.Wallet.createRandom().address}`,
      `eip155:${ethers.Wallet.createRandom().address}`,
      `eip155:${ethers.Wallet.createRandom().address}`,
    ],   
    signer: signer,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  console.log('PushAPI_space_addSpeakers | Response - 200 OK');
  if (!silent) {
    console.log(response);
  }
}

// Push Space - PushAPI.space.removeSpeakers
async function PushAPI_space_remove_speakers(
  spaceId: string,
  silent = !showAPIResponse
) {
  // Fetch user
  const user = await PushAPI.user.get({
    account: `eip155:${signer.address}`,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,

    signer: signer,
  });

  const a1 = ethers.Wallet.createRandom().address;
  const a2 = ethers.Wallet.createRandom().address;
  const a3 = ethers.Wallet.createRandom().address;

  const response = await PushAPI.space.addSpeakers({
    spaceId,
    speakers: [
      `eip155:${a1}`,
      `eip155:${a2}`,
      `eip155:${a3}`,
    ],   
    signer: signer,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  console.log('PushAPI_space_addSpeakers | Response - 200 OK');
  if (!silent) {
    console.log(response);
  }

  const response2 = await PushAPI.space.removeSpeakers({
    spaceId,
    speakers: [
      `eip155:${a1}`,
      `eip155:${a2}`,
      `eip155:${a3}`,
    ],   
    signer: signer,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  console.log('PushAPI_space_removeSpeakers | Response - 200 OK');
  if (!silent) {
    console.log(response2);
  }
}

// Push Chat - Run Chat Use cases
async function runNFTChatUseCases() {
  console.log(`
  ███    ██ ███████ ████████   ██████  ██   ██  █████  ████████
  ████   ██ ██         ██      ██      ██   ██ ██   ██    ██
  ██ ██  ██ █████      ██      ██      ███████ ███████    ██
  ██  ██ ██ ██         ██      ██      ██   ██ ██   ██    ██
  ██   ████ ██         ██      ██████  ██   ██ ██   ██    ██
  `);
  console.log('PushAPI.user.create');
  await PushAPI_nft_user_create();

  console.log('PushAPI.user.get');
  await PushAPI_nft_user_get();

  console.log('PushAPI_chat_decryptPGPKey');
  await PushAPI_nft_chat_decryptPGPKey();

  console.log('PushAPI.chat.chats');
  await PushAPI_nft_chat_chats();

  console.log('PushAPI.chat.requests');
  await PushAPI_nft_chat_requests();

  console.log('PushAPI.chat.send');
  const TargetchatId = await PushAPI_nft_chat_send();

  console.log('PushAPI.chat.approve');
  await PushAPI_nft_chat_approve();

  console.log('NFT Video Call Notification');
  await PushAPI_nft_chat_video_call_notification(TargetchatId);

  console.log('PushAPI.chat.createGroup');
  const chatId = await PushAPI_nft_chat_createGroup();

  console.log('PushAPI.chat.conversationHash');
  await PushAPI_nft_chat_conversationHash();

  console.log('PushAPI_chat_history');
  await PushAPI_nft_chat_history();

  console.log('PushAPI.chat.latest');
  await PushAPI_nft_chat_latest();

  console.log('PushAPI.chat.updateGroup');
  await PushAPI_nft_chat_updateGroup(chatId);

  console.log('PushAPI.chat.getGroupByName');
  await PushAPI_nft_chat_getGroupByName();

  console.log('PushAPI.chat.getGroup');
  await PushAPI_nft_chat_getGroup(chatId);

  console.log('PushAPI.chat.decryptConversation');
  await PushAPI_nft_chat_decryptConversation();

  console.log('Push Chat - PushSDKSocket()');
  await PushNFTChatSDKSocket();
}

// Push Chat - PushAPI.user.create
async function PushAPI_nft_user_create(silent = !showAPIResponse) {
  const user1 = await PushAPI.user.create({
    account: nftAccount1,
    signer: nftSigner1,
    env: env as ENV,
    additionalMeta: { NFTPGP_V1: { password: nftProfilePassword1 } },
  });

  const user2 = await PushAPI.user.create({
    account: nftAccount2,
    signer: nftSigner2,
    env: env as ENV,
    additionalMeta: { NFTPGP_V1: { password: nftProfilePassword2 } },
  });

  console.log('PushAPI_nft_user_create | Response - 200 OK');
  if (!silent) {
    console.log(user1);
    console.log(user2);
  }
}

// Push Chat - PushAPI.user.get
async function PushAPI_nft_user_get(silent = !showAPIResponse) {
  const user = await PushAPI.user.get({
    account: nftAccount1,
    env: env as ENV,
  });

  console.log('PushAPI_nft_user_get | Response - 200 OK');

  if (!silent) {
    console.log(user);
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

  console.log('PushAPI_nft_chat_decryptPGPKey | Response - 200 OK');
  if (!silent) {
    console.log(pgpKey);
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

  console.log('PushAPI_nft_chat_chats | Response - 200 OK');
  if (!silent) {
    console.log(response);
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

  console.log('PushAPI_nft_chat_requests | Response - 200 OK');
  if (!silent) {
    console.log(response);
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

  console.log('PushAPI_nft_chat_conversationHash | Response - 200 OK');
  if (!silent) {
    console.log(conversationHash);
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

  console.log('PushAPI_nft_chat_latest | Response - 200 OK');
  if (!silent) {
    console.log(response);
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

  console.log('PushAPI_nft_chat_history | Response - 200 OK');
  if (!silent) {
    console.log(response);
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
    messageContent: "Gm gm! It's me... Mario",
    messageType: 'Text', // can be "Text" | "Image" | "File" | "GIF"
    receiverAddress: nftAccount2,
    account: nftAccount1,
    signer: signer,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  console.log('PushAPI_nft_chat_send | Response - 200 OK');
  if (!silent) {
    console.log(response);
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

  console.log('PushAPI_nft_chat_approve | Response - 200 OK');
  if (!silent) {
    console.log(approve);
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

  console.log('PushAPI.payloads.sendNotification | Response - 204 OK');
  if (!silent) {
    console.log(apiResponse);
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

  console.log('PushAPI_nft_chat_createGroup | Response - 200 OK');
  if (!silent) {
    console.log(response);
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
    members: [nftAccount2, nftAccount3],
    groupImage,
    admins: [nftAccount2],
    account: nftAccount1,
    signer: nftSigner1,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  console.log('PushAPI_nft_chat_updateGroup | Response - 200 OK');
  if (!silent) {
    console.log(response);
  }
}

// Push Chat - PushAPI.chat.getGroupByName
async function PushAPI_nft_chat_getGroupByName(silent = !showAPIResponse) {
  const response = await PushAPI.chat.getGroupByName({
    groupName: 'Push Group Chat 3',
    env: env as ENV,
  });

  console.log('PushAPI_nft_chat_getGroupByName | Response - 200 OK');
  if (!silent) {
    console.log(response);
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

  console.log('PushAPI_nft_chat_getGroup | Response - 200 OK');
  if (!silent) {
    console.log(response);
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

  console.log('PushAPI_nft_chat_decryptConversation | Response - 200 OK');
  if (!silent) {
    console.log(decryptedChat);
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
    console.log('Socket Connected - will disconnect after 4 seconds');

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
      await PushAPI.chat.send({
      messageContent: "Gm gm! It's me... Mario",
      messageType: 'Text',
      receiverAddress: nftAccount2,
      account: nftAccount1,
      signer: nftSigner1,
      pgpPrivateKey: pgpDecrpyptedPvtKey,
      env: env as ENV,
    });
    console.log('PushAPI_nft_chat_send | Response - 200 OK');
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

async function runSpacesUserCases() {
  console.log(`
                                                                                                                       
                                                                                                                       
  SSSSSSSSSSSSSSS PPPPPPPPPPPPPPPPP        AAA                  CCCCCCCCCCCCCEEEEEEEEEEEEEEEEEEEEEE   SSSSSSSSSSSSSSS 
SS:::::::::::::::SP::::::::::::::::P      A:::A              CCC::::::::::::CE::::::::::::::::::::E SS:::::::::::::::S
S:::::SSSSSS::::::SP::::::PPPPPP:::::P    A:::::A           CC:::::::::::::::CE::::::::::::::::::::ES:::::SSSSSS::::::S
S:::::S     SSSSSSSPP:::::P     P:::::P  A:::::::A         C:::::CCCCCCCC::::CEE::::::EEEEEEEEE::::ES:::::S     SSSSSSS
S:::::S              P::::P     P:::::P A:::::::::A       C:::::C       CCCCCC  E:::::E       EEEEEES:::::S            
S:::::S              P::::P     P:::::PA:::::A:::::A     C:::::C                E:::::E             S:::::S            
S::::SSSS           P::::PPPPPP:::::PA:::::A A:::::A    C:::::C                E::::::EEEEEEEEEE    S::::SSSS         
 SS::::::SSSSS      P:::::::::::::PPA:::::A   A:::::A   C:::::C                E:::::::::::::::E     SS::::::SSSSS    
   SSS::::::::SS    P::::PPPPPPPPP A:::::A     A:::::A  C:::::C                E:::::::::::::::E       SSS::::::::SS  
      SSSSSS::::S   P::::P        A:::::AAAAAAAAA:::::A C:::::C                E::::::EEEEEEEEEE          SSSSSS::::S 
           S:::::S  P::::P       A:::::::::::::::::::::AC:::::C                E:::::E                         S:::::S
           S:::::S  P::::P      A:::::AAAAAAAAAAAAA:::::AC:::::C       CCCCCC  E:::::E       EEEEEE            S:::::S
SSSSSSS     S:::::SPP::::::PP   A:::::A             A:::::AC:::::CCCCCCCC::::CEE::::::EEEEEEEE:::::ESSSSSSS     S:::::S
S::::::SSSSSS:::::SP::::::::P  A:::::A               A:::::ACC:::::::::::::::CE::::::::::::::::::::ES::::::SSSSSS:::::S
S:::::::::::::::SS P::::::::P A:::::A                 A:::::A CCC::::::::::::CE::::::::::::::::::::ES:::::::::::::::SS 
SSSSSSSSSSSSSSS   PPPPPPPPPPAAAAAAA                   AAAAAAA   CCCCCCCCCCCCCEEEEEEEEEEEEEEEEEEEEEE SSSSSSSSSSSSSSS   
                                                                                                                      
                                                                                                                      
                                                                                                                      
                                                                                                                      
                                                                                                                      
                                                                                                                      
                                                                                                                      
`)

  console.log('PushAPI.user.create');
  await PushAPI_user_create();

  console.log('PushAPI.space.create');
  const spaceId = await PushAPI_space_create();

  console.log('PushAPI.space.update');
  await PushAPI_space_update(spaceId);

  console.log('PushAPI.space.get');
  await PushAPI_space_get(spaceId);

  console.log('PushAPI.space.start');
  console.log('PushAPI.space.stop');
  await PushAPI_space_start_and_stop();

  console.log('PushAPI.space.approve');
  await PushAPI_space_approve();

  console.log('PushAPI.space.addListeners');
  await PushAPI_space_add_listeners(spaceId);

  console.log('PushAPI.space.removeListeners');
  await PushAPI_space_remove_listeners(spaceId);

  console.log('PushAPI.space.addSpeakers');
  await PushAPI_space_add_speakers(spaceId);

  console.log('PushAPI.space.removeSpeakers');
  await PushAPI_space_remove_speakers(spaceId);
}

// Push Video - Run Video Use cases
async function runVideoUseCases() {
  console.log(`
██╗   ██╗██╗██████╗ ███████╗ ██████╗
██║   ██║██║██╔══██╗██╔════╝██╔═══██╗
██║   ██║██║██║  ██║█████╗  ██║   ██║
╚██╗ ██╔╝██║██║  ██║██╔══╝  ██║   ██║
 ╚████╔╝ ██║██████╔╝███████╗╚██████╔╝
  ╚═══╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝
  `);
  console.log('new PushAPI.video.Video({...})');
  videoObject = await PushAPI_video_object_init();

  console.log('await videoObject.create({...})');
  videoObject = await PushAPI_video_create();

  console.log('await videoObject.request({...})');
  videoObject = await PushAPI_video_request(); // for initiator

  console.log('await videoObject.acceptRequest({...})');
  videoObject = await PushAPI_video_accept_request(); // for receiver

  console.log('videoObject.connect()');
  // should be only called inside of the USER_FEEDS event handler as shown later in PushVideoSDKSocket
  videoObject = await PushAPI_video_connect(); // for initiator

  console.log('videoObject.disconnect()');
  videoObject = await PushAPI_video_disconnect();

  console.log('Push Video - PushSDKSocket()');
  await PushVideoSDKSocket();
}

async function PushAPI_video_object_init() {
  // Fetch user
  const user = await PushAPI.user.get({
    account: `eip155:${signer.address}`,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,

    signer: signer,
  });

  // Init the Video object
  const videoObject = new PushAPI.video.Video({
    signer,
    chainId: videoChainId,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
    setData: videoSetData,
  });

  return videoObject;
}

async function PushAPI_video_create() {
  await videoObject.create({
    stream: videoLocalStream,
  });
}

async function PushAPI_video_request() {
  videoObject.request({
    senderAddress: videoSenderAddress,
    recipientAddress: videoRecipientAddress,
    chatId: videoChatId,
  });
}

async function PushAPI_video_accept_request() {
  videoObject.acceptRequest({
    signalData: videoSignalData_1,
    senderAddress: videoRecipientAddress,
    recipientAddress: videoSenderAddress,
    chatId: videoChatId,
  });
}

async function PushAPI_video_connect() {
  videoObject.connect({
    signalData: {}, // signalData from sockets
  });
}

async function PushAPI_video_disconnect() {
  videoObject.disconnect();
}

async function PushVideoSDKSocket() {
  const pushSDKSocket = createSocketConnection({
    user: videoSenderAddress,
    socketType: 'chat',
    socketOptions: { autoConnect: true, reconnectionAttempts: 3 },
    env: env as ENV,
  });

  if (!pushSDKSocket) {
    throw new Error('Socket not connected');
  }

  pushSDKSocket.on(EVENTS.USER_FEEDS, (feedItem) => {
    const { payload } = feedItem || {};

    if (
      Object.prototype.hasOwnProperty.call(payload, 'data') &&
      Object.prototype.hasOwnProperty.call(payload['data'], 'additionalMeta')
    ) {
      const additionalMeta = JSON.parse(payload['data']['additionalMeta']);

      if (additionalMeta.status === PushAPI.VideoCallStatus.INITIALIZED) {
        videoSignalData_1 = additionalMeta.signalData;
      } else if (
        additionalMeta.status === PushAPI.VideoCallStatus.RECEIVED ||
        additionalMeta.status === PushAPI.VideoCallStatus.RETRY_RECEIVED
      ) {
        videoObject.connect({
          signalData: additionalMeta.signalData,
        });
      } else if (
        additionalMeta.status === PushAPI.VideoCallStatus.DISCONNECTED
      ) {
        // can clear out the states here
      } else if (
        additionalMeta.status === PushAPI.VideoCallStatus.RETRY_INITIALIZED &&
        videoObject.isInitiator()
      ) {
        videoObject.request({
          senderAddress: videoSenderAddress,
          recipientAddress: videoRecipientAddress,
          chatId: videoChatId,
          retry: true,
        });
      } else if (
        additionalMeta.status === PushAPI.VideoCallStatus.RETRY_INITIALIZED &&
        !videoObject.isInitiator()
      ) {
        videoObject.acceptRequest({
          signalData: additionalMeta.signalData,
          senderAddress: videoRecipientAddress,
          recipientAddress: videoSenderAddress,
          chatId: videoChatId,
          retry: true,
        });
      }
    }
  });

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  await delay(4000);
}

// Use Cases
async function start() {
  await runSpacesUserCases();
  console.log(`${returnHeadingLog()}`);
  console.log(`${returnENVLog()}`);
  runNotificaitonsUseCases().then(() => {
    runChatUseCases().then(() => {
      runNFTChatUseCases().then(() => {
        if (videoLocalStream !== null) {
          /*
            - One instance of videoObject corresponds to one user/peer of the call
            - For a wallet-to-wallet video call we need 2 such users/peers
              - One of these peer would be the initiator and the other would be the receiver
            - Stream object has to be fetched from the frontend of your app to the backend and supplied to videoLocalStream corresponding to each of the peer
            - Might be of help: https://stackoverflow.com/questions/25523289/sending-a-mediastream-to-host-server-with-webrtc-after-it-is-captured-by-getuser
          */
          runVideoUseCases();
        }
      }).then(() => {
        runSpacesUserCases();
      });
    })
  });
}

start();

// -----------
// -----------
// FUNCTION TO EMIT HEADER
// -----------
// -----------
function returnHeadingLog() {
  const headingLog = `
    ███████ ██████  ██   ██     ███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██  █████  ██      ██ ████████ ██    ██
    ██      ██   ██ ██  ██      ██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██   ██ ██      ██    ██     ██  ██
    ███████ ██   ██ █████       █████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████ ██      ██    ██      ████
         ██ ██   ██ ██  ██      ██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██ ██   ██ ██      ██    ██       ██
    ███████ ██████  ██   ██     ██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ██   ██ ███████ ██    ██       ██
  `;
  return headingLog;
}

function returnENVLog() {
  let environmentLog = `
    ███████ ████████  █████   ██████  ██ ███    ██  ██████
    ██         ██    ██   ██ ██       ██ ████   ██ ██
    ███████    ██    ███████ ██   ███ ██ ██ ██  ██ ██   ███
         ██    ██    ██   ██ ██    ██ ██ ██  ██ ██ ██    ██
    ███████    ██    ██   ██  ██████  ██ ██   ████  ██████
  `;

  if (env === ENV.PROD) {
    environmentLog = `
      ██████  ██████   ██████  ██████  ██    ██  ██████ ████████ ██  ██████  ███    ██
      ██   ██ ██   ██ ██    ██ ██   ██ ██    ██ ██         ██    ██ ██    ██ ████   ██
      ██████  ██████  ██    ██ ██   ██ ██    ██ ██         ██    ██ ██    ██ ██ ██  ██
      ██      ██   ██ ██    ██ ██   ██ ██    ██ ██         ██    ██ ██    ██ ██  ██ ██
      ██      ██   ██  ██████  ██████   ██████   ██████    ██    ██  ██████  ██   ████
    `;
  } else if (env === ENV.DEV) {
    environmentLog = `
      ██████  ███████ ██    ██
      ██   ██ ██      ██    ██
      ██   ██ █████   ██    ██
      ██   ██ ██       ██  ██
      ██████  ███████   ████
    `;
  }

  return environmentLog;
}
