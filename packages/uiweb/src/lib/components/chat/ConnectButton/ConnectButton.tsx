import styled from 'styled-components';
import { IChatTheme } from '../theme';
import { useChatData } from '../../../hooks';
import * as PushAPI from '@pushprotocol/restapi';
import { useContext, useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ThemeContext } from '../theme/ThemeProvider';
import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, useAccount, WagmiConfig } from 'wagmi';
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
import { ALCHEMY_API_KEY } from '../../../config';
import { useWalletClient } from 'wagmi';

/**
 * @interface IThemeProps
 * this interface is used for defining the props for styled components
 */
interface IThemeProps {
  theme?: IChatTheme;
}

export const ConnectButtonSub = () => {
  const {
    signer,
    pgpPrivateKey,
    account,
    env,
    setPgpPrivateKey,
    setAccount,
    setSigner,
  } = useChatData();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
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
  //for walletConnect
  const { connectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains,
  });

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });
  const handleConnect = async (openConnectModal: any) => {
    console.log(signer);
    if (signer) {
      if (!account) {
        // setAccount(signer.getAddress());
      }
      await handleUserCreation();
    } else {
      openConnectModal;
      //rainbowKit
    }
  };

  useEffect(() => {
    (async () => {
      setAccount(address as string);
      setSigner(walletClient as PushAPI.SignerType);
      await handleUserCreation();
    })();
  }, [address, walletClient]);

  //   const handlePgpDecryption = () =>{
  //     if(!pgpPrivateKey){

  //     }
  //   }
  const handleUserCreation = async () => {
    if (!account && !env) return;
    let user = await PushAPI.user.get({ account: account!, env: env });
    if (!user) {
      if (!signer) return;
      user = await PushAPI.user.create({
        signer: signer,
        env: env,
      });
    }
    if (user?.encryptedPrivateKey && !pgpPrivateKey) {
      const decryptPgpKey = await PushAPI.chat.decryptPGPKey({
        encryptedPGPPrivateKey: user.encryptedPrivateKey,
        account: account!,
        signer: signer,
        env: env,
      });
      setPgpPrivateKey(decryptPgpKey);
    }
  };

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            // Note: If your app doesn't use authentication, you
            // can remove all 'authenticationStatus' checks
            const ready = mounted && authenticationStatus !== 'loading';
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === 'authenticated');

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  style: {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button
                        onClick={() => handleConnect(openConnectModal)}
                        type="button"
                      >
                        Connect Wallet
                      </button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button onClick={openChainModal} type="button">
                        Wrong network
                      </button>
                    );
                  }

                  return (
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button
                        onClick={openChainModal}
                        style={{ display: 'flex', alignItems: 'center' }}
                        type="button"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 12,
                              height: 12,
                              borderRadius: 999,
                              overflow: 'hidden',
                              marginRight: 4,
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? 'Chain icon'}
                                src={chain.iconUrl}
                                style={{ width: 12, height: 12 }}
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                      </button>

                      <button onClick={openAccountModal} type="button">
                        {account.displayName}
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ''}
                      </button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

//styles
