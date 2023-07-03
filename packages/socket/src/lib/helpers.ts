import * as Constants from './constants';
import { ENV } from './constants';
import { isAddress } from './ethersHelper';

export interface AddressValidatorsType {
  [key: string]: ({ address }: { address: string }) => boolean;
}

export function isValidETHAddress(address: string) {
  return isAddress(address);
}

const AddressValidators: AddressValidatorsType = {
  // Ethereum
  eip155: ({ address }: { address: string }) => {
    return isValidETHAddress(address);
  },
  // Add other chains here
};

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
      isAddress(walletComponent[3]) &&
      walletComponent[1] === 'eip155'
    );
  } catch (err) {
    return false;
  }
};

export function validateCAIP(addressInCAIP: string) {
  const [blockchain, networkId, address] = addressInCAIP.split(':');

  if (!blockchain) return false;
  if (!networkId) return false;
  if (!address) return false;

  if (isValidCAIP10NFTAddress(addressInCAIP)) return true;

  const validatorFn = AddressValidators[blockchain];

  return validatorFn({ address });
}

export function getFallbackETHCAIPAddress(env: ENV, address: string) {
  let chainId = 1; // by default PROD

  if (env === Constants.ENV.DEV || env === Constants.ENV.STAGING) {
    chainId = 5;
  }

  return `eip155:${chainId}:${address}`;
}

/**
 * This helper
 *  checks if a VALID CAIP
 *    return the CAIP
 *  else
 *    check if valid ETH
 *      return a CAIP representation of that address (EIP155 + env)
 *    else
 *      throw error!
 */
export function getCAIPAddress(env: ENV, address: string, msg?: string) {
  if (validateCAIP(address)) {
    return address;
  } else {
    if (isValidETHAddress(address)) {
      return getFallbackETHCAIPAddress(env, address);
    } else {
      throw Error(`Invalid Address! ${msg}`);
    }
  }
}

export const walletToPCAIP10 = (account: string): string => {
  if (account.includes('eip155:')) {
    return account;
  }
  return 'eip155:' + account;
};
