import { ReactNode, useContext, useEffect, useRef, useState } from 'react';

import { useChatData } from '../../../hooks';
import { checkTwitterUrl } from '../helpers/twitter';
import { ThemeContext } from '../theme/ThemeProvider';

import { isMessageEncrypted, pCAIP10ToWallet } from '../../../helpers';
import { IMessagePayload, TwitterFeedReturnType } from '../exportedTypes';

import { FileCard } from './cards/file/FileCard';
import { GIFCard } from './cards/gif/GIFCard';
import { ImageCard } from './cards/image/ImageCard';
import { MessageCard } from './cards/message/MessageCard';
import { TwitterCard } from './cards/twitter/TwitterCard';

export const CardRenderer = ({ chat, position }: { chat: IMessagePayload; position: number }) => {
  // get theme
  const theme = useContext(ThemeContext);

  // get user
  const { user } = useChatData();

  // extract message to perform checks
  const message =
    typeof chat.messageObj === 'object'
      ? (typeof chat.messageObj?.content === 'string' ? chat.messageObj?.content : '') ?? ''
      : (chat.messageObj as string);

  // check and render tweets
  const { tweetId, messageType }: TwitterFeedReturnType = checkTwitterUrl({
    message: message,
  });

  if (messageType === 'TwitterFeedLink') {
    chat.messageType = 'TwitterFeedLink';
  }

  // test if the payload is encrypted, if so convert it to text
  if (isMessageEncrypted(message)) {
    chat.messageType = 'Text';
  }

  // get user account
  const account = user?.account ?? '';

  // Render the card render
  return (
    <>
      {/* Message Card */}
      {chat && chat.messageType === 'Text' && (
        <MessageCard
          chat={chat}
          position={position}
          account={account}
        />
      )}

      {/* Image Card */}
      {chat.messageType === 'Image' && <ImageCard chat={chat} />}

      {/* File Card */}
      {chat.messageType === 'File' && <FileCard chat={chat} />}

      {/* Gif Card */}
      {chat.messageType === 'GIF' && <GIFCard chat={chat} />}

      {/* Twitter Card */}
      {chat.messageType === 'TwitterFeedLink' && (
        <TwitterCard
          tweetId={tweetId}
          chat={chat}
        />
      )}

      {/* Default Message Card - Only support limited message types like Reaction */}
      {chat.messageType === 'Reaction' && (
        <MessageCard
          chat={chat}
          position={position}
          account={account}
        />
      )}
    </>
  );
};
