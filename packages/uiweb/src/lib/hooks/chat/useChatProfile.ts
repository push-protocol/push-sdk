import {PushAPI} from '@pushprotocol/restapi';
import { useCallback, useContext } from 'react';
import { useChatData } from './useChatData';
import { Env } from '@pushprotocol/restapi';

export interface FetchProfileParams {
  profileId?: string;
  env?: Env;
  user?:PushAPI;
}

const useChatProfile = () => {
  const { user:contextUser } = useChatData();
  const fetchChatProfile = useCallback(
    async ({
      profileId,
      user= contextUser,
      //note: remove env when chat and notification component is shifted to class based
      env
    }: FetchProfileParams): Promise<any> => {
      try {
        let userReadOnly;
        if(user){
          if(profileId)
          userReadOnly = await user!.info({ overrideAccount: profileId });
         else
          userReadOnly = await user!.info();
        }
     
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
