import { SignerType, CONSTANTS } from '@pushprotocol/restapi';
import { ethers } from 'ethers';
import { ENV, allowedNetworks } from '../config';
import { createWeb3Name } from '@web3-name-sdk/core';
import { getUdResolverClient } from './udResolver';

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
  // only return the last part of the wallet after :
  if (wallet) {
    wallet = wallet.split(':').pop() ?? '';
  }

  return wallet;
};

export const resolveWeb3Name = async (address: string, incomingEnv: ENV | undefined) => {
  const env = (incomingEnv || CONSTANTS.ENV.PROD) as ENV;
  const walletLowercase = pCAIP10ToWallet(address).toLowerCase();
  const checksumWallet = ethers.utils.getAddress(walletLowercase);
  const web3NameClient = createWeb3Name();

  let result: string | null = null;

  try {
    result = await web3NameClient.getDomainName({
      address: checksumWallet,
      queryChainIdList: allowedNetworks[env],
    });
    if (!result) {
      const udResolverClient = getUdResolverClient(env);
      if (!udResolverClient) {
        throw new Error('UIWeb::helpers::address::resolveWeb3Name::Error in UD resolver');
      }
      // attempt reverse resolution on provided address
      const udDomainName = await udResolverClient.reverse(checksumWallet);

      if (udDomainName) {
        result = udDomainName;
      }
    }
  } catch (err) {
    console.error('UIWeb::helpers::address::resolveWeb3Name::Error in resolving via ENS', err);
  }

  // console.debug(`UIWeb::helpers ::address::resolveWeb3Name::Wallet: ${checksumWallet} resolved to ${result}`);
  return result;
};

export const isPCAIP = (id: string) => {
  const prefix = `eip155:`;
  return id?.startsWith(prefix);
};

export const getAddressFromSigner = async (signer: SignerType): Promise<string> => {
  if ('getAddress' in signer) {
    return await signer.getAddress();
  } else {
    return signer.account['address'] ?? undefined;
  }
};
