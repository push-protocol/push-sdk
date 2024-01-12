import { CONSTANTS, PushAPI } from '@pushprotocol/restapi';
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';
import { config } from '../config';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { createWalletClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { STREAM } from '@pushprotocol/restapi/src/lib/pushstream/pushStreamTypes';
import { PushStream } from '@pushprotocol/restapi/src/lib/pushstream/PushStream';
import { ethers } from 'ethers';

// CONFIGS
const { env, showAPIResponse } = config;

/***************** SAMPLE SIGNER GENERATION *********************/
// Uing VIEM
// Random Wallet Signers

// const signer = createWalletClient({
//   account: privateKeyToAccount(generatePrivateKey()),
//   chain: sepolia,
//   transport: http(),
// });
// const signerAddress = signer.account.address;
// const secondSigner = createWalletClient({
//   account: privateKeyToAccount(generatePrivateKey()),
//   chain: sepolia,
//   transport: http(),
// });
// const secondSignerAddress = secondSigner.account.address;
// const thirdSigner = createWalletClient({
//   account: privateKeyToAccount(generatePrivateKey()),
//   chain: sepolia,
//   transport: http(),
// });
// const thirdSignerAddress = thirdSigner.account.address;

// // Dummy Wallet Addresses
// const randomWallet1 = privateKeyToAccount(generatePrivateKey()).address;
// const randomWallet2 = privateKeyToAccount(generatePrivateKey()).address;
// const randomWallet3 = privateKeyToAccount(generatePrivateKey()).address;
/****************************************************************/

/***************** SAMPLE SIGNER GENERATION *********************/
// Uing ETHERS
// Random Wallet Signers

const signer = ethers.Wallet.createRandom();
const signerAddress = signer.address;
const secondSigner = ethers.Wallet.createRandom();
const secondSignerAddress = secondSigner.address;
const thirdSigner = ethers.Wallet.createRandom();
const thirdSignerAddress = thirdSigner.address;

// Dummy Wallet Addresses
const randomWallet1 = ethers.Wallet.createRandom().address;
const randomWallet2 = ethers.Wallet.createRandom().address;
const randomWallet3 = ethers.Wallet.createRandom().address;
/****************************************************************/

/***************** SAMPLE GROUP DATA ****************************/
const groupName = uniqueNamesGenerator({
  dictionaries: [adjectives, colors, animals],
});
const groupDescription = uniqueNamesGenerator({
  dictionaries: [adjectives, colors, animals],
});
const groupImage =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==';
/***************** SAMPLE GROUP DATA ****************************/

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const eventlistener = async (
  stream: PushStream,
  eventName: string
): Promise<void> => {
  stream.on(eventName, (data: any) => {
    if (showAPIResponse) {
      console.info('Stream Event Received');
      console.debug(data);
      console.log('\n');
    }
  });
};

export const runChatClassUseCases = async (): Promise<void> => {
  const userAlice = await PushAPI.initialize(signer, { env });

  const stream = await userAlice.initStream(
    [CONSTANTS.STREAM.CHAT, CONSTANTS.STREAM.CHAT_OPS],
    {
      // stream supports other products as well, such as STREAM.CHAT, STREAM.CHAT_OPS
      // more info can be found at push.org/docs/chat

      filter: {
        channels: ['*'],
        chats: ['*'],
      },
      connection: {
        auto: true, // should connection be automatic, else need to call stream.connect();
        retries: 3, // number of retries in case of error
      },
      raw: true, // enable true to show all data
    }
  );

  stream.on(CONSTANTS.STREAM.CONNECT, (a) => {
    console.debug('Stream Connected');
  });

  await stream.connect();

  stream.on(CONSTANTS.STREAM.DISCONNECT, () => {
    console.debug('Stream Disconnected');
  });

  const userBob = await PushAPI.initialize(secondSigner, { env });
  const userKate = await PushAPI.initialize(thirdSigner, { env });

  // Listen stream events to receive websocket events
  console.debug(`Listening ${CONSTANTS.STREAM.CHAT} Events`);
  eventlistener(stream, CONSTANTS.STREAM.CHAT);
  console.debug(`Listening ${CONSTANTS.STREAM.CHAT_OPS} Events`);
  eventlistener(stream, CONSTANTS.STREAM.CHAT_OPS);
  console.log('\n\n');

  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.chat.list');
  const aliceChats = await userAlice.chat.list(CONSTANTS.CHAT.LIST_TYPE.CHATS);
  const aliceRequests = await userAlice.chat.list(
    CONSTANTS.CHAT.LIST_TYPE.REQUESTS
  );
  if (showAPIResponse) {
    console.debug(aliceChats);
    console.debug(aliceRequests);
  }
  console.debug('PushAPI.chat.list | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.chat.latest');
  const aliceLatestChatWithBob = await userAlice.chat.latest(
    secondSignerAddress
  );
  if (showAPIResponse) {
    console.debug(aliceLatestChatWithBob);
  }
  console.debug('PushAPI.chat.latest | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.chat.history');
  const aliceChatHistoryWithBob = await userAlice.chat.history(
    secondSignerAddress
  );
  if (showAPIResponse) {
    console.debug(aliceChatHistoryWithBob);
  }
  console.debug('PushAPI.chat.history | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.chat.send');
  const aliceMessagesBob = await userAlice.chat.send(secondSignerAddress, {
    content: 'Hello Bob!',
    type: CONSTANTS.CHAT.MESSAGE_TYPE.TEXT,
  });
  if (showAPIResponse) {
    console.debug(aliceMessagesBob);
  }
  await delay(2000); // Delay added to log the events in order
  console.debug('PushAPI.chat.send | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.chat.accept');
  const bobAcceptsRequest = await userBob.chat.accept(signerAddress);
  if (showAPIResponse) {
    console.info(bobAcceptsRequest);
  }
  await delay(2000); // Delay added to log the events in order
  console.debug('PushAPI.chat.accept | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.chat.reject');
  await userKate.chat.send(signerAddress, {
    content: 'Sending malicious message',
    type: CONSTANTS.CHAT.MESSAGE_TYPE.TEXT,
  });
  const AliceRejectsRequest = await userAlice.chat.reject(thirdSignerAddress);
  if (showAPIResponse) {
    console.debug(AliceRejectsRequest);
  }
  await delay(2000); // Delay added to log the events in order
  console.debug('PushAPI.chat.reject | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.chat.block');
  const AliceBlocksBob = await userAlice.chat.block([secondSignerAddress]);
  if (showAPIResponse) {
    console.debug(AliceBlocksBob);
  }
  console.debug('PushAPI.chat.block | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.chat.unblock');
  const AliceUnblocksBob = await userAlice.chat.unblock([secondSignerAddress]);
  if (showAPIResponse) {
    console.debug(AliceUnblocksBob);
  }
  console.debug('PushAPI.chat.unblock | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.group.create');
  const createdGroup = await userAlice.chat.group.create(groupName, {
    description: groupDescription,
    image: groupImage,
    members: [randomWallet1, randomWallet2],
    admins: [],
    private: false,
  });
  const groupChatId = createdGroup.chatId; // to be used in other examples
  if (showAPIResponse) {
    console.debug(createdGroup);
  }
  await delay(2000); // Delay added to log the events in order
  console.debug('PushAPI.group.create | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.group.permissions');
  const grouppermissions = await userAlice.chat.group.permissions(groupChatId);
  if (showAPIResponse) {
    console.debug(grouppermissions);
  }
  console.debug('PushAPI.group.permissions | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.group.info');
  const groupInfo = await userAlice.chat.group.info(groupChatId);
  if (showAPIResponse) {
    console.debug(groupInfo);
  }
  console.debug('PushAPI.group.info | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.group.update');
  const updatedGroup = await userAlice.chat.group.update(groupChatId, {
    description: 'Updated Description',
  });
  if (showAPIResponse) {
    console.debug(updatedGroup);
  }
  await delay(2000); // Delay added to log the events in order
  console.debug('PushAPI.group.update | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.group.add');
  const addMember = await userAlice.chat.group.add(groupChatId, {
    role: 'MEMBER',
    accounts: [randomWallet3],
  });
  if (showAPIResponse) {
    console.info(addMember);
  }
  await delay(2000); // Delay added to log the events in order
  console.debug('PushAPI.group.add | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.group.remove');
  const removeMember = await userAlice.chat.group.remove(groupChatId, {
    role: 'MEMBER',
    accounts: [randomWallet3],
  });
  if (showAPIResponse) {
    console.info(removeMember);
  }
  await delay(2000); // Delay added to log the events in order
  console.debug('PushAPI.group.remove | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.group.join');
  const joinGrp = await userBob.chat.group.join(groupChatId);
  if (showAPIResponse) {
    console.info(joinGrp);
  }
  await delay(2000); // Delay added to log the events in order
  console.debug('PushAPI.group.join | Response - 200 OK\n\n');
  //-------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.group.leave');
  const leaveGrp = await userBob.chat.group.leave(groupChatId);
  if (showAPIResponse) {
    console.info(leaveGrp);
  }
  await delay(2000); // Delay added to log the events in order
  console.debug('PushAPI.group.leave | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.group.reject');
  const sampleGrp = await userAlice.chat.group.create('Sample Grp', {
    description: groupDescription,
    image: groupImage,
    members: [secondSignerAddress], // invite bob
    admins: [],
    private: true,
  });
  await userBob.chat.group.reject(sampleGrp.chatId);
  await delay(2000); // Delay added to log the events in order
  console.debug('PushAPI.group.reject | Response - 200 OK\n\n');
};
