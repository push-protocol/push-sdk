import { PushAPI, SignerType } from "@pushprotocol/restapi";
import { useCallback, useContext } from "react";
import { useChatData } from "./chat/index";
import { ENV } from "../config";

export interface InitializeUserParams {
    signer?: SignerType;
    account: string;
    env: ENV;
}

const useInitializeUser = () => {

    const initializeUser = useCallback(async({signer, account,env}: InitializeUserParams): Promise<any> => {
        try {
            const pushUser = await PushAPI.initialize(signer?? undefined, {
                env: env,
                account: account,
                alpha: { feature: ['SCALABILITY_V2'] },
            })
            return pushUser;
        } catch (error) {
            console.log(error);
            return;
        }
    },
    [])
    return {initializeUser};
};

export default useInitializeUser;