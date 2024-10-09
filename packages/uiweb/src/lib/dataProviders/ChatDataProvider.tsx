// React + Web3 Essentials
import { ReactNode, useEffect, useRef, useState } from 'react';

// External Packages
import { CONSTANTS, PushAPI, SignerType } from '@pushprotocol/restapi';

// Internal Compoonents
import { ChatDataContext, IChatDataContextValues } from '../context/chatContext';
import { pCAIP10ToWallet } from '../helpers';

import usePushUserInfoUtilities from '../hooks/chat/useUserInfoUtilities';

import useToast from '../components/chat/reusables/NewToast'; // Re-write this later
import usePushUser from '../hooks/usePushUser';

// Internal Configs
import { lightChatTheme } from '../components/chat/theme';
import { ThemeContext } from '../components/chat/theme/ThemeProvider';
import { Constants, ENV, GUEST_MODE_ACCOUNT } from '../config';

// Assets

// Interfaces & Types
import { IUser } from '@pushprotocol/restapi';
import { IChatTheme } from '../components/chat/theme';
import { GlobalStyle } from '../components/reusables';
import { Web3OnboardDataProvider } from './Web3OnboardDataProvider';

// Constants
// Save original console methods
const originalConsole = {
  log: console.log,
  debug: console.debug,
  warn: console.warn,
  error: console.error,
};

