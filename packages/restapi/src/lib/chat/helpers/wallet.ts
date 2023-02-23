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