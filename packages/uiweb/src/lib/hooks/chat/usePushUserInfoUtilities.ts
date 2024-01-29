import { useCallback } from "react";
import { useChatData } from "./index";
import { PushAPI } from "@pushprotocol/restapi";

export interface FetchEncryptionInfoParams {
   pushUser:PushAPI
}

const usePushUserInfoUtilities = () => {
    const {} = useChatData();
    const fetchEncryptionInfo = useCallback(async({pushUser}:FetchEncryptionInfoParams): Promise<any> => {
        try {
     
            const encryptionResponse = await pushUser?.encryption.info();
        
            return encryptionResponse;
        } catch (error) {
            console.log(error);
            return;
        }
    },
    [])
    // const updateUserProfile = useCallback(async(): Promise<any> => {
    //     try {
     
    //         // const encryptionResponse = await pushUser?.encryption.info();
        
    //         return encryptionResponse;
    //     } catch (error) {
    //         console.log(error);
    //         return;
    //     }
    // },
    // [])
    return {fetchEncryptionInfo};
};

export default usePushUserInfoUtilities;