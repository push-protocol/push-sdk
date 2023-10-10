import { PushAPI } from '@pushprotocol/restapi';
import { config } from '../config';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { createWalletClient, http } from 'viem';
import { goerli } from 'viem/chains';
import { runPushAPIChatCases } from './chat';
import { runPushAPIEncryptionCases } from './encryption';
import { runPushAPINotificationCases } from './notification';
import { runPushAPIProfileCases } from './profile';
import { runPushAPIStreamCases } from './stream';
import { runPushAPIChannelCases } from './channel';

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

export const runPushAPICases = async (): Promise<void> => {
  console.log(`

██████╗░██╗░░░██╗░██████╗██╗░░██╗░█████╗░██████╗░██╗  ░█████╗░██╗░░░░░░█████╗░░██████╗░██████╗
██╔══██╗██║░░░██║██╔════╝██║░░██║██╔══██╗██╔══██╗██║  ██╔══██╗██║░░░░░██╔══██╗██╔════╝██╔════╝
██████╔╝██║░░░██║╚█████╗░███████║███████║██████╔╝██║  ██║░░╚═╝██║░░░░░███████║╚█████╗░╚█████╗░
██╔═══╝░██║░░░██║░╚═══██╗██╔══██║██╔══██║██╔═══╝░██║  ██║░░██╗██║░░░░░██╔══██║░╚═══██╗░╚═══██╗
██║░░░░░╚██████╔╝██████╔╝██║░░██║██║░░██║██║░░░░░██║  ╚█████╔╝███████╗██║░░██║██████╔╝██████╔╝
╚═╝░░░░░░╚═════╝░╚═════╝░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░░░░╚═╝  ░╚════╝░╚══════╝╚═╝░░╚═╝╚═════╝░╚═════╝░
  `);
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.initialize');
  const userAlice = await PushAPI.initialize(signer, { env });
  console.log('PushAPI.initialize | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  // todo : This is yet to be discussed
  console.log('PushAPI.info');
  const userAliceInfo = await userAlice.user.info();
  if (showAPIResponse) {
    console.log(userAliceInfo);
  }
  console.log('PushAPI.info | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  await runPushAPIProfileCases(); //  PushAPI.profile
  await runPushAPIChatCases(); // PushAPI.chat
  await runPushAPIEncryptionCases(); // PushAPI.encryption
  await runPushAPINotificationCases(); // PushAPI.notification
  await runPushAPIChannelCases(); // PushAPI.channel
  await runPushAPIStreamCases(); // PushAPI.stream
};
