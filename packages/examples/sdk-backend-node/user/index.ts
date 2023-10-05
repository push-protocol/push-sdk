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

export const runUserCases = async (): Promise<void> => {
  console.log(`
██╗░░░██╗░██████╗███████╗██████╗░
██║░░░██║██╔════╝██╔════╝██╔══██╗
██║░░░██║╚█████╗░█████╗░░██████╔╝
██║░░░██║░╚═══██╗██╔══╝░░██╔══██╗
╚██████╔╝██████╔╝███████╗██║░░██║   
░╚═════╝░╚═════╝░╚══════╝╚═╝░░╚═╝
`);
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.initialize');
  const userAlice = await PushAPI.initialize(signer, { env });
  console.log('PushAPI.initialize | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.info');
  const userAliceInfo = await userAlice.info();
  if (showAPIResponse) {
    console.log(userAliceInfo);
  }
  console.log('PushAPI.info | Response - 200 OK\n\n');
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
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.encryption.info');
  const encryptionInfo = await userAlice.encryption.info();
  if (showAPIResponse) {
    console.log(encryptionInfo);
  }
  console.log('PushAPI.encryption.info | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.encryption.update');
  const PGP_V3 = 'eip191-aes256-gcm-hkdf-sha256';
  const encryptionUpdate = await userAlice.encryption.update(PGP_V3 as any);
  if (showAPIResponse) {
    console.log(encryptionUpdate);
  }
  console.log('PushAPI.encryption.update | Response - 200 OK\n\n');
};
