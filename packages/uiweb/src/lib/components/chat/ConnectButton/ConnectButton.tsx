import styled from 'styled-components';
import { IChatTheme } from '../theme';
import { useChatData } from '../../../hooks';
import * as PushAPI from '@pushprotocol/restapi';
import { useContext, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

import './index.css';

import { useAccount } from 'wagmi';

import { useWalletClient } from 'wagmi';
import { ThemeContext } from '../theme/ThemeProvider';
import { device } from '../../../config';

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
  const theme = useContext(ThemeContext);

  useEffect(() => {
    (async () => {
      console.log(account, signer);
      if (!account) setAccount(address as string);
      if (!signer) setSigner(walletClient as PushAPI.SignerType);
    })();
  }, [address, walletClient]);

  useEffect(() => {
    (async () => {
      console.log(account);
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
      <ConnectButton />
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
    color: ${(props) => `${props.theme.backgroundColor.buttonText}!important`};
    text-align:center;
   
  }
  @media ${device.mobileL} {
    font-size: 12px;
  }
`;
