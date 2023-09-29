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

export const runPushAPIAliasCases = async (): Promise<void> => {
  const userAlice = await PushAPI.initialize(signer, { env });
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.alias.info');
  const aliasInfo = await userAlice.alias.info({
    alias: '0x35B84d6848D16415177c64D64504663b998A6ab4',
    aliasChain: 'POLYGON',
  });
  if (showAPIResponse) {
    console.log(aliasInfo);
  }
  console.log('PushAPI.alias.info | Response - 200 OK\n\n');
};
