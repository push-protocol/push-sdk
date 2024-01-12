import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useContext } from 'react';
import { SignerType } from '@pushprotocol/restapi';

export interface CreateChatProfileParams {
  signer: SignerType | undefined;
  env:PushAPI.Env
}

const useCreateChatProfile = () => {
  const createChatProfile = useCallback(
    async ({
      signer,
      env
    }: CreateChatProfileParams): Promise<PushAPI.IUser | undefined> => {
      try {
        const profile = await PushAPI.user.create({
          env: env,
          signer: signer,
        });
        return profile;
      } catch (error) {
        console.error(error);
        return;
      }
    },
    []
  );

  return { createChatProfile };
};

export default useCreateChatProfile;
