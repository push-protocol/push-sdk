import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { ethers } from "ethers";

export interface AddressValidatorsType {
  [key: string]: ({ address }: { address: string }) => boolean;
}

export function isValidETHAddress(address: string) {
  return ethers.utils.isAddress(address);
}

const AddressValidators: AddressValidatorsType = {
  eip155: ({ address }: { address: string }) => {
    return isValidETHAddress(address);
  },
};

function validateCAIP(addressInCAIP: string) {
  const [blockchain, networkId, address] = addressInCAIP.split(":");

  if (!blockchain) return false;
  if (!networkId) return false;
  if (!address) return false;

  const validatorFn = AddressValidators[blockchain];

  return validatorFn({ address });
}

function getFallbackETHCAIPAddress(env: ENV, address: string) {
  let chainId = 1; // by default PROD

  if (env === ENV.DEV || env === ENV.STAGING) {
    chainId = 5;
  }

  return `eip155:${chainId}:${address}`;
}

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
