import { PushAPI, SignerType } from '@pushprotocol/restapi';
import { useCallback, useContext } from 'react';
import { ENV } from '../config';
import { useChatData } from './chat/index';

export interface InitializeUserParams {
  signer?: SignerType | undefined;
  account?: string | null | undefined;
  pgpPrivateKey?: string | null | undefined;
  env: ENV;
}

export interface FetchProfileParams {
  profileId?: string;
  user?: PushAPI;
}

const usePushUser = () => {
  // For initializing user
  const initializeUser = useCallback(
    async ({
      signer,
      account,
      pgpPrivateKey,
      env,
    }: InitializeUserParams): Promise<any> => {
      try {
        const pushUser = await PushAPI.initialize(signer ?? undefined, {
          env: env,
          account: account,
          decryptedPGPPrivateKey: pgpPrivateKey,
          alpha: { feature: ['SCALABILITY_V2'] },
        });
        return pushUser;
      } catch (error) {
        console.error(
          `UIWeb::hooks::usePushUser::initializeUser::error: ${error}`
        );
        return;
      }
    },
    []
  );

  // For getting user profile
  const fetchUserProfile = useCallback(
    async ({
      profileId,
      user
    }: FetchProfileParams): Promise<any> => {
      try {
        let userReadOnly;
        
        if(profileId && user)
         userReadOnly = await user!.info({ overrideAccount: profileId });
        else
         userReadOnly = await user!.info();

        return userReadOnly;
      } catch (error) {
        console.error(
          `UIWeb::hooks::usePushUser::fetchUserProfile::error: ${error}`
        );
        return;
      }
    },
    []
  );

  return { initializeUser, fetchUserProfile };
};

export default usePushUser;
