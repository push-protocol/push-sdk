
import type { Env, IFeeds } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useState } from 'react';
import { Constants } from '../../config';
import { ChatFeedsType } from '../../types';


interface FetchChatsParams {
    account: string;
    decryptedPgpPvtKey: string;
    env: Env;
  }

const useFetchChats = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchChats = useCallback(async (options:FetchChatsParams) => {
    const {
        account,
        decryptedPgpPvtKey,
        env = Constants.ENV.PROD
      } = options || {};
    setLoading(true);
    try {
      const chats:IFeeds[] = await PushAPI.chat.chats({
        account: account,
        toDecrypt: decryptedPgpPvtKey?true:false,
        pgpPrivateKey: String(decryptedPgpPvtKey),
        env: env
      });

      //conversation to map from array
      const modifiedChatsObj: ChatFeedsType= {};

      for (const chat of chats) {
        modifiedChatsObj[chat.did ?? chat.chatId] = chat;
      }

      return modifiedChatsObj;
    } catch (error: Error | any) {
      setLoading(false);
      setError(error.message);
      console.log(error);return;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchChats, error, loading };
};

export default useFetchChats;
