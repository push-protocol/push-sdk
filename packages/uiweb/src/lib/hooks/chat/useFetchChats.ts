import type { Env, IFeeds } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useContext, useState } from 'react';
import { Constants } from '../../config';
import { ChatMainStateContext, ChatPropsContext } from '../../context';
import { getData, setData } from '../../helpers/chat/localStorage';
import type { ChatFeedsType} from '../../types';
import { LOCAL_STORAGE_KEYS } from '../../types';

interface fetchChats {
  page: number;
  chatLimit: number;
}

const useFetchChats = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { account, env, decryptedPgpPvtKey } =
    useContext<any>(ChatPropsContext);

  const fetchChats = useCallback(
    async ({ page, chatLimit }: fetchChats) => {
      setLoading(true);
      try {
        const chats: IFeeds[] = await PushAPI.chat.chats({
          account: account,
          toDecrypt: decryptedPgpPvtKey ? true : false,
          pgpPrivateKey: String(decryptedPgpPvtKey),
          page,
          limit: chatLimit,
          env: env,
        });

        //conversation to map from array
        const modifiedChatsObj: ChatFeedsType = {};

        for (const chat of chats) {
          if (!chat?.groupInformation) {
            modifiedChatsObj[chat.did ?? chat.chatId] = chat;
            if (!getData(chat.did ?? chat.chatId))
              setData({ chatId: chat.did ?? chat.chatId, value: chat });
          }
        }
        return modifiedChatsObj;
      } catch (error: Error | any) {
        setLoading(false);
        setError(error.message);
        console.log(error);
        return;
      } finally {
        setLoading(false);
      }
    },
    [decryptedPgpPvtKey]
  );

  return { fetchChats, error, loading };
};

export default useFetchChats;
