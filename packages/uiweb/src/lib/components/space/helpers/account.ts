import { ENV } from "../../../config";

const ACCOUNT_START_TYPE = {
  NFT: 'nft',
  GENERAL: 'eip155'
}

export const isNftProfile = (account: string) => {
  return account && account.split(':')[0] === ACCOUNT_START_TYPE.NFT;
}

export const spaceChainId = (account: string, env: ENV): number => {
  if (account && isNftProfile(account)) 
    return Number(account.split(':')[2]);
  return env === ENV.PROD ? 1: 5; // Ethereum Mainnet Id
}

export const isAccountsEqual = (account: string | undefined | null, userProfileWallet: string | undefined | null): boolean => {
  if (!account || !userProfileWallet) {
    return false;
  }
  
  if (isNftProfile(userProfileWallet)) {
    return userProfileWallet.toUpperCase().includes(account.toUpperCase());
  }

  return account.toUpperCase() === userProfileWallet.toUpperCase();
};

export const formatCryptoAddress = (account: string, length?: number) => {
  if (account.length < 11) {
      return account; // Not enough characters to format
  }

  if (!length) length = 5;

  const first5Chars = account.slice(0, length);
  const last5Chars = account.slice(-length);
  return `${first5Chars}...${last5Chars}`;
}
