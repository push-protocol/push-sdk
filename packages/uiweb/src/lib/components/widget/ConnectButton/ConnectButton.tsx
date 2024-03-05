import { useContext, useEffect,  } from 'react';

import styled from 'styled-components';

import { useAccount, useWidgetData } from '../../../hooks';
import { ThemeContext } from '../theme/ThemeProvider';

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
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
  signer: SignerType | undefined;
  setSigner: React.Dispatch<React.SetStateAction<SignerType | undefined>>;
}

export const ConnectButtonSub: React.FC<IConnectButtonSubProps> = ({
  autoconnect = false,
  setAccount,
  setSigner,
  signer,
}) => {
  const { env } = useWidgetData();
  const { wallet, connecting, connect, disconnect, provider, account } =
    useAccount({ env });

  const theme = useContext(ThemeContext);

  const setUserData = () => {
    if (wallet) {
      (async () => {
        const librarySigner = provider?.getSigner(account);
        setSigner(librarySigner);
        setAccount(account!);
      })();
    } else if (!wallet) {
      setAccount('');
      setSigner(undefined);
    }
    changeModalStyle('zIndex', '2000');
  };
  useEffect(() => {
    if (wallet && !autoconnect) {
      disconnect(wallet);
    }
    setUserData();
  }, [wallet]);

  const changeModalStyle = (property: any, value: string) => {
    const widgetmodal = document.getElementById('widget-modal-overlay');
    if (widgetmodal) {
      widgetmodal.style[property] = value;
    }
  };

  const handleConnect = () => {
    changeModalStyle('zIndex', 'unset');
    connect();
  };

  return !signer ? (
    <ConnectButtonDiv theme={theme}>
      <button onClick={() => (wallet ? disconnect(wallet) : handleConnect())}>
        {connecting ? 'connecting' : wallet ? 'disconnect' : 'Connect Wallet'}
      </button>
    </ConnectButtonDiv>
  ) : (
    <></>
  );
};

//styles
const ConnectButtonDiv = styled.div<IThemeProps>`
  width: 100%;

  button {
    background: ${(props) =>
      `${props.theme.backgroundColor?.buttonBackground}!important`};
    color: ${(props) => `${props.theme.textColor?.buttonText}!important`};
    text-align: center;
    font-size: 1em;
    cursor: pointer;
    border-radius: 10px;
    padding: 10px 20px;
    outline: none;
    border: none;
    cursor: pointer;
    width: 100%;
    font-weight: 600;
  }
  button:hover {
    scale: 1.05;
    transition: 0.3s;
  }
  @media ${device.mobileL} {
    font-size: 12px;
  }
  body.modal-open {
    overflow-y: hidden;
  }
  body.svelte-baitaa {
    z-index: 99999;
  }
`;
