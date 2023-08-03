import { Env } from "@pushprotocol/restapi";
import { Constants } from "../config";
import { createContext } from "react";

export interface IChatDataContextValues {
    account: string;
    setAccount: React.Dispatch<React.SetStateAction<string>>;
    pgpPrivateKey: string;
    setPgpPrivateKey: React.Dispatch<React.SetStateAction<string>>;
    env: Env;
    setEnv: React.Dispatch<React.SetStateAction<Env>>;
}

export const initialChatDataContextValues: IChatDataContextValues = {
    account: '',
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
    }
}


export const ChatDataContext = createContext<IChatDataContextValues>(
    initialChatDataContextValues
  );