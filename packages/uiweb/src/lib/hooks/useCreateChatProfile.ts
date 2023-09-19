import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useContext } from 'react';
import { SignerType } from '@pushprotocol/restapi';

export interface CreateChatProfileParams {
  signer: SignerType | undefined;
  env:PushAPI.Env
}

const useCreateChatProfile = () => {
  const creteChatProfile = useCallback(
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
        console.log(error);
        return;
      }
    },
    []
  );

  return { creteChatProfile };
};

export default useCreateChatProfile;
