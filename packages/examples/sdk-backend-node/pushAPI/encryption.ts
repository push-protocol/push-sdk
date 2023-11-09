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

export const runPushAPIEncryptionCases = async (): Promise<void> => {
  const userAlice = await PushAPI.initialize(signer, { env });
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
