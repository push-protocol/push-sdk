import { ethers } from 'ethers';
import type { Web3Provider, InfuraProvider } from '@ethersproject/providers';
import { Env, SignerType } from '@pushprotocol/restapi';
import { getUdResolver } from './udResolver';
import { createWeb3Name } from '@web3-name-sdk/core';
import { BSC_RPC } from '../config';

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

  console.log('enssss', address);

  provider.lookupAddress(checksumWallet).then((ens) => {
    console.log('ens', ens);
    if (ens) {
      console.log('ens', ens);
      return ens;
    } else {
      return null;
    }
  });
};
// isko change karna hai spaceId se
export const resolveNewEns = async (
  address: string,
  provider: InfuraProvider,
  env: Env
) => {
  const walletLowercase = pCAIP10ToWallet(address).toLowerCase();
  const checksumWallet = ethers.utils.getAddress(walletLowercase);
  const web3Name = createWeb3Name();
  // const check

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


  let result: string | null = null;

  try {
    const ens = await provider.lookupAddress(checksumWallet)
    if (ens) {
      result = ens;
    } else {
      try {
        result = await web3Name.getDomainName({
          address: checksumWallet,
          rpcUrl: BSC_RPC[env],
          queryChainIdList: [137, 80001, 11155111, 97, 420, 56, 250, 128, 1287],
        })
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
    return signer.account['address'] ?? '';
  }
};
