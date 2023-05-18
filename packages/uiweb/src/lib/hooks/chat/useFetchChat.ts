import * as PushAPI from '@pushprotocol/restapi';
import { Env } from '@pushprotocol/restapi';
import { useCallback, useContext, useState } from 'react';
import { Constants } from '../../config';
import { ChatPropsContext } from '../../context';


interface fetchChat {
  recipientAddress: string;
  account: string;
  decryptedPgpPvtKey: string;
  env?: Env;
}

const useFetchChat = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { account, env,decryptedPgpPvtKey } =
  useContext<any>(ChatPropsContext);


  const fetchChat = useCallback(
    async ({ recipientAddress}: fetchChat) => {
      setLoading(true);
      try {
        const chat = await PushAPI.chat.chat({
          account: account,
          toDecrypt: decryptedPgpPvtKey ? true : false,
          pgpPrivateKey: String(decryptedPgpPvtKey),
          recipient: recipientAddress,
          env: env
        });
        return chat;
      } catch (error: Error | any) {
        setLoading(false);
        setError(error.message);
        console.log(error);
        return;
      }
    },
    [decryptedPgpPvtKey]
  );

  return { fetchChat, error, loading };
};

export default useFetchChat;
