import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';

export const walletToPCAIP10 = (account: string): string => {
  if (account.includes('eip155:')) {
    return account;
  }
  return 'eip155:' + account;
};

export const pCAIP10ToWallet = (wallet: string): string => {
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

export const isPCAIP = (id: string) => {
  const prefix = `eip155:`;
  return id?.startsWith(prefix);
};