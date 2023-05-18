import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useContext } from 'react';
import { ChatPropsContext } from '../../context';

export interface GetProfileParams {
  profileId: string;
}

const useGetChatProfile = () => {
  const { env } = useContext<any>(ChatPropsContext);
  const fetchChatProfile = useCallback(
    async ({
      profileId
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