// Exported Interfaces & Types
export interface IChatUIProviderProps {
  children: ReactNode;
  theme?: IChatTheme;
  account?: string | null;
  signer?: SignerType | undefined;
  pgpPrivateKey?: string | null;
  user?: PushAPI | undefined;
  env?: ENV;
  debug?: boolean;
  uiConfig?: {
    suppressToast?: boolean;
  };
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
  debug = false,
  uiConfig = {},
}: IChatUIProviderProps) => {
  // Now destructure with a default value for suppressToast
  const { suppressToast = false } = uiConfig;

  // Hooks
  // To initialize user
  const { initializeUser } = usePushUser();

  // State Variables
  const [pushUser, setPushUser] = useState<PushAPI | undefined>(user);

  const [accountVal, setAccountVal] = useState<string | null>(pCAIP10ToWallet(account!));
  const [pushChatSocket, setPushChatSocket] = useState<any>(null);
  const [signerVal, setSignerVal] = useState<SignerType | undefined>(signer);
  const [pushChatStream, setPushChatStream] = useState<any>(null);

  const [pgpPrivateKeyVal, setPgpPrivateKeyVal] = useState<string | null>(pgpPrivateKey);
  const [envVal, setEnvVal] = useState<ENV>(env);
  const [connectedProfile, setConnectedProfile] = useState<IUser | undefined>(undefined);

  const [isPushChatSocketConnected, setIsPushChatSocketConnected] = useState<boolean>(false);
  const { fetchEncryptionInfo } = usePushUserInfoUtilities();
  const { fetchUserProfile } = usePushUser();

  const [isPushChatStreamConnected, setIsPushChatStreamConnected] = useState<boolean>(false);

  // setup toast
  const [toastify, setToastify] = useState<any>(null);

  const [chatStream, setChatStream] = useState<any>({}); // to track any new messages
  const [chatAcceptStream, setChatAcceptStream] = useState<any>({}); // to track any new messages
  const [chatRejectStream, setChatRejectStream] = useState<any>({}); // to track any rejected request

  const [chatRequestStream, setChatRequestStream] = useState<any>({}); // any message in request
  const [participantRoleChangeStream, setParticipantRoleChangeStream] = useState<any>({}); // to track if a participant role is changed in a  group

  const [participantRemoveStream, setParticipantRemoveStream] = useState<any>({}); // to track if a participant is removed from group
  const [participantLeaveStream, setParticipantLeaveStream] = useState<any>({}); // to track if a participant leaves a group
  const [participantJoinStream, setParticipantJoinStream] = useState<any>({}); // to track if a participant joins a group
  const [groupCreateStream, setGroupCreateStream] = useState<any>({}); // to track if group is created

  const [groupUpdateStream, setGroupUpdateStream] = useState<any>({}); //group updation stream

  // Setup Push User
  const initialize = async (user: PushAPI) => {
    // Setup Push User and other related states but only if uid of user is different
    if (user && pushUser && !shouldCreateNewPushUser(user)) {
      return;
    }

    console.debug(`UIWeb::ChatDataProvider::user changed - ${new Date().toISOString()}`, user);

    if (!user?.readmode()) {
      await initStream(user);
    }

    // traceStackCalls();

    resetStates();
    setPushUser(user);
  };

  // Check if new push user should be created
  const shouldCreateNewPushUser = (user: PushAPI) => {
    // check if push sdk is already initialized with same account
    return !(
      pushUser &&
      user?.account === pushUser?.account &&
      user?.env === pushUser?.env &&
      user?.signer === pushUser?.signer &&
      user?.readmode() === pushUser?.readmode()
    );
  };

  // initialize toast hook
  const { showLoaderToast, showMessageToast } = useToast();

  // Initialize toastify but only once
  useEffect(() => {
    if (showLoaderToast && showMessageToast) {
      console.debug('UIWeb::useToast::initialize::UIWeb::ChatDataProvider::Toastify initialized');
      setToastify({ showLoaderToast: showLoaderToast, showMessageToast: showMessageToast });
    }
  }, []);

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

  const preInitializeUser = (account: string | null | undefined, signer: SignerType | undefined) => {
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
  };
  // Initializer if user is not passed but env, signer, account is passed
  useEffect(() => {
    preInitializeUser(account, signer);
  }, [signer, account, env, pgpPrivateKey, user]);

  // To setup debug parameters
  useEffect(() => {
    if (debug) {
      console.debug('UIWeb::ChatDataProvider::Debug mode enabled, console logs are enabled');
      enableConsole();
    } else {
      console.warn('UIWeb::ChatDataProvider::Debug mode is turned off, console logs are suppressed');
      disableConsole();
    }
  }, [debug]);

  // Function to disable console logs
  const disableConsole = () => {
    console.log = () => undefined;
    console.debug = () => undefined;
    console.warn = () => undefined;
    console.error = () => undefined;
  };

  // Function to enable console logs
  const enableConsole = () => {
    console.log = originalConsole.log;
    console.debug = originalConsole.debug;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  };

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
  //       user = await fetchUserProfile({ profileId: account,user });
  //       if (user) setConnectedProfile(user);
  //     }
  //   })();
  // }, [account, env, pgpPrivateKey]);

  const initStream = async (userInstance: PushAPI) => {
    let status = 0; // 0 - no change, 1 - new init, 2 - reinit

    // if user stream is not initialized
    if (!userInstance.stream) {
      await userInstance?.initStream(
        [CONSTANTS.STREAM.CHAT, CONSTANTS.STREAM.CHAT_OPS, CONSTANTS.STREAM.CONNECT, CONSTANTS.STREAM.DISCONNECT],
        {
          connection: {
            retries: 3, // number of retries in case of error
          },
          raw: true,
        }
      );

      // new init
      status = 1;
    }
    // if user stream is already initialized
    else if (userInstance.stream && !userInstance?.readmode()) {
      // check what streams are already connected
      const connectedStreams = await userInstance.stream.info();
      const streams = [
        CONSTANTS.STREAM.CHAT,
        CONSTANTS.STREAM.CHAT_OPS,
        CONSTANTS.STREAM.CONNECT,
        CONSTANTS.STREAM.DISCONNECT,
      ];

      // check and filter out the streams which are not connected
      const streamsToConnect = streams.filter((stream) => !connectedStreams.listen?.includes(stream));

      if (streamsToConnect.length) {
        await userInstance.stream?.reinit(streams, {
          connection: {
            retries: 3, // number of retries in case of error
          },
        });

        // reinit
        status = 2;
      }
    }

    // attach listeners and connect if status is changed
    await attachListenersAndConnect(userInstance);

    // establish a new connection
    console.debug(
      `UIWeb::ChatDataProvider::initStream with ${
        status === 2 ? 'reinit' : status === 1 ? 'new init' : 'no change'
      } - ${new Date().toISOString()} | ${userInstance?.uid} | ${userInstance?.stream?.uid}`
    );
  };

  const attachListenersAndConnect = async (userInstance: PushAPI) => {
    // await userInstance.stream?.disconnect();

    userInstance?.stream?.on(CONSTANTS.STREAM.CONNECT, (err: Error) => {
      console.debug(
        'UIWeb::ChatDataProvider::attachListenersAndConnect::CONNECT',
        userInstance?.uid,
        userInstance?.stream?.uid,
        userInstance?.stream
      );
      setIsPushChatStreamConnected(true);
    });

    userInstance?.stream?.on(CONSTANTS.STREAM.DISCONNECT, (err: Error) => {
      console.debug('UIWeb::ChatDataProvider::attachListenersAndConnect::DISCONNECT', err);
      setIsPushChatStreamConnected(false);
    });

    //Listen for chat messages, your message, request, accept, rejected,
    userInstance?.stream?.on(CONSTANTS.STREAM.CHAT, (message: any) => {
      console.debug('UIWeb::ChatDataProvider::attachListenersAndConnect::CHAT Payload received', message);

      if (message.event === 'chat.request') {
        // dispatchEvent(new CustomEvent('chatRequestStream', { detail: message }));
        console.debug('UIWeb::ChatDataProvider::attachListenersAndConnect::chat.request', message);
        setChatRequestStream(message);
      } else if (message.event === 'chat.accept') {
        // dispatchEvent(new CustomEvent('chatAcceptStream', { detail: message }));
        console.debug('UIWeb::ChatDataProvider::attachListenersAndConnect::chat.accept', message);
        setChatAcceptStream(message);
      } else if (message.event === 'chat.reject') {
        // dispatchEvent(new CustomEvent('chatRejectStream', { detail: message }));
        console.debug('UIWeb::ChatDataProvider::attachListenersAndConnect::chat.reject', message);
        setChatRejectStream(message);
      } else if (message.event === 'chat.group.participant.remove') {
        // dispatchEvent(new CustomEvent('participantRemoveStream', { detail: message }));
        console.debug('UIWeb::ChatDataProvider::attachListenersAndConnect::chat.group.participant.remove', message);
        setParticipantRemoveStream(message);
      } else if (message.event === 'chat.group.participant.leave') {
        // dispatchEvent(new CustomEvent('participantLeaveStream', { detail: message }));
        console.debug('UIWeb::ChatDataProvider::attachListenersAndConnect::chat.group.participant.leave', message);
        setParticipantLeaveStream(message);
      } else if (message.event === 'chat.group.participant.join') {
        // dispatchEvent(new CustomEvent('participantJoinStream', { detail: message }));
        console.debug('UIWeb::ChatDataProvider::attachListenersAndConnect::chat.group.participant.join', message);
        setParticipantJoinStream(message);
      } else if (message.event === 'chat.group.participant.role') {
        // dispatchEvent(new CustomEvent('participantRoleChangeStream', { detail: message }));
        console.debug('UIWeb::ChatDataProvider::attachListenersAndConnect::chat.group.participant.role', message);
        setParticipantRoleChangeStream(message);
      } else if (message.event === 'chat.message') {
        // dispatchEvent(new CustomEvent('chatStream', { detail: message }));
        console.debug('UIWeb::ChatDataProvider::attachListenersAndConnect::chat.message', message);
        setChatStream(message);
      }
    });

    // Listen for group info
    userInstance?.stream?.on(CONSTANTS.STREAM.CHAT_OPS, (chatops: any) => {
      if (chatops.event === 'chat.group.update') {
        // dispatchEvent(new CustomEvent('groupUpdateStream', { detail: chatops }));
        console.debug('UIWeb::ChatDataProvider::attachListenersAndConnect::chat.group.update', chatops);
        setGroupUpdateStream(chatops);
      } else if (chatops.event === 'chat.group.create') {
        // dispatchEvent(new CustomEvent('groupCreateStream', { detail: chatops }));
        console.debug('UIWeb::ChatDataProvider::attachListenersAndConnect::chat.group.create', chatops);
        setGroupCreateStream(chatops);
      }
    });

    // setTimeout(async () => {
    //   console.debug('UIWeb::ChatDataProvider::attachListenersAndConnect::Timeout Connect', userInstance?.stream?.uid);
    if (!userInstance.stream?.connected()) {
      console.debug('UIWeb::ChatDataProvider::attachListenersAndConnect::Stream not connected', userInstance);

      await userInstance.stream?.connect();
      console.debug(
        'UIWeb::ChatDataProvider::attachListenersAndConnect::Stream listeners attached and stream connected',
        userInstance?.stream?.uid
      );
    } else {
      console.debug(
        'UIWeb::ChatDataProvider::attachListenersAndConnect::Stream listeners attached',
        userInstance?.stream?.uid
      );
    }
    // }, 1000);
  };

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
    preInitializeUser,
    pushChatStream,
    setPushChatStream,
    isPushChatStreamConnected,
    setIsPushChatStreamConnected,
    user: pushUser,
    setUser: setPushUser,
    toast: toastify,
    uiConfig: uiConfig,
    chatStream,
    chatRequestStream,
    chatAcceptStream,
    groupUpdateStream,
    chatRejectStream,
    participantRemoveStream,
    participantLeaveStream,
    participantJoinStream,
    participantRoleChangeStream,
    groupCreateStream,
  };

  const PROVIDER_THEME = Object.assign({}, lightChatTheme, theme);
  return (
    <ThemeContext.Provider value={PROVIDER_THEME}>
      <Web3OnboardDataProvider>
        <GlobalStyle />
        <ChatDataContext.Provider value={value}>{children}</ChatDataContext.Provider>
      </Web3OnboardDataProvider>
    </ThemeContext.Provider>
  );
};
