import { ethers } from 'ethers';
import type { Web3Provider, InfuraProvider } from '@ethersproject/providers';

/**
 * 
 * @param wallet nft:eip155:nftChainId:nftContractAddress:nftTokenId
 * @returns 
 */
export const isValidCAIP10NFTAddress = (wallet: string): boolean => {
  try {
    const walletComponent = wallet.split(':');
    return (
      (walletComponent.length === 5 || walletComponent.length === 6)&&
      walletComponent[0].toLowerCase() === 'nft' &&
      !isNaN(Number(walletComponent[4])) &&
      Number(walletComponent[4]) > 0 &&
      !isNaN(Number(walletComponent[2])) &&
      Number(walletComponent[2]) > 0 &&
      ethers.utils.isAddress(walletComponent[3]) &&
      walletComponent[1] === 'eip155'
    );
  } catch (err) {
    return false;
  }
};

export const walletToPCAIP10 = (account:string): string => {
  if(isValidCAIP10NFTAddress(account) || account.includes('eip155:')){
    return account
  }
  return 'eip155:' + account
}

export const pCAIP10ToWallet = (wallet: string): string => {
  if(wallet)
  wallet = wallet.replace('eip155:', '');
  return wallet;
};

export const resolveEns = (address: string, provider: Web3Provider) => {
  const walletLowercase = pCAIP10ToWallet(address).toLowerCase();
  const checksumWallet = ethers.utils.getAddress(walletLowercase);
  // let provider = ethers.getDefaultProvider('mainnet');
  // if (
  //   window.location.hostname == 'app.push.org' ||
  //   window.location.hostname == 'staging.push.org' ||
  //   window.location.hostname == 'dev.push.org' ||
  //   window.location.hostname == 'alpha.push.org' ||
  //   window.location.hostname == 'w2w.push.org'
  // ) {
  //   provider = new ethers.providers.InfuraProvider(
  //     'mainnet',
  //     appConfig.infuraAPIKey
  //   );
  // }


  provider.lookupAddress(checksumWallet).then((ens) => {
    if (ens) {
      return ens;
    } else {
      return null;
    }
  });
};

export const resolveNewEns = (address: string, provider: InfuraProvider) => {
  const walletLowercase = pCAIP10ToWallet(address).toLowerCase();
  const checksumWallet = ethers.utils.getAddress(walletLowercase);
  // let provider = ethers.getDefaultProvider('mainnet');
  // if (
  //   window.location.hostname == 'app.push.org' ||
  //   window.location.hostname == 'staging.push.org' ||
  //   window.location.hostname == 'dev.push.org' ||
  //   window.location.hostname == 'alpha.push.org' ||
  //   window.location.hostname == 'w2w.push.org'
  // ) {
  //   provider = new ethers.providers.InfuraProvider(
  //     'mainnet',
  //     appConfig.infuraAPIKey
  //   );
  // }

  provider.lookupAddress(checksumWallet).then((ens) => {
    if (ens) {
      return ens;
    } else {
      return null;
    }
  });
};

export const isPCAIP = (id: string) => {
  const prefix = `eip155:`;
  return id?.startsWith(prefix);
};