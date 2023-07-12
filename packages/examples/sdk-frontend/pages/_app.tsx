import type { AppProps } from 'next/app';

import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { goerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import '@rainbow-me/rainbowkit/styles.css';
import '../styles/globals.css';
import { useEffect, useState } from 'react';
import { SpacesUIProvider } from '@pushprotocol/uiweb';
import { useSpaceComponents } from './../components/Spaces/useSpaceComponent';

const { chains, provider } = configureChains([goerli], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: 'Connect',
  projectId: 'connect',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export interface ISpacesComponentProps {
  children: React.ReactNode;
}

const SpacesComponentProvider = ({ children }: ISpacesComponentProps) => {
  const { spaceUI } = useSpaceComponents();

  const customtheme = {
    statusColorError: 'red',
  };

  return (
    <SpacesUIProvider spaceUI={spaceUI} theme={customtheme}>
      {children}
    </SpacesUIProvider>
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  const [loadWagmi, setLoadWagmi] = useState(false);

  useEffect(() => {
    setLoadWagmi(true);
  }, []);

  return (
    <>
      {/* hacky fix for wagmi ssr hydration errors */}
      {loadWagmi ? (
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider theme={darkTheme()} chains={chains}>
            <SpacesComponentProvider>
              <Component {...pageProps} />
            </SpacesComponentProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      ) : null}
    </>
  );
}

export default MyApp;
