import { useContext, useEffect, useState } from 'react';

import styled from 'styled-components';
import { ethers } from 'ethers';

import { useAccount } from '../../../hooks';
import { ThemeContext } from '../theme/ThemeProvider';


import { getAddressFromSigner } from '../../../helpers';
import { IWidgetTheme } from '../theme';
import { device } from '../../../config';
import { SignerType } from '@pushprotocol/restapi';

/**
 * @interface IThemeProps
 * this interface is used for defining the props for styled components
 */
interface IThemeProps {
  theme?: IWidgetTheme;
}


interface IConnectButtonSubProps {
  autoconnect?: boolean;
  setAccount: React.Dispatch<React.SetStateAction<string| null>>;
  signer: SignerType | undefined;
  setSigner: React.Dispatch<React.SetStateAction<SignerType | undefined>>;

}

export const ConnectButtonSub: React.FC<IConnectButtonSubProps> = ({autoconnect = false,setAccount,setSigner,signer })  => {
  const {wallet, connecting , connect, disconnect} = useAccount();

  const theme = useContext(ThemeContext);


  const setUserData = () => {
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
    }
  }
  useEffect(() => {
    if(wallet && !autoconnect)
    disconnect(wallet);
    setUserData()
  }, [wallet])

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
    background: ${(props) => `${props.theme.backgroundColor?.buttonBackground}!important`};
    color: ${(props) => `${props.theme.textColor?.buttonText}!important`};
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
  body.modal-open {
    overflow-y: hidden;
  }
`;