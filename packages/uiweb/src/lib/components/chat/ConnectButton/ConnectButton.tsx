import styled from 'styled-components';
import { IChatTheme } from '../theme';
import { useChatData } from '../../../hooks';
import * as PushAPI from '@pushprotocol/restapi';
import { useContext, useEffect, useState } from 'react';
import { init, useConnectWallet } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";
import { Signer, ethers } from 'ethers';

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
    if (wallet) {
      (async () => {

        const ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
        const signer = ethersProvider.getSigner()
        const newAdd = await getAddressFromSigner(signer)
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
