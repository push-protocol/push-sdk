import { PushAPI, Env } from '@pushprotocol/restapi';
import { useCallback } from 'react';
import { useChatData } from './useChatData';
import { SignerType } from '../../types';

export interface GetProfileParams {
  profileId: string;
  env: Env;
}

const useChatProfile = () => {
// const { env, account, pushUser } = useChatData();
  const fetchChatProfile = useCallback(
    async ({
      profileId,
      env
    }: GetProfileParams): Promise<any> => {
      try {
        // const userReadOnly = await userAlice.info({ overrideAccount: "sss" });
        // const userReadOnlyData = (await userReadOnly.info());
        // return userReadOnlyData;
      } catch (error) {
        console.log("error", error);
        return;
      }
    },
    []
  );

  return { fetchChatProfile };
};

export default useChatProfile;