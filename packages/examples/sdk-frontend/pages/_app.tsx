import type { AppProps } from 'next/app';

import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { infuraProvider } from 'wagmi/providers/infura';

import '@rainbow-me/rainbowkit/styles.css';
import '../styles/globals.css';
import { useEffect, useState } from 'react';
// import { SpacesUIProvider } from '@pushprotocol/uiweb';
// import { useSpaceComponents } from './../components/Spaces/useSpaceComponent';
import { AccountContext } from '../contexts';

const { chains, provider } = configureChains(
  [sepolia],
  [
    infuraProvider({ apiKey: '5524d420b29f4f7a8d8d2f582a0d43f7' }),
    publicProvider(),
  ]
);

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
  // const { spaceUI } = useSpaceComponents();

  const customtheme = {
    statusColorError: 'red',
  };

  return (
    // <SpacesUIProvider spaceUI={spaceUI} theme={customtheme}>
    { children }
    // </SpacesUIProvider>
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  const [loadWagmi, setLoadWagmi] = useState(false);
  const [pgpPrivateKey, setPgpPrivateKey] = useState<string>('');

  useEffect(() => {
    setLoadWagmi(true);
  }, []);

  return (
    <>
      {/* hacky fix for wagmi ssr hydration errors */}
      {loadWagmi ? (
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider theme={darkTheme()} chains={chains}>
            <AccountContext.Provider
              value={{ pgpPrivateKey, setPgpPrivateKey }}
            >
              {/* <SpacesComponentProvider> */}
              <Component {...pageProps} />
              {/* </SpacesComponentProvider> */}
            </AccountContext.Provider>
          </RainbowKitProvider>
        </WagmiConfig>
      ) : null}
    </>
  );
}

export default MyApp;
