import { Env,IMessageIPFS, IUser, PushAPI, SignerType } from "@pushprotocol/restapi";
import { Constants } from "../config";
import { createContext } from "react";


export interface IChatDataContextValues {
    account: string | null;
    setAccount: React.Dispatch<React.SetStateAction<string| null>>;
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
    setUser: React.Dispatch<React.SetStateAction<PushAPI| undefined>>;
    pushChatStream: any;
    setPushChatStream: React.Dispatch<React.SetStateAction<any>>;
    isPushChatStreamConnected: boolean;
    setIsPushChatStreamConnected: React.Dispatch<React.SetStateAction<boolean>>;
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

}


export const ChatDataContext = createContext<IChatDataContextValues>(
    initialChatDataContextValues
  );