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