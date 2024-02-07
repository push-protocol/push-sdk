
import coinbaseWalletModule from '@web3-onboard/coinbase'
import { ConnectButtonSub } from './ConnectButton';
import { BLOCKNATIVE_PROJECT_ID, InfuraAPIKey } from '../../../config';
import { Web3OnboardProvider } from '@web3-onboard/react';
import injectedModule, { ProviderLabel } from '@web3-onboard/injected-wallets';
import walletConnectModule from '@web3-onboard/walletconnect'
import init from '@web3-onboard/core';
import PushIcon from "../../../icons/Bell.svg"
import { SignerType } from '@pushprotocol/restapi';

const APP_META_DATA = {
  name: 'Push Protocol',
  logo: PushIcon,
  icon: PushIcon,
  description: 'Example showcasing how to connect a wallet.',

  recommendedInjectedWallets: [
    { name: 'MetaMask', url: 'https://metamask.io' },
  ]
}

const wcv2InitOptions = {
  projectId: BLOCKNATIVE_PROJECT_ID,
  requiredChains: [1, 56]
}

const walletConnect = walletConnectModule(wcv2InitOptions)
const coinbaseWalletSdk = coinbaseWalletModule({ darkMode: true })
const CHAINS = [
  {
    id: '0x1',
    token: 'ETH',
    label: 'Ethereum Mainnet',
    rpcUrl: `https://mainnet.infura.io/v3/${InfuraAPIKey}`
  },
  {
    id: '0xAA36A7',
    token: 'ETH',
    label: 'Sepolia',
    rpcUrl: `https://sepolia.infura.io/v3/${InfuraAPIKey}`
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


const wallets = [injectedModule(), walletConnect, coinbaseWalletSdk]




const web3OnBoard = init({
  wallets,
  chains:CHAINS,
  appMetadata:APP_META_DATA,
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

interface IConnectButtonCompProps {
  autoconnect?: boolean;
  setAccount: React.Dispatch<React.SetStateAction<string| null>>;
  signer: SignerType | undefined;
  setSigner: React.Dispatch<React.SetStateAction<SignerType | undefined>>;

}

export const ConnectButtonComp: React.FC<IConnectButtonCompProps> = ({ autoconnect,setAccount,setSigner,signer }) => {
  return (
    <Web3OnboardProvider web3Onboard={web3OnBoard}>
      <ConnectButtonSub autoconnect setAccount={setAccount} setSigner={setSigner} signer={signer} />
    </Web3OnboardProvider>
  );
};