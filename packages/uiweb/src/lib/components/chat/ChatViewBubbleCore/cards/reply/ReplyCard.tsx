// React + Web3 Essentials
import { useEffect, useState } from 'react';

// External Packages

// Internal Compoonents
import { useChatData } from '../../../../../hooks';
import { Image, Section } from '../../../../reusables';

import { CardRenderer } from '../../CardRenderer';

// Internal Configs

// Assets

// Interfaces & Types
import { IMessagePayload } from '../../../exportedTypes';

// Constants

// Exported Interfaces & Types

// Exported Functions
const getParsedMessage = (message: string) => {
  try {
    return JSON.parse(message);
  } catch (error) {
    console.error('UIWeb::components::ChatViewBubble::ImageCard::error while parsing image', error);
    return null;
  }
};

const getImageContent = (message: string) => getParsedMessage(message)?.content ?? '';

export const ReplyCard = ({
  reference,
  chatId,
  position,
}: {
  reference: string | null;
  chatId: string | undefined;
  position?: number;
}) => {
  console.debug('UIWeb::components::ChatViewBubble::ReplyCard::chat', reference);

  // get user
  const { user } = useChatData();

  // set and get reply payload
  const [replyPayloadManager, setReplyPayloadManager] = useState<{
    payload: IMessagePayload | null;
    loaded: boolean;
    err: string | null;
  }>({ payload: null, loaded: false, err: null });

  // resolve reply payload
  useEffect(() => {
    const resolveReplyPayload = async () => {
      if (!replyPayloadManager.loaded) {
        if (reference && chatId) {
          try {
            const payloads = await user?.chat.history(chatId, { reference: reference, limit: 1 });
            const payload = payloads ? payloads[0] : null;

            // check if payload is reply
            // if so, change the message type to content one
            if (payload?.messageType === 'Reply') {
              payload.messageType = payload?.messageObj?.content?.messageType;
              payload.messageObj = payload?.messageObj?.content?.messageObj;
            }

            // finally set the reply
            setReplyPayloadManager({ ...replyPayloadManager, payload: payload, loaded: true });
          } catch (err) {
            setReplyPayloadManager({
              ...replyPayloadManager,
              payload: null,
              loaded: true,
              err: 'Unable to load Preview',
            });
          }
        } else {
          setReplyPayloadManager({
            ...replyPayloadManager,
            payload: null,
            loaded: true,
            err: 'Reply reference not found',
          });
        }
      }
    };
    resolveReplyPayload();
  }, [replyPayloadManager, reference, user?.chat, chatId]);

  // render
  return (
    <Section
      maxWidth="512px"
      width="fit-content"
    >
      {!replyPayloadManager.loaded && <div>Loading...</div>}

      {replyPayloadManager.loaded && replyPayloadManager.payload && (
        <CardRenderer
          key="card"
          chat={replyPayloadManager.payload}
          position={position ?? 0}
        />
      )}
    </Section>
  );
};
