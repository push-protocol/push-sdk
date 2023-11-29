import { PushAPI, SignerType } from "@pushprotocol/restapi";
import { useCallback, useContext } from "react";
import { useChatData } from "./index";
import { ENV } from "../../config";

export interface ProfileParams {
    signer?: SignerType;
    account: string;
    env: ENV;
}

const useInitializePushUser = () => {
    console.log(useChatData())
    const initializePushUser = useCallback(async({signer, account,env}: ProfileParams): Promise<any> => {
        try {
            const pushUser = await PushAPI.initialize(signer!, {
                env: env,
                account: account
            })
            return pushUser;
        } catch (error) {
            console.log(error);
            return;
        }
    },
    [])
    return {initializePushUser};
};

export default useInitializePushUser;