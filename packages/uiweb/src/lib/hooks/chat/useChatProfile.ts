import { useCallback, useContext } from 'react';
import { useChatData } from './useChatData';
import { Env } from '@pushprotocol/restapi';
import { PushAPI } from "@pushprotocol/restapi";

export interface FetchProfileParams {
  profileId?: string;
  env?: Env;
  pushUser?: PushAPI;
}

const useChatProfile = () => {
  const { pushUser:contextPushUser } = useChatData();
  const fetchChatProfile = useCallback(
    async ({
      profileId,
      pushUser = contextPushUser,
      //note: remove env when chat and notification component is shifted to class based
      env
    }: FetchProfileParams): Promise<any> => {
      try {
        let userReadOnly;
        
        if(profileId && pushUser)
         userReadOnly = await pushUser!.info({ overrideAccount: profileId });
        else
         userReadOnly = await pushUser!.info();
        return userReadOnly;
      } catch (error) {
        console.log(error);
        return;
      }
    },
    []
  );

  return { fetchChatProfile };
};

export default useChatProfile;
