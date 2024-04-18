import type { InfuraProvider, Web3Provider } from '@ethersproject/providers';
import { CONSTANTS, Env, PushAPI, SignerType } from '@pushprotocol/restapi';
import { ethers } from 'ethers';
import {
  CoreContractChainId,
  InfuraAPIKey,
} from '../config';
import { getUdResolver } from './udResolver';

/**
 *
 * @param wallet nft:eip155:nftChainId:nftContractAddress:nftTokenId
 * @returns
 */
export const isValidCAIP10NFTAddress = (wallet: string): boolean => {
  try {
    const walletComponent = wallet.split(':');
    return (
      (walletComponent.length === 5 || walletComponent.length === 6) &&
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

export const walletToPCAIP10 = (account: string): string => {
  if (account) {
    if (isValidCAIP10NFTAddress(account) || account.includes('eip155:')) {
      return account;
    }
    return 'eip155:' + account;
  }
  return account;
};

export const pCAIP10ToWallet = (wallet: string): string => {
  if (wallet) wallet = wallet.replace('eip155:', '');
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

export const getProvider = (user: PushAPI | undefined): any => {
  const envKey = user ? user.env : CONSTANTS.ENV.PROD; // Default to 'PROD' if user.env is not in Constants.ENV
  const chainId = CoreContractChainId[envKey as keyof typeof CoreContractChainId]; // Use 'as' to assert the type
  const provider = new ethers.providers.InfuraProvider(chainId, InfuraAPIKey);

  return provider;
}

export const resolveWeb3Name = async (
  address: string,
  user: PushAPI | undefined,
) => {
  const walletLowercase = pCAIP10ToWallet(address).toLowerCase();
  const checksumWallet = ethers.utils.getAddress(walletLowercase);
 
  // get provider
  const provider = getProvider(user);

  let result: string | null = null;

  try {
   const ens =  await provider.lookupAddress(checksumWallet)
      if (ens) {
        result = ens;
        // return ens;
      } else {
        try {
          const udResolver = getUdResolver(user ? user.env : CONSTANTS.ENV.PROD);
          // attempt reverse resolution on provided address
          const udName = await udResolver.reverse(checksumWallet);
          if (udName) {
            result = udName
          } else {
            result = null;
          }
        } catch (err) {
          console.debug(err);
        }
      }

  } catch (err) {
    console.debug(err);
  }

  return result;
};

export const isPCAIP = (id: string) => {
  const prefix = `eip155:`;
  return id?.startsWith(prefix);
};

export const getAddressFromSigner = async (
  signer: SignerType
): Promise<string> => {
  if ('getAddress' in signer) {
    return await signer.getAddress();
  } else {
    return signer.account['address'] ?? undefined;
  }
};
