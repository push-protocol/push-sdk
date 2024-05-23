import { InfuraAPIKey } from '../../../../config';

const getInfuraUrlFor = (network: string, key: string) =>
  `https://${network}.infura.io/v3/${key}`;

const getRpcURL = (network: string, key: string) => {
  return getInfuraUrlFor(network, key);
};

export const getChainRPC = (chainId: number): string => {
  const key = InfuraAPIKey;

  switch (chainId) {
    case 1:
      return getRpcURL('mainnet', key);
    case 137:
      return getRpcURL('polygon-mainnet', key);
    case 10:
      return getRpcURL('optimism-mainnet', key);
    case 56:
      return 'https://bsc-dataseed.binance.org/';
    case 11155111:
      return getRpcURL('sepolia', key);
    case 11155420:
      return getRpcURL('optimism-sepolia', key);
    case 80002:
      return getRpcURL('polygon-amoy', key);
    case 97:
      return 'https://data-seed-prebsc-1-s1.binance.org:8545';
    default:
      return getRpcURL('mainnet', key);
  }
};
