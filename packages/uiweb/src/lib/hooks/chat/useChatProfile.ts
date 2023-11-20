import { PushAPI, Env } from '@pushprotocol/restapi';
import { useCallback } from 'react';
import { useChatData } from './useChatData';
import { SignerType } from '../../types';

export interface GetProfileParams {
  profileId?: string;
  env: Env;
  signer: SignerType;
  account?: string;
}

const useChatProfile = () => {
  const { signer, pushUser, setPushUser, setConnectedProfile, env } = useChatData();

  const fetchChatProfile = useCallback(
    async ({
      signer,
      account
    }: GetProfileParams): Promise<any> => {
      try {
        const userAlice = await PushAPI.initialize(
          signer!,
          {
            env: env,
            account: account
          });
        console.log("userAlice", userAlice, env);
        return userAlice;
      } catch (error) {
        console.log("error", error);
        return;
      }
    },
    [signer, pushUser, env]
  );

  return { fetchChatProfile };
};

export default useChatProfile;