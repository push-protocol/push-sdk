import { useState, ReactNode, useEffect } from 'react';
import { Constants, ENV } from '../config';
import {
  ChatDataContext,
  IChatDataContextValues,
} from '../context/chatContext';
import { ThemeContext } from '../components/chat/theme/ThemeProvider';
import { SignerType } from '@pushprotocol/restapi';
import { IChatTheme, lightChatTheme } from '../components/chat/theme';
import { getAddressFromSigner, pCAIP10ToWallet } from '../helpers';
import useInitializePushUser from '../hooks/chat/useInitializePushUser';

export interface IChatUIProviderProps {
  children: ReactNode;
  theme?: IChatTheme;
  account?: string | null;
  signer?: SignerType | undefined;
  pgpPrivateKey?: string | null;
  env?: ENV;
}

export const ChatUIProvider = ({
  children,
  account = null,
  theme,
  signer = undefined,
  env = Constants.ENV.PROD,
}: IChatUIProviderProps) => {
  const [accountVal, setAccountVal] = useState<string | null>(pCAIP10ToWallet(account!));
  const [pushChatSocket, setPushChatSocket] = useState<any>(null);
  const [signerVal, setSignerVal] = useState<SignerType | undefined>(signer);
  const [pushUser, setPushUser] = useState<any>(null);
  const [envVal, setEnvVal] = useState<ENV>(env);
  const { initializePushUser } = useInitializePushUser();

  const [isPushChatSocketConnected, setIsPushChatSocketConnected] =
    useState<boolean>(false);

  useEffect(() => {
    (async () => {
      resetStates();
      setEnvVal(env);

      if (signer) {
        if (!account) {
          const address = await getAddressFromSigner(signer);
          setAccountVal(address);
        }
        else {
          setAccountVal(account);
        }
      }
      setSignerVal(signer);
    })()

  }, [env, account, pushUser, signer])


  useEffect(() => {
      (async() => {
        if(Object.keys(signerVal || {}).length && accountVal && !(Object.keys(pushUser || {}).length)) {
          const pushUser = await initializePushUser({signer: signerVal, account: accountVal})
          setPushUser(pushUser);
        }
      })();
  }, [signerVal, accountVal, env])

  const resetStates = () => {
    setPushChatSocket(null);
    setPushUser(null);
    setIsPushChatSocketConnected(false);

  };



  const value: IChatDataContextValues = {
    account: accountVal,
    signer: signerVal,
    setSigner: setSignerVal,
    setAccount: setAccountVal,
    env: envVal,
    setEnv: setEnvVal,
    pushChatSocket,
    setPushChatSocket,
    isPushChatSocketConnected,
    setIsPushChatSocketConnected,
    pushUser,
    setPushUser
  };


  const PROVIDER_THEME = Object.assign({}, lightChatTheme, theme);
  return (
    <ThemeContext.Provider value={PROVIDER_THEME}>
      <ChatDataContext.Provider value={value}>
        {children}
      </ChatDataContext.Provider>
    </ThemeContext.Provider>
  );
};