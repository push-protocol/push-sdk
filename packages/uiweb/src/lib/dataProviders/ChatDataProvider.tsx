import { useState, ReactNode, useEffect } from 'react';
import { Constants, ENV } from '../config';
import {
  ChatDataContext,
  IChatDataContextValues,
} from '../context/chatContext';
import { ThemeContext } from '../components/chat/theme/ThemeProvider';
import { IChatTheme, lightTheme } from '../components/chat/theme';
import useGetChatProfile from '../hooks/useGetChatProfile';
import { IUser } from '@pushprotocol/restapi';

export interface IChatUIProviderProps {
  children: ReactNode;
  theme?: IChatTheme;
  customeTheme?: IChatTheme;
  account?: string | null;
  decryptedPgpPvtKey?: string | null;
  env?: ENV;
}

export const ChatUIProvider = ({
  children,
  account = null,
  theme,
  decryptedPgpPvtKey = null,
  env = Constants.ENV.PROD,
}: IChatUIProviderProps) => {
  const [accountVal, setAccountVal] = useState<string | null>(account);
  const [pushChatSocket, setPushChatSocket] = useState<any>(null);
  const [decryptedPgpPvtKeyVal, setDecryptedPgpPvtKeyVal] =
    useState<string | null>(decryptedPgpPvtKey);
  const [envVal, setEnvVal] = useState<ENV>(env);
  const {fetchChatProfile} = useGetChatProfile();
  const [connectedProfile,setConnectedProfile]=useState<IUser | undefined>(undefined);

  const [isPushChatSocketConnected, setIsPushChatSocketConnected] =
  useState<boolean>(false);

useEffect(()=>{
    setAccountVal(account)
    setDecryptedPgpPvtKeyVal(decryptedPgpPvtKey)
},[decryptedPgpPvtKey])

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
    decryptedPgpPvtKey: decryptedPgpPvtKeyVal,
    setDecryptedPgpPvtKey: setDecryptedPgpPvtKeyVal,
    env: envVal,
    setEnv: setEnvVal,
    pushChatSocket,
    setPushChatSocket,
    isPushChatSocketConnected,
    setIsPushChatSocketConnected,
    connectedProfile,
    setConnectedProfile
  };
  const PROVIDER_THEME = Object.assign({}, lightTheme, theme);
  return (
    <ThemeContext.Provider value={PROVIDER_THEME}>
      <ChatDataContext.Provider value={value}>
        {children}
      </ChatDataContext.Provider>
    </ThemeContext.Provider>
  );
};
