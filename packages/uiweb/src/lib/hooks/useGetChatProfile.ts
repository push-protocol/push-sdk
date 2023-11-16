import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useContext } from 'react';
import { Constants } from '../config';


export interface GetProfileParams {
  profileId: string;
  env:PushAPI.Env
}

const useGetChatProfile = () => {
  const fetchChatProfile = useCallback(
    async ({
      profileId,
      env 
    }: GetProfileParams): Promise<PushAPI.IUser | undefined> => {
      try {
        const profile = await PushAPI.user.get({
          env: env,
          account: profileId,
        });
        return profile;
      } catch (error) {
        console.log(error);
        return;
      }
    },
    []
  );

  return { fetchChatProfile };
};

export default useGetChatProfile;