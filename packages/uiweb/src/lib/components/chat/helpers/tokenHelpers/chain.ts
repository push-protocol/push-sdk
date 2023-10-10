const getInfuraUrlFor = (network: string, key: string) =>
  `https://${network}.infura.io/v3/${key}`;

const getRpcURL = (network: string, key: string) => {
  return getInfuraUrlFor(network, key);
};

export const getChainRPC = (chainId: number): string => {
  // TODO: use key as secrect
  const key = "183499af0dd447c782ffe67f3ef7fa11";
  switch (chainId) {
    case 1:
      return getRpcURL("mainnet", key);
    case 137:
      return getRpcURL("polygon-mainnet", key);
    case 10:
      return getRpcURL("optimism-mainnet", key);
    case 56:
      return "https://bsc-dataseed.binance.org/";
    case 5:
      return getRpcURL("goerli", key);
    case 420:
      return getRpcURL("optimism-goerli", key);
    case 80001:
      return getRpcURL("polygon-mumbai", key);
    case 97:
      return "https://data-seed-prebsc-1-s1.binance.org:8545";
    default:
      return getRpcURL("mainnet", key);
  }
};
