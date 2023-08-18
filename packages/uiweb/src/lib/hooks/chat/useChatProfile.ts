import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useContext } from 'react';
import { useChatData } from './useChatData';

export interface ProfileParams {
  profileId: string;
}

const useChatProfile = () => {
  const { env } = useChatData();
  const fetchUserChatProfile = useCallback(
    async ({
      profileId
    }: ProfileParams): Promise<PushAPI.IUser | undefined> => {
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
    [env]
  );

  return { fetchUserChatProfile };
};

export default useChatProfile;
