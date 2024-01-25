import { useCallback } from "react";
import { useChatData } from "./index";
import { PushAPI } from "@pushprotocol/restapi";

export interface FetchEncryptionInfoParams {
   user:PushAPI
}

const useUserInfoUtilities = () => {
    const fetchEncryptionInfo = useCallback(async({user}:FetchEncryptionInfoParams): Promise<any> => {
        try {
     
            const encryptionResponse = await user?.encryption.info();
        
            return encryptionResponse;
        } catch (error) {
            console.log(error);
            return;
        }
    },
    [])
    return {fetchEncryptionInfo};
};

export default useUserInfoUtilities;