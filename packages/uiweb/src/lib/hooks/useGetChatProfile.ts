import { PushAPI, Env } from '@pushprotocol/restapi';
import { useCallback, useContext, useEffect } from 'react';
import { ChatAndNotificationPropsContext } from '../context';
import { useChatData } from './chat';
import { SignerType } from '../types';

export interface GetProfileParams {
  profileId?: string;
  env: Env,
  signer: SignerType
}

const useGetChatProfile = () => {
  const { signer, alias, setAlias, setConnectedProfile } = useChatData();

  const fetchChatProfile = useCallback(
    async ({
      profileId,
      signer,
      env
    }: GetProfileParams): Promise<any> => {
      try {
        console.log('signerrr', signer);
        console.log("env", env)
        const userAlice = await PushAPI.initialize(
          signer!,
          {
            env: env
          });
        return userAlice;
      } catch (error) {
        console.log("errr", error);
        return;
      }
    },
    []
  );

  return { fetchChatProfile };
};

export default useGetChatProfile;