import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import { ethers } from 'ethers';

export const useAccount = () => {
  const [{ wallet, connecting }, connect, disconnect, updateBalances, setWalletModules, setPrimaryWallet] =
    useConnectWallet();

  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain();

  const isActive = () => {
    return wallet && wallet.accounts.length > 0 ? true : false;
  };

  const switchChain = async (desiredChain: number) => {
    setChain({ chainId: ethers.utils.hexValue(desiredChain) });
  };

  return {
    wallet,
    connecting,
    connect,
    disconnect,
    updateBalances,
    setWalletModules,
    setPrimaryWallet,
    provider: wallet ? new ethers.providers.Web3Provider(wallet.provider, 'any') : undefined,
    account: wallet && wallet.accounts.length > 0 ? ethers.utils.getAddress(wallet.accounts[0].address) : undefined,
    chainId: connectedChain ? Number(connectedChain.id) : undefined,
    isActive,
    setChain,
    switchChain,
    settingChain,
    chains,
  };
};