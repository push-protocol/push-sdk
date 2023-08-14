import { Env,IMessageIPFS, IUser } from "@pushprotocol/restapi";
import { Constants } from "../config";
import { createContext } from "react";


export interface IChatDataContextValues {
    account: string | null;
    setAccount: React.Dispatch<React.SetStateAction<string| null>>;
    pgpPrivateKey: string | null;
    setPgpPrivateKey: React.Dispatch<React.SetStateAction<string | null>>;
    env: Env;
    setEnv: React.Dispatch<React.SetStateAction<Env>>;
    pushChatSocket: any;
    setPushChatSocket: React.Dispatch<React.SetStateAction<any>>;
    isPushChatSocketConnected: boolean;
    setIsPushChatSocketConnected: React.Dispatch<React.SetStateAction<boolean>>;
    connectedProfile: IUser | undefined;
    setConnectedProfile: (connectedProfile: IUser) => void;
}

export const initialChatDataContextValues: IChatDataContextValues = {
    account: null,
    setAccount: () => {
      /**/
    },
    pgpPrivateKey: '',
    setPgpPrivateKey: () => {
      /**/
    },
    env: Constants.ENV.DEV,
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
    }

}


export const ChatDataContext = createContext<IChatDataContextValues>(
    initialChatDataContextValues
  );