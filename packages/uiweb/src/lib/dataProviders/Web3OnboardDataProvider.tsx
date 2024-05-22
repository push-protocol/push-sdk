import coinbaseWalletModule from '@web3-onboard/coinbase';

import { BLOCKNATIVE_PROJECT_ID, InfuraAPIKey } from '../config';
import { Web3OnboardProvider } from '@web3-onboard/react';
import injectedModule, { ProviderLabel } from '@web3-onboard/injected-wallets';
import walletConnectModule from '@web3-onboard/walletconnect';
import init from '@web3-onboard/core';
import PushIcon from '../icons/Bell.svg';
import { ReactNode } from 'react';
import { AppMetaDataType, ChainType } from '../types';

const APP_META_DATA: AppMetaDataType = {
  name: 'Push Protocol',
  logo: PushIcon,
  icon: PushIcon,
  description: 'Example showcasing how to connect a wallet.',

  recommendedInjectedWallets: [{ name: 'MetaMask', url: 'https://metamask.io' }],
};

const wcv2InitOptions = {
  projectId: BLOCKNATIVE_PROJECT_ID,
  requiredChains: [1, 56],
};

const walletConnect = walletConnectModule(wcv2InitOptions);
const coinbaseWalletSdk = coinbaseWalletModule({ darkMode: true });
const CHAINS: ChainType[] = [
  {
    id: '0x1',
    token: 'ETH',
    label: 'Ethereum Mainnet',
    rpcUrl: `https://mainnet.infura.io/v3/${InfuraAPIKey}`,
  },
  {
    id: '0xAA36A7',
    token: 'ETH',
    label: 'Sepolia',
    rpcUrl: `https://sepolia.infura.io/v3/${InfuraAPIKey}`,
  },
  {
    id: '0x13882',
    token: 'MATIC',
    label: 'Polygon - Amoy',
    rpcUrl: 'https://rpc-amoy.polygon.technology',
  },
  {
    id: '0x38',
    token: 'BNB',
    label: 'Binance',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
  },
  {
    id: '0xA',
    token: 'OETH',
    label: 'Optimism',
    rpcUrl: 'https://mainnet.optimism.io',
  },
  {
    id: '0xA4B1',
    token: 'ARB-ETH',
    label: 'Arbitrum',
    rpcUrl: 'https://rpc.ankr.com/arbitrum',
  },
];

const wallets = [injectedModule(), walletConnect, coinbaseWalletSdk];
const web3OnBoard = init({
  wallets,
  chains: CHAINS,
  appMetadata: APP_META_DATA,
  accountCenter: {
    desktop: {
      enabled: false,
    },
    mobile: {
      enabled: false,
    },
  },
  connect: {
    autoConnectLastWallet: true,
  },
});

interface IWeb3OnboardDataProviderProps {
  children: ReactNode;
}
export const Web3OnboardDataProvider: React.FC<IWeb3OnboardDataProviderProps> = ({ children }) => {
  return <Web3OnboardProvider web3Onboard={web3OnBoard}>{children}</Web3OnboardProvider>;
};
