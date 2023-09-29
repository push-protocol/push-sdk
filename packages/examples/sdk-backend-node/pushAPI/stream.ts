import { PushAPI } from '@pushprotocol/restapi';
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

const eventlistener = async (
  pushAPI: PushAPI,
  eventName: string
): Promise<void> => {
  pushAPI.stream.on(eventName, (data: any) => {
    // if (showAPIResponse) {
    console.log(data);
    // }
  });
};
export const runPushAPIStreamCases = async (): Promise<void> => {
  const userAlice = await PushAPI.initialize(signer, { env });
  const userBob = await PushAPI.initialize(secondSigner, { env });
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log(`Listening ${STREAM.PROFILE} Events`);
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
  await userAlice.chat.send(secondSignerAddress, {
    content: 'Hello Bob!',
  });
  console.log('sent!!');
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  await delay(4000);
};
