import { Env } from "@pushprotocol/restapi";
import { Constants } from "../config";
import { createContext } from "react";

export interface IChatDataContextValues {
    accountVal: string;
    setAccountVal: React.Dispatch<React.SetStateAction<string>>;
    pgpPrivateKeyVal: string;
    setPgpPrivateKeyVal: React.Dispatch<React.SetStateAction<string>>;
    envVal: Env;
    setEnvVal: React.Dispatch<React.SetStateAction<Env>>;
}

export const initialChatDataContextValues: IChatDataContextValues = {
    accountVal: '',
    setAccountVal: () => {
      /**/
    },
    pgpPrivateKeyVal: '',
    setPgpPrivateKeyVal: () => {
      /**/
    },
    envVal: Constants.ENV.DEV,
    setEnvVal: () => {
      /**/
    }
}


export const ChatDataContext = createContext<IChatDataContextValues>(
    initialChatDataContextValues
  );