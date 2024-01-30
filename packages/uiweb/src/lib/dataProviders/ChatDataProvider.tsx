import { useState, ReactNode, useEffect } from 'react';
import { Constants, ENV } from '../config';
import {
  ChatDataContext,
  IChatDataContextValues,
} from '../context/chatContext';
import { ThemeContext } from '../components/chat/theme/ThemeProvider';
import useGetChatProfile from '../hooks/useGetChatProfile';
import { IUser, PushAPI, SignerType } from '@pushprotocol/restapi';
import { IChatTheme, lightChatTheme } from '../components/chat/theme';
import { getAddressFromSigner, pCAIP10ToWallet } from '../helpers';
import useCreateChatProfile from '../hooks/useCreateChatProfile';
import useDecryptPGPKey from '../hooks/useDecryptPGPKey';
import useInitializePushUser from '../hooks/chat/useInitializePushUser';
import useChatProfile from '../hooks/chat/useChatProfile';
import { GUEST_MODE_ACCOUNT } from '../components/chat/constants';
import usePushUserInfoUtilities from '../hooks/chat/usePushUserInfoUtilities';

export interface IChatUIProviderProps {
  children: ReactNode;
  theme?: IChatTheme;
  account?: string | null;
  signer?: SignerType | undefined;
  pgpPrivateKey?: string | null;
  pushUser?: PushAPI | undefined;
  env?: ENV;
}

export const ChatUIProvider = ({
  children,
  account = undefined,
  pushUser = undefined,
  theme,
  pgpPrivateKey = null,
  signer = undefined,
  env = Constants.ENV.PROD,
}: IChatUIProviderProps) => {
  const [accountVal, setAccountVal] = useState<string | null>(
    pCAIP10ToWallet(account!)
  );
  const [pushChatSocket, setPushChatSocket] = useState<any>(null);
  const [signerVal, setSignerVal] = useState<SignerType | undefined>(signer);
  const [pushChatStream, setPushChatStream] = useState<any>(null);
  const [pushUserVal, setPushUserVal] = useState<PushAPI | undefined>(pushUser);

  const [pgpPrivateKeyVal, setPgpPrivateKeyVal] = useState<string | null>(
    pgpPrivateKey
  );
  const [envVal, setEnvVal] = useState<ENV>(env);
  const [connectedProfile, setConnectedProfile] = useState<IUser | undefined>(
    undefined
  );

  const [isPushChatSocketConnected, setIsPushChatSocketConnected] =
    useState<boolean>(false);
  const { fetchEncryptionInfo } = usePushUserInfoUtilities();
  const { initializePushUser } = useInitializePushUser();
  const { fetchChatProfile } = useChatProfile();

  const [isPushChatStreamConnected, setIsPushChatStreamConnected] =
    useState<boolean>(false);
  useEffect(() => {
    (async () => {
      resetStates();
      setEnvVal(env);

      if (Object.keys(signer || {}).length && !pushUser) {
        const address = await getAddressFromSigner(signer!);
        setAccountVal(address);
      } else if (!signer && pushUser) {
        const profile = await fetchChatProfile({pushUser});
  
        setAccountVal(profile?.wallets);
      } else {
        setAccountVal(GUEST_MODE_ACCOUNT);
      }
      setSignerVal(signer);
      setPushUserVal(pushUser);
      setPgpPrivateKeyVal(pgpPrivateKey);
    })();
  }, [env, account, signer, pgpPrivateKey,pushUser]);

  useEffect(() => {
    (async () => {

      if (accountVal && envVal && !pushUserVal ) {
        const pushUser = await initializePushUser({
          signer: signerVal,
          account: accountVal!,
          env: envVal,
        });
        setPushUserVal(pushUser);
      }
    })();
  }, [signerVal, accountVal, envVal]);

  useEffect(() => {
    (async () => {
      if (pushUserVal && !pgpPrivateKeyVal) {
        const encryptionInfo = await fetchEncryptionInfo({pushUser:pushUserVal});
        if (encryptionInfo)
          setPgpPrivateKeyVal(encryptionInfo.decryptedPgpPrivateKey);
      }
    })();
  }, [pushUserVal]);


  const resetStates = () => {
    setPushChatSocket(null);
    setIsPushChatSocketConnected(false);
    setPushChatStream(null);
    setIsPushChatStreamConnected(false);
  };

  useEffect(() => {
    (async () => {
      let user;
      if (account) {
        user = await fetchChatProfile({ profileId: account, env ,pushUser});
        if (user) setConnectedProfile(user);
      }
    })();
  }, [account, env, pgpPrivateKey]);

  const value: IChatDataContextValues = {
    account: accountVal,
    signer: signerVal,
    setSigner: setSignerVal,
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
    setConnectedProfile,
    pushChatStream,
    setPushChatStream,
    isPushChatStreamConnected,
    setIsPushChatStreamConnected,
    pushUser: pushUserVal,
    setPushUser: setPushUserVal,
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
