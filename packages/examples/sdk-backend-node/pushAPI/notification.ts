import { PushAPI } from '@pushprotocol/restapi';
import { config } from '../config';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { createWalletClient, http } from 'viem';
import { goerli } from 'viem/chains';

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

export const runPushAPINotificationCases = async (): Promise<void> => {
  const userAlice = await PushAPI.initialize(signer, { env });
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.notification.list');
  const inboxNotifications = await userAlice.notification.list('INBOX');
  const spamNotifications = await userAlice.notification.list('SPAM');
  if (showAPIResponse) {
    console.log(inboxNotifications, spamNotifications);
  }
  console.log('PushAPI.notification.list | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.notification.subscribe');
  const subscribeResponse = await userAlice.notification.subscribe(
    'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681' // channel to subscribe
  );
  if (showAPIResponse) {
    console.log(subscribeResponse);
  }
  console.log('PushAPI.notification.subscribe | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.notification.subscriptions');
  const aliceSubscriptions = await userAlice.notification.subscriptions();
  if (showAPIResponse) {
    console.log(aliceSubscriptions);
  }
  console.log('PushAPI.notification.subscriptions | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.notification.unsubscribe');
  const unsubscribeResponse = await userAlice.notification.unsubscribe(
    'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681' // channel to unsubscribe
  );
  if (showAPIResponse) {
    console.log(unsubscribeResponse);
  }
  console.log('PushAPI.notification.unsubscribe | Response - 200 OK\n\n');
};
