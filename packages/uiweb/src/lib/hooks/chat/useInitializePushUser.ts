import {PushAPI, SignerType} from '@pushprotocol/restapi';
import { useCallback, useContext } from 'react';
import { useChatData } from './useChatData';

export interface ProfileParams {
  signer: SignerType;
  account:string;
}

const useInitializePushUser = () => {
  const { env } = useChatData();

  const initializePushUser = useCallback(
    async ({
      signer,
      account
    }: ProfileParams): Promise<any> => {
      try {
        const pushUser = await PushAPI.initialize(signer, {env: env,account:account})
        return pushUser;
      } catch (error) {
        console.log(error);
        return;
      }
    },
    []
  );

  return { initializePushUser };
};

export default useInitializePushUser;
