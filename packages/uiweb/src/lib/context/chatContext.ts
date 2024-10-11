import { Env, IMessageIPFS, IUser, PushAPI, SignerType } from '@pushprotocol/restapi';
import { createContext } from 'react';
import { Constants } from '../config';

export interface IChatDataContextValues {
  account: string | null;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
  pgpPrivateKey: string | null;
  setPgpPrivateKey: React.Dispatch<React.SetStateAction<string | null>>;
  signer: SignerType | undefined;
  setSigner: React.Dispatch<React.SetStateAction<SignerType | undefined>>;
  env: Env;
  setEnv: React.Dispatch<React.SetStateAction<Env>>;
  pushChatSocket: any;
  setPushChatSocket: React.Dispatch<React.SetStateAction<any>>;
  isPushChatSocketConnected: boolean;
  setIsPushChatSocketConnected: React.Dispatch<React.SetStateAction<boolean>>;
  connectedProfile: IUser | undefined;
  setConnectedProfile: (connectedProfile: IUser) => void;
  user: PushAPI | undefined;
  setUser: React.Dispatch<React.SetStateAction<PushAPI | undefined>>;
  preInitializeUser: (account: string | null | undefined, signer: SignerType | undefined) => void;
  pushChatStream: any;
  setPushChatStream: React.Dispatch<React.SetStateAction<any>>;
  isPushChatStreamConnected: boolean;
  setIsPushChatStreamConnected: React.Dispatch<React.SetStateAction<boolean>>;
  toast: any;
  infuraProjectId: string | null;
  uiConfig: {
    suppressToast?: boolean;
  };
  chatStream: any;
  chatAcceptStream: any;
  chatRejectStream: any;
  chatRequestStream: any;
  groupCreateStream: any;
  groupUpdateStream: any;
  participantJoinStream: any;
  participantLeaveStream: any;
  participantRemoveStream: any;
  participantRoleChangeStream: any;
}

export const initialChatDataContextValues: IChatDataContextValues = {
  account: null,
  setAccount: () => {
    /**/
  },
  signer: undefined,
  setSigner: () => {
    /**/
  },
  pgpPrivateKey: '',
  setPgpPrivateKey: () => {
    /**/
  },
  env: Constants.ENV.PROD,
  setEnv: () => {
    /**/
  },
  pushChatSocket: null,
  setPushChatSocket: () => {
    /** */
  },
  isPushChatSocketConnected: false,
  setIsPushChatSocketConnected: () => {
    /** */
  },
  connectedProfile: undefined,
  setConnectedProfile: () => {
    /**  */
  },
  preInitializeUser: () => {
    /**  */
  },
  user: undefined,
  setUser: () => {
    /** */
  },
  pushChatStream: null,
  setPushChatStream: () => {
    /** */
  },
  isPushChatStreamConnected: false,
  setIsPushChatStreamConnected: () => {
    /** */
  },
  toast: null,
  uiConfig: {
    suppressToast: false,
  },
  infuraProjectId: null,
  chatStream: {},
  chatAcceptStream: {},
  chatRejectStream: {},
  chatRequestStream: {},
  groupCreateStream: {},
  groupUpdateStream: {},
  participantJoinStream: {},
  participantLeaveStream: {},
  participantRemoveStream: {},
  participantRoleChangeStream: {},
};

export const ChatDataContext = createContext<IChatDataContextValues>(initialChatDataContextValues);
