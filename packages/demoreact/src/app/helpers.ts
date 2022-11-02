import * as ethers from 'ethers';

const Constants = {
    ENV: {
      PROD: 'prod',
      STAGING: 'staging',
      DEV: 'dev'
    },
    PAGINATION: {
      INITIAL_PAGE: 1,
      LIMIT: 10,
      LIMIT_MIN: 1,
      LIMIT_MAX: 50
    },
    DEFAULT_CHAIN_ID: 5,
    DEV_CHAIN_ID: 99999,
    NON_ETH_CHAINS: [137, 80001],
    ETH_CHAINS: [1, 5]
};

export interface AddressValidatorsType {
  [key: string]: ({ address } : { address: string }) => boolean;
}

export function isValidETHAddress(address: string) {
  return ethers.utils.isAddress(address);
}

const AddressValidators: AddressValidatorsType = {
  // Ethereum
  'eip155': ({ address } : { address: string }) => {
    return isValidETHAddress(address);
  }
  // Add other chains here
};

export function validateCAIP(addressInCAIP: string) {
  const [
    blockchain,
    networkId,
    address
  ] = addressInCAIP.split(':');

  if (!blockchain) return false;
  if (!networkId) return false;
  if (!address) return false;

  const validatorFn = AddressValidators[blockchain];

  return validatorFn({ address });
}

export function getFallbackETHCAIPAddress(env: string, address: string) {
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
export function getCAIPAddress(env: string, address: string, msg?: string) {
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

// P = Partial CAIP
export const walletToPCAIP10 = (account:string): string => {
  if (account.includes('eip155:')) {
    return account
  }
  return 'eip155:' + account
}

export const pCAIP10ToWallet = (wallet: string): string => {
  wallet = wallet.replace('eip155:', '')
  return wallet
}