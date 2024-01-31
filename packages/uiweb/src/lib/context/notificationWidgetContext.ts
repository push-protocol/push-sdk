import { Env,IMessageIPFS, IUser, PushAPI, SignerType } from "@pushprotocol/restapi";
import { Constants } from "../config";
import { createContext } from "react";


export interface INotificationWidgetDataContextValues {
    account: string | null;
    setAccount: React.Dispatch<React.SetStateAction<string| null>>;
    signer: SignerType | undefined;
    setSigner: React.Dispatch<React.SetStateAction<SignerType | undefined>>;
    env: Env;
    setEnv: React.Dispatch<React.SetStateAction<Env>>;
    user: PushAPI | undefined;
    setUser: React.Dispatch<React.SetStateAction<PushAPI | undefined>>;
}

export const initialNotificationWidgetDataContextValues: INotificationWidgetDataContextValues = {
    account: null,
    setAccount: () => {
      /**/
    },
    signer: undefined,
    setSigner: () => {
      /**/
    },
    env: Constants.ENV.PROD,
    setEnv: () => {
      /**/
    },
  
    user: undefined,
    setUser: () => {
      /** */
    },
  

}


export const NotificationWidgetDataContext = createContext<INotificationWidgetDataContextValues>(
    initialNotificationWidgetDataContextValues
  );