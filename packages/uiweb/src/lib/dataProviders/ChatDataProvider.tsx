// React + Web3 Essentials
import { ReactNode, useEffect, useRef, useState } from 'react';

// External Packages
import { PushAPI, SignerType } from '@pushprotocol/restapi';

// Internal Compoonents
import {
  ChatDataContext,
  IChatDataContextValues,
} from '../context/chatContext';
import { getAddressFromSigner, pCAIP10ToWallet, traceStackCalls } from '../helpers';
import useChatProfile from '../hooks/chat/useChatProfile';
import usePushUserInfoUtilities from '../hooks/chat/useUserInfoUtilities';
import useCreateChatProfile from '../hooks/useCreateChatProfile';
import useDecryptPGPKey from '../hooks/useDecryptPGPKey';
import useGetChatProfile from '../hooks/useGetChatProfile';
import usePushUser from '../hooks/usePushUser';
import useUserProfile from '../hooks/useUserProfile';

// Internal Configs
import { lightChatTheme } from '../components/chat/theme';
import { ThemeContext } from '../components/chat/theme/ThemeProvider';
import { Constants, ENV, GUEST_MODE_ACCOUNT } from '../config';

// Assets

// Interfaces & Types
import { IUser } from '@pushprotocol/restapi';
import { IChatTheme } from '../components/chat/theme';

// Constants

// Exported Interfaces & Types
export interface IChatUIProviderProps {
  children: ReactNode;
  theme?: IChatTheme;
  account?: string | null;
  signer?: SignerType | undefined;
  pgpPrivateKey?: string | null;
  user?: PushAPI | undefined;
  env?: ENV;
}

// Exported Functions
export const ChatUIProvider = ({
  children,
  user = undefined,
  account = undefined,
  signer = undefined,
  env = Constants.ENV.PROD,
  pgpPrivateKey = null,
  theme,
}: IChatUIProviderProps) => {

  // Hooks
  // To initialize user
  const { initializeUser } = usePushUser();

  // State Variables
  const [pushUser, setPushUser] = useState<PushAPI | undefined>(user);
  
  const [accountVal, setAccountVal] = useState<string | null>(
    pCAIP10ToWallet(account!)
  );
  const [pushChatSocket, setPushChatSocket] = useState<any>(null);
  const [signerVal, setSignerVal] = useState<SignerType | undefined>(signer);
  const [pushChatStream, setPushChatStream] = useState<any>(null);

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
  const { fetchUserProfile } = useUserProfile();

  const [isPushChatStreamConnected, setIsPushChatStreamConnected] =
    useState<boolean>(false);

  // Setup Push User
  const initialize = async (user: PushAPI) => {
    console.debug(`UIWeb::ChatDataProvider::user changed - ${new Date().toISOString()}`, user);
    // traceStackCalls();

    // Setup Push User and other related states
    resetStates();
    setPushUser(user);
  }

  // // If 
  // useEffect(() => {
  //   if (!user) {
  //     return
  //   }

  //   // add timestamp over here
  //   const timestamp = new Date().toISOString();
  //   console.debug(`${timestamp}::ChatPreviewList::user changed`, user);
  //   traceStackCalls();

  //   (async () => {
  //     resetStates();
  
  //     let address = null;
  //     if (Object.keys(signer || {}).length && !user) {
  //        address = await getAddressFromSigner(signer!);
  //     } else if (!signer && user) {
  //       const profile = await fetchUserProfile({user});
  //       if(profile)
  //       address = (pCAIP10ToWallet(profile.account));
  //     } 
     

  //     setEnvVal(env);
  //     setAccountVal(address || GUEST_MODE_ACCOUNT);
  //     setSignerVal(signer);
    
  //     setPushUser(user);
  //     // setPgpPrivateKeyVal(user.decyptedPgpPrivateKey);
  //   })();
  // }, [user]);
  
  // Initializer if user is not passed but env, signer, account is passed
  useEffect(() => {
    // if user is there then ignore everything else
    if (user) {
      initialize(user);
      return;
    }

    // if user is not there then initialize user
    // case 1: if pgpPrivateKey and account is present
    // case 2: if env and signer is present, signer can be used to derive account
    if ((pgpPrivateKey && account) || (env && signer)) {
      (async () => {
        const user = await initializeUser({
          signer: signer,
          account: account,
          pgpPrivateKey: pgpPrivateKey,
          env: env,
        });
        initialize(user);
      })();
      return;
    }

    // If all else fail, initialize user in guest mode or read mode
    (async () => {
      const user = await initializeUser({
        signer: signer,
        account: account || GUEST_MODE_ACCOUNT,
        pgpPrivateKey: pgpPrivateKey,
        env: env,
      });
      initialize(user);
    })();
    return;

  }, [signer, account, env, pgpPrivateKey, user]);

  // useEffect(() => {
  //   (async () => {

  //     if ((accountVal && envVal ) ) {
  //       const pushUser = await initializeUser({
  //         signer: signerVal,
  //         account: accountVal!,
  //         env: envVal,
  //       });
  //       setPushUser(pushUser);
  //     }
  //   })();
  // }, [signerVal, accountVal, envVal]);

  // useEffect(() => {
  //   (async () => {
  //     if (pushUser && !pushUser?.readmode()&& !pgpPrivateKeyVal) {
  //       const encryptionInfo = await fetchEncryptionInfo({user:pushUser});
  //       if (encryptionInfo)
  //         setPgpPrivateKeyVal(encryptionInfo.decryptedPgpPrivateKey);
  //     }
  //   })();
  // }, [pushUser]);

  const resetStates = () => {
    setPushChatSocket(null);
    setIsPushChatSocketConnected(false);
    setPushChatStream(null);
    setIsPushChatStreamConnected(false);
  };

  // useEffect(() => {
  //   (async () => {
  //     let user;
  //     if (account) {
  //       user = await fetchUserProfile({ profileId: account, env,user });
  //       if (user) setConnectedProfile(user);
  //     }
  //   })();
  // }, [account, env, pgpPrivateKey]);

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
    user: pushUser,
    setUser: setPushUser,
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
