import { PushAPI } from '@pushprotocol/restapi';
import { config } from '../config';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { createWalletClient, http } from 'viem';
import { sepolia } from 'viem/chains';

// CONFIGS
const { env, showAPIResponse } = config;

/***************** SAMPLE SIGNER GENERATION *********************/
// Uing VIEM
// Random Wallet Signers
const signer = createWalletClient({
  account: privateKeyToAccount(generatePrivateKey()),
  chain: sepolia,
  transport: http(),
});

export const runPushAPIProfileCases = async (): Promise<void> => {
  const userAlice = await PushAPI.initialize(signer, { env });
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.profile.info');
  const userAliceProfileInfo = await userAlice.profile.info();
  if (showAPIResponse) {
    console.log(userAliceProfileInfo);
  }
  console.log('PushAPI.profile.info | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.profile.update');
  const updatedName = 'Bob The Builder';
  const response = await userAlice.profile.update({ name: updatedName });
  if (showAPIResponse) {
    console.log(response);
  }
  console.log('PushAPI.profile.update | Response - 200 OK\n\n');
};
