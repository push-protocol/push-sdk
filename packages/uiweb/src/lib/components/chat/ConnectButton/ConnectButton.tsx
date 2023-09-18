import styled from 'styled-components';
import { IChatTheme } from '../theme';
import { useAccount, useChatData } from '../../../hooks';
import * as PushAPI from '@pushprotocol/restapi';
import { useContext, useEffect, useState } from 'react';
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
  const {wallet, connecting , connect, disconnect} = useAccount();

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
        console.log(newAdd)
        setSigner(signer)
        setAccount(newAdd);
      })()
    } else if (!wallet) {
      setAccount('')
      setSigner(undefined)
      setPgpPrivateKey(null)
    }
  }
console.log(wallet)
  useEffect(() => {
    newFunc()
  }, [wallet])

console.log(account)
  useEffect(() => {
    (async () => {
      if (account && signer) {
        if (!pgpPrivateKey) await handleUserCreation();
      }
    })();
  }, [account, signer]);


  //move user creation to a hook
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
    cursor:pointer;
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
