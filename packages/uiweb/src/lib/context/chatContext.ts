import { Env,IMessageIPFS } from "@pushprotocol/restapi";
import { Constants } from "../config";
import { createContext } from "react";

export type ChatMessagetype = { messages: IMessageIPFS[]; lastThreadHash: string | null };

export interface IChatDataContextValues {
    account: string | null;
    setAccount: React.Dispatch<React.SetStateAction<string| null>>;
    decryptedPgpPvtKey: string | null;
    setDecryptedPgpPvtKey: React.Dispatch<React.SetStateAction<string | null>>;
    env: Env;
    setEnv: React.Dispatch<React.SetStateAction<Env>>;
}

export const initialChatDataContextValues: IChatDataContextValues = {
    account: null,
    setAccount: () => {
      /**/
    },
    decryptedPgpPvtKey: null,
    setDecryptedPgpPvtKey: () => {
      /**/
    },
    env: Constants.ENV.DEV,
    setEnv: () => {
      /**/
    },

}


export const ChatDataContext = createContext<IChatDataContextValues>(
    initialChatDataContextValues
  );