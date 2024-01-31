import { useState, ReactNode, useEffect } from 'react';
import { Constants, ENV } from '../config';
import {
  NotificationWidgetDataContext,
  INotificationWidgetDataContextValues,
} from '../context/notificationWidgetContext';
// import { ThemeContext } from '../components/chat/theme/ThemeProvider';
import { IUser, PushAPI, SignerType } from '@pushprotocol/restapi';
// import { IChatTheme, lightChatTheme } from '../components/chat/theme';
import { getAddressFromSigner, pCAIP10ToWallet } from '../helpers';
import useInitializePushUser from '../hooks/useInitializePushUser';
// import useChatProfile from '../hooks/chat/useChatProfile';
import { GUEST_MODE_ACCOUNT } from '../config/constants';
import usePushUserInfoUtilities from '../hooks/chat/usePushUserInfoUtilities';

export interface INotificationWidgetUIProviderProps {
  children: ReactNode;
//   theme?: IChatTheme;
  account?: string | null;
  signer?: SignerType | undefined;
  user?: PushAPI | undefined;
  env?: ENV;
}

export const NotificationWidgetUIProvider = ({
  children,
  account = undefined,
  user = undefined,
//   theme,
  signer = undefined,
  env = Constants.ENV.PROD,
}: INotificationWidgetUIProviderProps) => {
  const [accountVal, setAccountVal] = useState<string | null>(
    pCAIP10ToWallet(account!)
  );
  const [signerVal, setSignerVal] = useState<SignerType | undefined>(signer);
  const [userVal, setUserVal] = useState<PushAPI | undefined>(user);
  const [envVal, setEnvVal] = useState<ENV>(env);

  const { initializePushUser } = useInitializePushUser();
//   const { fetchChatProfile } = useChatProfile();

  const [isPushChatStreamConnected, setIsPushChatStreamConnected] =
    useState<boolean>(false);
  useEffect(() => {
    (async () => {
    //   resetStates();
      setEnvVal(env);

      if (Object.keys(signer || {}).length && !user) {
        const address = await getAddressFromSigner(signer!);
        setAccountVal(address);
      } else if (!signer && user) {
        // const profile = await fetchChatProfile({user});
  
        // setAccountVal(profile?.wallets);
      } else {
        setAccountVal(GUEST_MODE_ACCOUNT);
      }
      setSignerVal(signer);
      setUserVal(user);
    })();
  }, [env, account, signer,user]);

  useEffect(() => {
    (async () => {

      if (accountVal && envVal && !userVal ) {
        const pushUser = await initializePushUser({
          signer: signerVal,
          account: accountVal!,
          env: envVal,
        });
        setUserVal(pushUser);
      }
    })();
  }, [signerVal, accountVal, envVal]);



//   const resetStates = () => {
//     setPushChatSocket(null);
//     setIsPushChatSocketConnected(false);
//     setPushChatStream(null);
//     setIsPushChatStreamConnected(false);
//   };



  const value: INotificationWidgetDataContextValues = {
    account: accountVal,
    signer: signerVal,
    setSigner: setSignerVal,
    setAccount: setAccountVal,
    env: envVal,
    setEnv: setEnvVal,
    user: userVal,
    setUser: setUserVal,
  };

//   const PROVIDER_THEME = Object.assign({}, lightChatTheme, theme);
  return (
    // <ThemeContext.Provider value={PROVIDER_THEME}>
      <NotificationWidgetDataContext.Provider value={value}>
        {children}
      </NotificationWidgetDataContext.Provider>
    // </ThemeContext.Provider>
  );
};
