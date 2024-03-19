import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useContext } from 'react';
import { ChatAndNotificationPropsContext } from '../context';
import { GUEST_MODE_ACCOUNT } from '../config';

export interface GetProfileParams {
  profileId?: string | undefined;
  env:PushAPI.Env
  user?:PushAPI.PushAPI | undefined
}

const useGetChatProfile = () => {
  const fetchChatProfile = useCallback(
    async ({
      profileId = GUEST_MODE_ACCOUNT,
      env,
      user
    }: GetProfileParams): Promise<PushAPI.IUser | undefined> => {
      try {
        const profile = await PushAPI.user.get({
          env: env,
          account: profileId!,
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
