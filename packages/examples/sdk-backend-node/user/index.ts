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
  console.debug('PushAPI.initialize');
  const userAlice = await PushAPI.initialize(signer, { env });
  console.debug('PushAPI.initialize | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.info');
  const userAliceInfo = await userAlice.info();
  if (showAPIResponse) {
    console.info(userAliceInfo);
  }
  console.debug('PushAPI.info | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.profile.info');
  const userAliceProfileInfo = await userAlice.profile.info();
  if (showAPIResponse) {
    console.info(userAliceProfileInfo);
  }
  console.debug('PushAPI.profile.info | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.profile.update');
  const updatedName = 'Bob The Builder';
  const response = await userAlice.profile.update({ name: updatedName });
  if (showAPIResponse) {
    console.info(response);
  }
  console.debug('PushAPI.profile.update | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.encryption.info');
  const encryptionInfo = await userAlice.encryption.info();
  if (showAPIResponse) {
    console.info(encryptionInfo);
  }
  console.debug('PushAPI.encryption.info | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.encryption.update');
  const PGP_V3 = 'eip191-aes256-gcm-hkdf-sha256';
  const encryptionUpdate = await userAlice.encryption.update(PGP_V3 as any);
  if (showAPIResponse) {
    console.info(encryptionUpdate);
  }
  console.debug('PushAPI.encryption.update | Response - 200 OK\n\n');
};
