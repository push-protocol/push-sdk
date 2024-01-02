import { Env,IMessageIPFS, IUser, SignerType } from "@pushprotocol/restapi";
import { Constants } from "../config";
import { createContext } from "react";
import { PushAPI } from "@pushprotocol/restapi";

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
    pushUser: PushAPI | null;
    setPushUser: React.Dispatch<React.SetStateAction<PushAPI| null>>;
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

    pushUser: null,

    setPushUser: () => {
       /**  */
    }
}


export const ChatDataContext = createContext<IChatDataContextValues>(
    initialChatDataContextValues
  );