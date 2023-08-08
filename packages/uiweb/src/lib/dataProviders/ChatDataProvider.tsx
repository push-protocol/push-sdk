import { useState, ReactNode, useEffect } from 'react';
import { Constants, ENV } from '../config';
import {
  ChatDataContext,
  IChatDataContextValues,
} from '../context/chatContext';
import { ThemeContext } from '../components/chat/theme/ThemeProvider';
import useGetChatProfile from '../hooks/useGetChatProfile';
import { IUser } from '@pushprotocol/restapi';
import { ChatThemeOptions, IChatTheme, getCustomChatTheme } from '../components/chat/theme';

export interface IChatUIProviderProps {
  children: ReactNode;
  theme?: ChatThemeOptions;
  themeOverride?: Partial<IChatTheme>;
  account?: string | null;
  pgpPrivateKey?: string | null;
  env?: ENV;
}

export const ChatUIProvider = ({
  children,
  account = null,
  theme,
  pgpPrivateKey = null,
  env = Constants.ENV.PROD,
}: IChatUIProviderProps) => {
  const [accountVal, setAccountVal] = useState<string | null>(account);
  const [pushChatSocket, setPushChatSocket] = useState<any>(null);
  const [pgpPrivateKeyVal, setPgpPrivateKeyVal] =
    useState<string | null>(pgpPrivateKey);
  const [envVal, setEnvVal] = useState<ENV>(env);
  const {fetchChatProfile} = useGetChatProfile();
  const [connectedProfile,setConnectedProfile]=useState<IUser | undefined>(undefined);

  const [isPushChatSocketConnected, setIsPushChatSocketConnected] =
  useState<boolean>(false);

useEffect(()=>{
    setAccountVal(account)
    setPgpPrivateKeyVal(pgpPrivateKey)
},[pgpPrivateKey])

useEffect(() => {
    (async () => {
      let user;
      if (account) {
        user = await fetchChatProfile({ profileId: account });

        if (user) setConnectedProfile(user);
      }
    })();
  }, [account]);

  const value: IChatDataContextValues = {
    account: accountVal,
    setAccount: setAccountVal,
    pgpPrivateKey: pgpPrivateKeyVal,
    setPgpPrivateKey: setPgpPrivateKeyVal,
    env: envVal,
    setEnv: setEnvVal,
    pushChatSocket,
    setPushChatSocket,
    isPushChatSocketConnected,
    setIsPushChatSocketConnected,
    connectedProfile,
    setConnectedProfile
  };


   const PROVIDER_THEME = getCustomChatTheme(theme);

  return (
    <ThemeContext.Provider value={PROVIDER_THEME}>
      <ChatDataContext.Provider value={value}>
        {children}
      </ChatDataContext.Provider>
    </ThemeContext.Provider>
  );
};
