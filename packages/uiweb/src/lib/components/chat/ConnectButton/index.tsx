import styled from 'styled-components';
import { IChatTheme } from '../theme';
import { useChatData } from '../../../hooks';

import { ConnectButtonSub } from './ConnectButton';

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  zora,
  goerli,
  polygonMumbai,
  optimismGoerli,
  arbitrumGoerli,
  zoraTestnet,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { ALCHEMY_API_KEY, RAINBOW_APP_NAME, RAINBOW_PROJECT_ID } from '../../../config';
import { useWalletClient } from 'wagmi';

/**
 * @interface IThemeProps
 * this interface is used for defining the props for styled components
 */
interface IThemeProps {
  theme?: IChatTheme;
}

export const ConnectButtonComp = () => {
  const { chains, publicClient } = configureChains(
    [
      mainnet,
      polygon,
      optimism,
      arbitrum,
      zora,
      goerli,
      polygonMumbai,
      optimismGoerli,
      arbitrumGoerli,
      zoraTestnet,
    ],
    [alchemyProvider({ apiKey: ALCHEMY_API_KEY }), publicProvider()]
  );
  const {signer} = useChatData()

  //for walletConnect
  const { connectors } = getDefaultWallets({
    appName: RAINBOW_APP_NAME,
    projectId: RAINBOW_PROJECT_ID,
    chains,
  });

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });


  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <ConnectButtonSub />
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

//styles
