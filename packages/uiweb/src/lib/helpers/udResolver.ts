import type { Env } from '@pushprotocol/restapi';
import Resolution from '@unstoppabledomains/resolution';
import { ethers } from 'ethers';
import { allowedNetworks, InfuraAPIKey, NETWORK_DETAILS } from '../config';

export const getUdResolver = (env:Env): Resolution => {
  const l1ChainId = allowedNetworks[env].includes(1) ? 1 : 5;
  const l2ChainId = allowedNetworks[env].includes(137) ? 137 : 80002;
  // ToDo: Enable for sepolia chainId once UD supports it
  // const l1ChainId = appConfig.allowedNetworks.includes(1) ? 1 : 11155111;
  return Resolution.fromEthersProvider({
    uns: {
      locations: {
        Layer1: {
          network: "mainnet", // add config for sepolia once it's supported by UD
          provider: new ethers.providers.InfuraProvider(l1ChainId, InfuraAPIKey),
        },
        Layer2: {
          network: NETWORK_DETAILS[l2ChainId].network,
          provider: new ethers.providers.InfuraProvider(l2ChainId, InfuraAPIKey),
        },
      },
    },
  });
};
