import { ReactNode, useContext, useEffect, useRef, useState } from 'react';

import { useChatData } from '../../../hooks';
import { checkTwitterUrl } from '../helpers/twitter';
import { ThemeContext } from '../theme/ThemeProvider';

import { isMessageEncrypted, pCAIP10ToWallet } from '../../../helpers';
import { IMessagePayload, TwitterFeedReturnType } from '../exportedTypes';

import { CardRenderer } from './CardRenderer';
import { ReplyCard } from './cards/reply/ReplyCard';

function deepCopy<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (obj instanceof Array) {
    return obj.reduce((arr, item, i) => {
      arr[i] = deepCopy(item);
      return arr;
    }, [] as any[]) as any;
  }

  if (obj instanceof Object) {
    return Object.keys(obj).reduce((newObj, key) => {
      newObj[key as keyof T] = deepCopy((obj as any)[key]);
      return newObj;
    }, {} as T);
  }

  throw new Error(`Unable to copy obj! Its type isn't supported.`);
}

export const ChatViewBubbleCore = ({ chat, chatId }: { chat: IMessagePayload; chatId: string | undefined }) => {
  // get theme
  const theme = useContext(ThemeContext);

  // get user
  const { user } = useChatData();

  // get chat position
  const chatPosition =
    pCAIP10ToWallet(chat.fromDID).toLowerCase() !== pCAIP10ToWallet(user?.account ?? '')?.toLowerCase() ? 0 : 1;

  // // manale reply payload loader
  // type ReplyPayloadManagerType = {
  //   payload: IMessagePayload | null;
  //   loading: boolean;
  //   loaded: boolean;
  //   err: string | null;
  // };

  // const [replyPayloadManager, setReplyPayloadManager] = useState<ReplyPayloadManagerType>({
  //   payload: null,
  //   loading: true,
  //   loaded: false,
  //   err: null,
  // });

  // const resolveReplyPayload = async (chat: IMessagePayload, reference: string | null) => {
  //   if (reference && chatId) {
  //     try {
  //       const payloads = await user?.chat.history(chatId, { reference: reference, limit: 1 });
  //       const payload = payloads ? payloads[0] : null;
  //       console.log('resolving reply payload', payload);
  //       setReplyPayloadManager({ payload: payload, loading: false, loaded: true, err: null });
  //     } catch (err) {
  //       setReplyPayloadManager({ payload: null, loading: false, loaded: true, err: 'Unable to load Preview' });
  //     }
  //   } else {
  //     setReplyPayloadManager({ payload: null, loading: false, loaded: true, err: 'Reference not found' });
  //   }
  // };

  const renderBubble = (chat: IMessagePayload, position: number) => {
    const components: JSX.Element[] = [];

    // replace derivedMsg with chat as that's the original
    // take reference from derivedMsg which forms the reply
    // Create a deep copy of chat
    const derivedMsg = deepCopy(chat) as any;
    let replyReference = '';

    if (chat && chat.messageType === 'Reply') {
      // Reply messageObj content contains messageObj and messageType;
      replyReference = (chat as any).messageObj?.reference ?? null;
      derivedMsg.messageType = derivedMsg.messageObj.content.messageType;
      derivedMsg.messageObj = derivedMsg.messageObj.content.messageObj;
    }

    // Render cards - Anything not a reply is ChatViewBubbleCardRenderer
    // Reply is it's own card that calls ChatViewBubbleCardRenderer
    // This avoids transitive recursion

    // Use replyReference to check and call reply card
    if (replyReference !== '') {
      // Add Reply Card
      components.push(
        <ReplyCard
          key="reply"
          reference={replyReference}
          chatId={chatId}
          position={position}
        />
      );
    }

    // Use derivedMsg to render other cards
    if (derivedMsg) {
      // Add Message Card
      components.push(
        <CardRenderer
          key="card"
          chat={derivedMsg}
          position={position}
        />
      );
    }

    return <>{components}</>;
  };

  return renderBubble(chat, chatPosition);
};
