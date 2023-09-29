import { PushAPI } from '@pushprotocol/restapi';
import { config } from '../config';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { ethers } from 'ethers';

// CONFIGS
const { env, showAPIResponse } = config;

/**
 * NOTE :- REQUIREMENTS FOR RUNNING DELEGATE EXAMPLES
 * 1. A private key of wallet which already has a channel associated with it
 * 2. The wallet also has some goerli eth to pay gas fee of trx for adding / removing delegate
 */
export const runPushAPIDelegateCases = async (): Promise<void> => {
  if (!process.env.WALLET_PRIVATE_KEY) {
    console.log(
      'skipping PushAPI.delegate examples, no private key passed in .env'
    );
    return;
  }
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  // Signer Generation

  // Goerli Provider
  const provider = new ethers.providers.JsonRpcProvider(
    'https://goerli.blockpi.network/v1/rpc/public'
  );
  const signer = new ethers.Wallet(
    `0x${process.env.WALLET_PRIVATE_KEY}`,
    provider
  );
  const randomWallet = ethers.Wallet.createRandom().address;

  const balance = await provider.getBalance(signer.address);
  if (parseFloat(ethers.utils.formatEther(balance)) < 0.001) {
    console.log(
      'skipping PushAPI.delegate examples, wallet does not have enough balance to pay fee'
    );
  }
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  const userAlice = await PushAPI.initialize(signer, { env });

  const channelInfo = await userAlice.channel.info();
  if (!channelInfo) {
    console.log(
      'skipping PushAPI.delegate examples, no channel found for this wallet'
    );
  }
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.delegate.add');
  const addedDelegate = await userAlice.delegate.add(
    `eip155:5:${randomWallet}`
  );

  if (showAPIResponse) {
    console.log(addedDelegate);
  }
  console.log('PushAPI.delegate.add | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.delegate.get');
  const delegates = await userAlice.delegate.get();
  if (showAPIResponse) {
    console.log(delegates);
  }
  console.log('PushAPI.delegate.get | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.delegate.remove');
  const removedDelegate = await userAlice.delegate.remove(
    `eip155:5:${randomWallet}`
  );
  if (showAPIResponse) {
    console.log(removedDelegate);
  }
  console.log('PushAPI.delegate.remove | Response - 200 OK\n\n');
};
