
import * as PushAPI from '@pushprotocol/restapi';
import { Env, IMessageIPFS } from '@pushprotocol/restapi';
import { useCallback, useContext, useState } from 'react';
import { Constants } from '../../config';
import { ChatMainStateContext, ChatPropsContext } from '../../context';



  interface HistoryMessagesParams {
    threadHash: string;
    limit?: number;
  }
  

const useFetchHistoryMessages
 = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { chats,setChat,selectedChatId} =
  useContext<any>(ChatMainStateContext);
  const { account, env,decryptedPgpPvtKey } =
  useContext<any>(ChatPropsContext);

  const historyMessages = useCallback(async ({threadHash,limit = 10,}:HistoryMessagesParams) => {

    setLoading(true);
    try {
        const chatHistory:IMessageIPFS[] = await PushAPI.chat.history({
            threadhash: threadHash,
            account: account,
            toDecrypt: decryptedPgpPvtKey ? true : false,
            pgpPrivateKey: String(decryptedPgpPvtKey),
            limit: limit,
            env: env
          });
          chatHistory.reverse();
          if (chats.get(selectedChatId)) {
            const uniqueMap: { [timestamp: number]: IMessageIPFS } = {};
            const messages = Object.values(
              [...chatHistory, ...chats.get(selectedChatId)!.messages].reduce((uniqueMap, message) => {
                if (message.timestamp && !uniqueMap[message.timestamp]) {
                  uniqueMap[message.timestamp] = message;
                }
                return uniqueMap;
              }, uniqueMap)
            );
            setChat(selectedChatId, {
              messages: messages,
              lastThreadHash: chatHistory[0].link
            });
          } else {
            setChat(selectedChatId, { messages: chatHistory, lastThreadHash: chatHistory[0].link });
          }
    } catch (error: Error | any) {
      setLoading(false);
      setError(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [chats]);

  return { historyMessages, error, loading };
};

export default useFetchHistoryMessages
;
