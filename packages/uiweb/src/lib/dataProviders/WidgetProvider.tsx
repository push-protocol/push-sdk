import { PushAPI, SignerType } from '@pushprotocol/restapi';
import { ReactNode, useEffect, useState } from 'react';
import { IWidgetTheme, lightWidgetTheme } from '../components/widget/theme';
import { ThemeContext } from '../components/widget/theme/ThemeProvider';
import { Constants, ENV } from '../config';
import { GUEST_MODE_ACCOUNT } from '../config/constants';
import { IWidgetDataContextValues, WidgetDataContext } from '../context/widgetContext';
import { getAddressFromSigner, pCAIP10ToWallet } from '../helpers';
import usePushUser from '../hooks/usePushUser';
import { Web3OnboardDataProvider } from './Web3OnboardDataProvider';

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
  const [accountVal, setAccountVal] = useState<string | null>(pCAIP10ToWallet(account!));
  const [signerVal, setSignerVal] = useState<SignerType | undefined>(signer);
  const [userVal, setUserVal] = useState<PushAPI | undefined>(user);
  const [envVal, setEnvVal] = useState<ENV>(env);
  const { initializeUser, fetchUserProfile } = usePushUser();

  useEffect(() => {
    (async () => {
      //   resetStates();

      setEnvVal(env);
      let address = null;
      if (Object.keys(signer || {}).length && !user) {
        address = await getAddressFromSigner(signer!);
      } else if (!signer && user) {
        const profile = await fetchUserProfile({ user });
        if (profile) address = pCAIP10ToWallet(profile?.wallets);
      }
      console.debug(account);
      setAccountVal(address || GUEST_MODE_ACCOUNT);
      setSignerVal(signer);

      setUserVal(user);
    })();
  }, [env, account, signer, user]);
  console.debug(accountVal, envVal, signerVal);

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
      <Web3OnboardDataProvider>
        <WidgetDataContext.Provider value={value}>{children}</WidgetDataContext.Provider>
      </Web3OnboardDataProvider>
    </ThemeContext.Provider>
  );
};
