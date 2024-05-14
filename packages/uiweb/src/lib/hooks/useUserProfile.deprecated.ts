import { Env, PushAPI } from '@pushprotocol/restapi';
import { useCallback, useContext } from 'react';

export interface FetchUserProfileParams {
  profileId?: string;
  env?: Env;
  user?: PushAPI;
}

const useUserProfile = () => {
  const fetchUserProfile = useCallback(
    async ({
      profileId,
      user,
      //note: remove env when chat and notification component is shifted to class based
      env
    }: FetchUserProfileParams): Promise<any> => {
      try {
        let userReadOnly;
        
        if(profileId && user)
         userReadOnly = await user!.info({ overrideAccount: profileId });
        else
         userReadOnly = await user!.info();

        return userReadOnly;
      } catch (error) {
        console.log(error);
        return;
      }
    },
    []
  );

  return { fetchUserProfile };
};

export default useUserProfile;
