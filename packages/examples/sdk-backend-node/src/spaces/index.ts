import * as PushAPI from '@pushprotocol/restapi';
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

// Addresses that will be used to
const signer = ethers.Wallet.createRandom();
const signerSecondAccount = ethers.Wallet.createRandom();

// generate some dummy wallets as well
const randomWallet1 = ethers.Wallet.createRandom().address;
const randomWallet2 = ethers.Wallet.createRandom().address;
const randomWallet3 = ethers.Wallet.createRandom().address;

const spaceName = uniqueNamesGenerator({
  dictionaries: [adjectives, colors, animals],
});

const spaceDescription = uniqueNamesGenerator({
  dictionaries: [adjectives, colors, animals],
});

const spaceImage =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==';

export const runSpacesUseCases = async (): Promise<void> => {
  console.log(`
    ███████╗██████╗  █████╗  ██████╗███████╗███████╗
    ██╔════╝██╔══██╗██╔══██╗██╔════╝██╔════╝██╔════╝
    ███████╗██████╔╝███████║██║     █████╗  ███████╗
    ╚════██║██╔═══╝ ██╔══██║██║     ██╔══╝  ╚════██║
    ███████║██║     ██║  ██║╚██████╗███████╗███████║
    ╚══════╝╚═╝     ╚═╝  ╚═╝ ╚═════╝╚══════╝╚══════╝
                                                    
    `);

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

  console.log('PushAPI.space.spaces');
  await PushAPI_space_spaces();

  console.log('PushAPI.space.requests');
  await PushAPI_space_requests();

  console.log('PushAPI.space.trending');
  await PushAPI_space_trending();
};

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

  const now = new Date();
  const start = new Date(now.getTime() + 10 * 60000);
  const end = new Date(now.getTime() + 60 * 60000);

  const response = await PushAPI.space.create({
    spaceName,
    spaceDescription,
    listeners: [`eip155:${randomWallet1}`, `eip155:${randomWallet2}`],
    spaceImage,
    speakers: [],
    isPublic: true,
    signer: signer,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
    scheduleAt: start,
    scheduleEnd: end,
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

  const now = new Date();
  const start = new Date(now.getTime() + 10 * 60000);
  const end = new Date(now.getTime() + 60 * 60000);

  // Actual API
  // Convert image to base 64 and pass
  // This is an idempotent operation, meaning it requires all space info to be passed no matter if only few things change
  // Why so? To ensure that verificationProof always is able to replicate the current space info (trustless since signature is stored with the info)
  const response = await PushAPI.space.update({
    spaceId,
    spaceName,
    spaceDescription,
    listeners: [
      `eip155:${randomWallet1}`,
      `eip155:${randomWallet2}`,
      `eip155:${randomWallet3}`,
      `eip155:${signer.address}`,
    ],
    spaceImage,
    speakers: [`eip155:${signer.address}`], // takes signer as admin automatically, add more if you want to
    scheduleAt: start,
    scheduleEnd: end,
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
async function PushAPI_space_get(spaceId: string, silent = !showAPIResponse) {
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
  const start = new Date(now.getTime() + 10 * 60000);
  const end = new Date(now.getTime() + 60 * 60000);

  const response = await PushAPI.space.create({
    spaceName: uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    }),
    spaceDescription,
    listeners: [`eip155:${randomWallet1}`, `eip155:${randomWallet2}`],
    spaceImage,
    speakers: [],
    isPublic: true,
    signer: signer,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
    scheduleAt: start, // Sets scheduleAt to the current time + 10 min
    scheduleEnd: end, // Sets scheduleEnd to 60 minutes from now
  });
  console.log('PushAPI_chat_createSpace | Response - 200 OK');
  if (!silent) {
    console.log(response);
  }

  const spaceId = response.spaceId;

  // This is causing bug - Aman to check
  /*const response2 = await PushAPI.space.start({
      spaceId: spaceId,
      env: env as ENV,
      signer: signer,
    });

    console.log('PushAPI_space_start | Response - 200 OK');
    if (!silent) {
        console.log(response2);
    }*/

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
  const start = new Date(now.getTime() + 10 * 60000);
  const end = new Date(now.getTime() + 60 * 60000);

  const response = await PushAPI.space.create({
    spaceName: uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    }),
    spaceDescription,
    listeners: [`eip155:${randomWallet1}`, `eip155:${randomWallet2}`],
    spaceImage,
    speakers: [],
    isPublic: true,
    signer: signer,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
    scheduleAt: start, // Sets scheduleAt to the current time + 10 min
    scheduleEnd: end, // Sets scheduleEnd to 60 minutes from now
  });
  console.log('PushAPI_chat_createSpace | Response - 200 OK');
  if (!silent) {
    console.log(response);
  }

  const spaceId = response.spaceId;

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
    listeners: [`eip155:${a1}`, `eip155:${a2}`, `eip155:${a3}`],
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
    listeners: [`eip155:${a1}`, `eip155:${a2}`, `eip155:${a3}`],
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
    speakers: [`eip155:${a1}`, `eip155:${a2}`, `eip155:${a3}`],
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
    speakers: [`eip155:${a1}`, `eip155:${a2}`, `eip155:${a3}`],
    signer: signer,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  console.log('PushAPI_space_removeSpeakers | Response - 200 OK');
  if (!silent) {
    console.log(response2);
  }
}

// Push Space - PushAPI.space.spaces
async function PushAPI_space_spaces(silent = !showAPIResponse) {
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
  const response = await PushAPI.space.spaces({
    account: `eip155:${signer.address}`,
    toDecrypt: true,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  console.log('PushAPI_space_spaces | Response - 200 OK');
  if (!silent) {
    console.log(response);
  }
}

// Push Chat - PushAPI.spaces.requests
async function PushAPI_space_requests(silent = !showAPIResponse) {
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
  const response = await PushAPI.space.requests({
    account: `eip155:${signer.address}`,
    toDecrypt: true,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
  });

  console.log('PushAPI_space_requests | Response - 200 OK');
  if (!silent) {
    console.log(response);
  }
}

// Push Chat - PushAPI.spaces.trending
async function PushAPI_space_trending(silent = !showAPIResponse) {
  // Actual api
  const response = await PushAPI.space.trending({
    env: env as ENV,
  });

  console.log('PushAPI_space_trending | Response - 200 OK');
  if (!silent) {
    console.log(response);
  }
}
