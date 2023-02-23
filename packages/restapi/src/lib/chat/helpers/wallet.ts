import { walletType } from "../../types";

export const getWallet = (options: walletType) => {
  const {
    account,
    signer
  } = options || {};

  return {
    account,
    signer
  };
}

export const getAccountAddress = async (options: walletType): Promise<string> => {
  const {
    account,
    signer
  } = options || {};

  return account || (await signer?.getAddress()) || ''
}