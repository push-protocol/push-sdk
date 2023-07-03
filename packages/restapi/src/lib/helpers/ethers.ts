/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { ethers } from 'ethers';
export const isAddress = (address: string): boolean => {
  if (ethers.utils && ethers.utils.isAddress) {
    return ethers.utils.isAddress(address);
  } else {
    return ethers.isAddress(address);
  }
};

export const provider = (provider: any) => {
  if (ethers.providers && ethers.providers.Web3Provider) {
    return new ethers.providers.Web3Provider(provider);
  } else {
    return new ethers.BrowserProvider(provider);
  }
};

export const recoverAddress = (
  digest: ethers.BytesLike,
  signature: ethers.SignatureLike
): string => {
  if (ethers.utils && ethers.utils.recoverAddress) {
    return ethers.utils.recoverAddress(digest, signature);
  } else {
    return ethers.recoverAddress(digest, signature);
  }
};

export const hashMessage = (message: Uint8Array | string): string => {
  if (ethers.utils && ethers.utils.hashMessage) {
    return ethers.utils.hashMessage(message);
  } else {
    return ethers.hashMessage(message);
  }
};
