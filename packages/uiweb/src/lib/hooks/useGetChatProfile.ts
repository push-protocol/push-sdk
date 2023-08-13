import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useContext } from 'react';
import { ChatAndNotificationPropsContext } from '../context';

export interface GetProfileParams {
  profileId: string;
}

const useGetChatProfile = () => {
  const { env } = useContext<any>(ChatAndNotificationPropsContext);
  const fetchChatProfile = useCallback(
    async ({
      profileId
    }: GetProfileParams): Promise<PushAPI.IUser | undefined> => {
      try {
        const profile = await PushAPI.user.get({
          env: 'staging' as any,
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

  return { fetchChatProfile };
};

export default useGetChatProfile;
