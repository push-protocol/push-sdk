import { CONSTANTS, PushAPI } from '@pushprotocol/restapi';
import { config } from '../config';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { createWalletClient, http } from 'viem';
import { goerli } from 'viem/chains';
import { STREAM } from '@pushprotocol/restapi/src/lib/pushstream/pushStreamTypes';

// CONFIGS
const { env, showAPIResponse } = config;

/***************** SAMPLE SIGNER GENERATION *********************/
// Uing VIEM
// Random Wallet Signers
const signer = createWalletClient({
  account: privateKeyToAccount(generatePrivateKey()),
  chain: goerli,
  transport: http(),
});
const signerAddress = signer.account.address;
const secondSigner = createWalletClient({
  account: privateKeyToAccount(generatePrivateKey()),
  chain: goerli,
  transport: http(),
});
const secondSignerAddress = secondSigner.account.address;
const thirdSigner = createWalletClient({
  account: privateKeyToAccount(generatePrivateKey()),
  chain: goerli,
  transport: http(),
});
const thirdSignerAddress = thirdSigner.account.address;
// Dummy Wallet Addresses
const randomWallet1 = privateKeyToAccount(generatePrivateKey()).address;

const eventlistener = async (
  pushAPI: PushAPI,
  eventName: string
): Promise<void> => {
  pushAPI.stream.on(eventName, (data: any) => {
    if (showAPIResponse) {
      console.log(data);
    }
  });
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const runPushAPIStreamCases = async (): Promise<void> => {
  const userAlice = await PushAPI.initialize(signer, { env });

  const stream = await userAlice.initStream(
    [
      CONSTANTS.STREAM.NOTIF,
      CONSTANTS.STREAM.CHAT_OPS,
      CONSTANTS.STREAM.CHAT,
      CONSTANTS.STREAM.CONNECT,
      CONSTANTS.STREAM.DISCONNECT,
    ],
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
    console.log('Stream Connected');
  });

  await stream.connect();

  stream.on(CONSTANTS.STREAM.DISCONNECT, () => {
    console.log('Stream Disconnected');
  });

  const userBob = await PushAPI.initialize(secondSigner, { env });
  const userKate = await PushAPI.initialize(thirdSigner, { env });
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log(`Listening ${CONSTANTS.STREAM.PROFILE} Events`);
  eventlistener(userAlice, STREAM.PROFILE);
  console.log(`Listening ${STREAM.ENCRYPTION} Events`);
  eventlistener(userAlice, STREAM.ENCRYPTION);
  console.log(`Listening ${STREAM.NOTIF} Events`);
  eventlistener(userAlice, STREAM.NOTIF);
  console.log(`Listening ${STREAM.NOTIF_OPS} Events`);
  eventlistener(userAlice, STREAM.NOTIF_OPS);
  console.log(`Listening ${STREAM.CHAT} Events`);
  eventlistener(userAlice, STREAM.CHAT);
  console.log(`Listening ${STREAM.CHAT_OPS} Events`);
  eventlistener(userAlice, STREAM.CHAT_OPS);
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('\n\nNew Chat Request, Expected Events:\n1. chat.request');
  await userAlice.chat.send(secondSignerAddress, {
    content: 'Hello Bob! from Alice',
  });
  await delay(3000); // Delay added to log the events in order
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('\n\nNew Chat Request, Expected Events:\n1. chat.request');
  await userAlice.chat.send(thirdSignerAddress, {
    content: 'Hello Kate! from Alice',
  });
  await delay(3000);
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('\n\nChat Request Accept, Expected Events:\n1. chat.accept');
  await userBob.chat.accept(signerAddress);
  await delay(3000);
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('\n\nChat Request Reject, Expected Events:\n1. chat.reject');
  await userKate.chat.reject(signerAddress);
  await delay(3000);
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('\n\nCreate Chat Group, Expected Events:\n1. chat.group.create');
  const groupChatId = (
    await userAlice.chat.group.create('Test Grp', {
      description: 'Test Desc',
      image:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
      members: [secondSignerAddress, thirdSignerAddress],
      admins: [],
      private: false,
    })
  ).chatId;
  await delay(3000);
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('\n\nUpdate Chat Group, Expected Events:\n1. chat.group.update');
  await userAlice.chat.group.update(groupChatId, {
    description: 'Updated Test Desc',
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
  });
  await delay(3000);
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('\n\nAdd member to Group, Expected Events:\n1. chat.request');
  await userAlice.chat.group.add(groupChatId, {
    role: 'MEMBER',
    accounts: [randomWallet1],
  });
  await delay(3000);
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log(
    '\n\nRemove member from Group, Expected Events:\n1. chat.group.participant.remove'
  );
  await userAlice.chat.group.remove(groupChatId, {
    role: 'MEMBER',
    accounts: [randomWallet1],
  });
  await delay(3000);
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('\n\nAdd Admin to Group, Expected Events:\n1. chat.request');
  await userAlice.chat.group.add(groupChatId, {
    role: 'ADMIN',
    accounts: [randomWallet1],
  });
  await delay(3000);
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log(
    '\n\nRemove Admin from Group, Expected Events:\n1. chat.group.participant.remove'
  );
  await userAlice.chat.group.remove(groupChatId, {
    role: 'ADMIN',
    accounts: [randomWallet1],
  });
  await delay(3000);
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('\n\nJoin Group, Expected Events:\n1. chat.accept');
  await userBob.chat.group.join(groupChatId);
  await delay(3000);
  //-------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log(
    '\n\nLeave Group, Expected Events:\n1. chat.group.participant.leave'
  );
  await userBob.chat.group.leave(groupChatId);
  await delay(3000);
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log(
    '\n\nReject Group Joining Request, Expected Events:\n1. chat.reject'
  );
  await userKate.chat.group.reject(groupChatId);
  await delay(3000);
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  if (process.env.WALLET_PRIVATE_KEY) {
    // create signer
    const channelSigner = createWalletClient({
      account: privateKeyToAccount(`0x${process.env.WALLET_PRIVATE_KEY}`),
      chain: goerli,
      transport: http(),
    });

    await userAlice.notification.subscribe(
      `eip155:5:${channelSigner.account.address}` // channel to subscribe
    );

    const channelUser = await PushAPI.initialize(channelSigner, { env });
    console.log(
      '\n\nSend channel notification, Expected Events:\n1. notif.send'
    );
    await channelUser.channel.send(['*'], {
      notification: {
        title: 'test',
        body: 'test',
      },
    });
    await delay(3000);

    await userAlice.notification.unsubscribe(
      `eip155:5:${channelSigner.account.address}` // channel to subscribe
    );
  } else {
    console.log(
      'Skipping channel notification streams, as WALLET_PRIVATE_KEY is not present in .env'
    );
  }
};
