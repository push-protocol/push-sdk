import styled from 'styled-components';
import { IChatTheme } from '../theme';
import { useChatData } from '../../../hooks';
import * as PushAPI from '@pushprotocol/restapi';
import { useContext, useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { init, useConnectWallet } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";
import { Signer, ethers } from 'ethers';
import './index.css';
import { ThemeContext } from '../theme/ThemeProvider';
import { device } from '../../../config';
import { getAddressFromSigner } from '../../../helpers';

/**
 * @interface IThemeProps
 * this interface is used for defining the props for styled components
 */
interface IThemeProps {
  theme?: IChatTheme;
}

// const apiKey = 'f55f3a76-8510-4af8-9833-b7f85255de83'

// const injected = injectedModule();
// const coinbaseWalletSdk = coinbaseWalletModule({darkMode: true})

// init({
//   apiKey: apiKey,
//   wallets: [injected, coinbaseWalletSdk],
//   chains: [
//     {
//       id: '0x1',
//       token: 'ETH',
//       label: 'Ethereum Mainnet',
//       rpcUrl: `https://mainnet.infura.io/v3/${InfuraAPIKey}`
//     },
//     {
//       id: '0x2105',
//       token: 'ETH',
//       label: 'Base',
//       rpcUrl: 'https://mainnet.base.org'
//     }
//   ]
// })


// const infuraKey = 

export const ConnectButtonSub = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  const {
    signer,
    pgpPrivateKey,
    account,
    env,
    setPgpPrivateKey,
    setAccount,
    setSigner,
  } = useChatData();
  const theme = useContext(ThemeContext);

  const newFunc = () => {
    console.log("wallet getting called")
    if (wallet) {
      (async () => {
        console.log("Not sure what's happening lol")
        const ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
        const signer = ethersProvider.getSigner()
        const newAdd = await getAddressFromSigner(signer)
        console.log(newAdd, "newAdd")
        setSigner(signer)
        setAccount(newAdd);
      })()
    } else if (!wallet) {
      setAccount('')
      setSigner(undefined)
      setPgpPrivateKey(null)
    }
  }

  useEffect(() => {
    newFunc()
  }, [wallet])


  useEffect(() => {
    (async () => {
      if (account && signer) {
        if (!pgpPrivateKey) await handleUserCreation();
      }
    })();
  }, [account, signer]);

  const handleUserCreation = async () => {
    if (!account && !env) return;
    try {
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
    } catch (e: any) {
      console.log(e);
    }
  };
  return !signer ? (
    <ConnectButtonDiv theme={theme}>
      <button onClick={() => (wallet ? disconnect(wallet) : connect())}>{connecting ? 'connecting' : wallet ? 'disconnect' : 'Connect Wallet'}</button>
    </ConnectButtonDiv>
  ) : (
    <></>
  );
};

//styles
const ConnectButtonDiv = styled.div<IThemeProps>`
  width: fit-content;
 
  button{
    background: ${(props) => `${props.theme.backgroundColor.buttonBackground}!important`};
    // color: ${(props) => `${props.theme.backgroundColor.buttonText}!important`};
    color: #fff;
    text-align:center;
    font-size: 1em;
    border-radius: 10px;
    padding: 10px 20px;
    outline: none;
    border: none;
    cursor: pointer;
    font-weight: 600;
   
  }
  button:hover{
    scale: 1.05;
    transition: 0.3s;
  }
  @media ${device.mobileL} {
    font-size: 12px;
  }
`;
