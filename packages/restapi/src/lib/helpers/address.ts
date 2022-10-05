import * as ethers from 'ethers';
import Constants from '../constants';

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

export type CAIPDetailsType = {
  blockchain: string;
  networkId: string;
  address: string;
};

export function getCAIPDetails(addressInCAIP: string) : CAIPDetailsType | null {
  if (validateCAIP(addressInCAIP)) {
    const [
      blockchain,
      networkId,
      address
    ] = addressInCAIP.split(':');

    return {
      blockchain,
      networkId,
      address
    };
  }

  return null;
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
      throw Error(`Invalid Address! ${msg} ADDRESS: ${address}`);
    }
  }
}