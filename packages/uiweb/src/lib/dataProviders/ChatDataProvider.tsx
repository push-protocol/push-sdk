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
  account = '0x0000000000000000000000000000000000000000',
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

      if (Object.keys(signer ||{}).length) {
     
          const address = await getAddressFromSigner(signer!);
          setAccountVal(address);
     
      }
      setSignerVal(signer);
    })()

  }, [env, account, signer])

  useEffect(() => {
      (async() => {

        if(accountVal && envVal){
          const pushUser = await initializePushUser({signer: signerVal, account: accountVal!,env:envVal});
          setPushUser(pushUser);
        }
         
   
      })();
  }, [signerVal, accountVal, envVal])

  const resetStates = () => {
    setPushChatSocket(null);
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