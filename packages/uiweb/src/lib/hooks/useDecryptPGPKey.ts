import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useContext } from 'react';
import { SignerType } from '@pushprotocol/restapi';

export interface DecryptPGPKeyParams {
  account: string;
  signer: SignerType | undefined;
  encryptedPrivateKey: string;
  env:PushAPI.Env
}

const useDecryptPGPKey = () => {
  const decryptPGPKey = useCallback(
    async ({
      account,
      encryptedPrivateKey,
      signer,
      env
    }: DecryptPGPKeyParams): Promise<string |  undefined> => {
      try {
        const decryptPgpKey = await PushAPI.chat.decryptPGPKey({
            encryptedPGPPrivateKey: encryptedPrivateKey,
            account: account!,
            signer: signer,
            env: env,
          });
        return decryptPgpKey;
      } catch (error) {
        console.log(error);
        return;
      }
    },
    []
  );

  return { decryptPGPKey };
};

export default useDecryptPGPKey;
