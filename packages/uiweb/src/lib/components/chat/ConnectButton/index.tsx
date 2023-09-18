import { IChatTheme } from '../theme';

import { ConnectButtonSub } from './ConnectButton';
import { InfuraAPIKey } from '../../../config';
import { Web3OnboardProvider } from '@web3-onboard/react';
import injectedModule from '@web3-onboard/injected-wallets';
import walletConnectModule from '@web3-onboard/walletconnect'
import init from '@web3-onboard/core';
import { ethers } from 'ethers';


/**
 * @interface IThemeProps
 * this interface is used for defining the props for styled components
 */
interface IThemeProps {
  theme?: IChatTheme;
}

const wcv2InitOptions = {
  projectId: '64a44a0fb537407bfe97d24330e4109c',
  requiredChains: [1, 56]
}

const walletConnect = walletConnectModule(wcv2InitOptions)
//move to config
const chains = [
  {
    id: '0x1',
    token: 'ETH',
    label: 'Ethereum Mainnet',
    rpcUrl: `https://mainnet.infura.io/v3/${InfuraAPIKey}`
  },
  {
    id: '0x5',
    token: 'ETH',
    label: 'Goerli',
    rpcUrl: `https://goerli.infura.io/v3/${InfuraAPIKey}`
  },
  {
    id: '0x13881',
    token: 'MATIC',
    label: 'Polygon - Mumbai',
    rpcUrl: 'https://matic-mumbai.chainstacklabs.com'
  },
  {
    id: '0x38',
    token: 'BNB',
    label: 'Binance',
    rpcUrl: 'https://bsc-dataseed.binance.org/'
  },
  {
    id: '0xA',
    token: 'OETH',
    label: 'Optimism',
    rpcUrl: 'https://mainnet.optimism.io'
  },
  {
    id: '0xA4B1',
    token: 'ARB-ETH',
    label: 'Arbitrum',
    rpcUrl: 'https://rpc.ankr.com/arbitrum'
  }
]
const wallets = [injectedModule(), walletConnect]

//move to config
const appMetadata = {
  name: 'Push Protocol',
  icon: 'https://files.slack.com/files-pri/T011WQBLH39-F05QWQA0MSR/pushlogoblocknative.png',
  description: 'Example showcasing how to connect a wallet.',

  recommendedInjectedWallets: [
    { name: 'MetaMask', url: 'https://metamask.io' },
  ]
}

const web3OnBoard = init({
  wallets,
  chains,
  appMetadata,
  accountCenter: {
    desktop: {
      enabled: false
    },
    mobile: {
      enabled: false
    }
  },
  connect: {
    autoConnectLastWallet: true,
  }
})

export const ConnectButtonComp = ({ pageProps }: any) => {
  return (
    <Web3OnboardProvider web3Onboard={web3OnBoard}>
      <ConnectButtonSub {...pageProps} />
    </Web3OnboardProvider>
  );
};