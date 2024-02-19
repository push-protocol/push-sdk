import { useState, ReactNode, useEffect } from 'react';
import { Constants, ENV } from '../config';
import {
  WidgetDataContext,
  IWidgetDataContextValues,
} from '../context/widgetContext';
import { PushAPI, SignerType } from '@pushprotocol/restapi';
import { getAddressFromSigner, pCAIP10ToWallet } from '../helpers';
import { GUEST_MODE_ACCOUNT } from '../config/constants';
import { IWidgetTheme, lightWidgetTheme } from '../components/widget/theme';
import { ThemeContext } from '../components/widget/theme/ThemeProvider';
import useUserProfile from '../hooks/useUserProfile';
import useInitializeUser from '../hooks/useInitializeUser';

export interface IWidgetUIProviderProps {
  children: ReactNode;
  theme?: IWidgetTheme;
  account?: string | null;
  signer?: SignerType | undefined;
  user?: PushAPI | undefined;
  env?: ENV;
}

export const WidgetUIProvider = ({
  children,
  account = undefined,
  user = undefined,
  theme,
  signer = undefined,
  env = Constants.ENV.PROD,
}: IWidgetUIProviderProps) => {
  const [accountVal, setAccountVal] = useState<string | null>(
    pCAIP10ToWallet(account!)
  );
  const [signerVal, setSignerVal] = useState<SignerType | undefined>(signer);
  const [userVal, setUserVal] = useState<PushAPI | undefined>(user);
  const [envVal, setEnvVal] = useState<ENV>(env);
  const { initializeUser } = useInitializeUser();
  const { fetchUserProfile } = useUserProfile();

  useEffect(() => {
    (async () => {
      //   resetStates();
      setEnvVal(env);
      if (Object.keys(signer || {}).length && !user) {
        const address = await getAddressFromSigner(signer!);
        setAccountVal(address);
      } else if (!signer && user) {
        const profile = await fetchUserProfile({ user });

        setAccountVal(pCAIP10ToWallet(profile?.wallets));
      } else {
        setAccountVal(GUEST_MODE_ACCOUNT);
      }
      setSignerVal(signer);
      setUserVal(user);
    })();
  }, [env, account, signer, user]);

  useEffect(() => {
    (async () => {
      if (accountVal && envVal) {
        const pushUser = await initializeUser({
          signer: signerVal,
          account: accountVal!,
          env: envVal,
        });
        setUserVal(pushUser);
      }
    })();
  }, [accountVal, envVal, signerVal]);

  //   const resetStates = () => {
  //     setPushChatSocket(null);
  //     setIsPushChatSocketConnected(false);
  //     setPushChatStream(null);
  //     setIsPushChatStreamConnected(false);
  //   };


  const value: IWidgetDataContextValues = {
    account: accountVal,
    signer: signerVal,
    setSigner: setSignerVal,
    setAccount: setAccountVal,
    env: envVal,
    setEnv: setEnvVal,
    user: userVal,
    setUser: setUserVal,
  };

  const PROVIDER_THEME = Object.assign({}, lightWidgetTheme, theme);
  return (
    <ThemeContext.Provider value={PROVIDER_THEME}>
      <WidgetDataContext.Provider value={value}>
        {children}
      </WidgetDataContext.Provider>
    </ThemeContext.Provider>
  );
};


