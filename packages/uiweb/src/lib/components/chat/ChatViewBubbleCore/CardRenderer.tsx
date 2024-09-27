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

export const CardRenderer = ({
  chat,
  position,
  previewMode = false,
  activeMode = false,
}: {
  chat: IMessagePayload;
  position: number;
  previewMode?: boolean;
  activeMode?: boolean;
}) => {
  // get theme
  const theme = useContext(ThemeContext);

  // get user
  const { user } = useChatData();

  // extract message to perform checks
  const message =
    typeof chat.messageObj === 'object'
      ? (typeof chat.messageObj?.content === 'string' ? chat.messageObj?.content : '') ?? ''
      : (chat.messageObj as string);

  // test if the payload is encrypted, if so convert it to text
  if (isMessageEncrypted(message)) {
    chat.messageType = 'Text';
  }

  // get user account
  const account = user?.account ?? '';

  // deduce font color
  const fontColor =
    position && !activeMode ? theme.textColor?.chatSentBubbleText : theme.textColor?.chatReceivedBubbleText;

  // Render the card render
  return (
    <>
      {/* Message Card */}
      {/* Twitter Card is handled by PreviewRenderer */}
      {/* Frame Card is handled by PreviewRenderer */}
      {/* Code Card is handled by CodeRenderer */}
      {chat && chat.messageType === 'Text' && (
        <MessageCard
          chat={chat}
          position={position}
          account={account}
          color={fontColor}
          previewMode={previewMode}
          activeMode={activeMode}
        />
      )}

      {/* Image Card */}
      {chat.messageType === 'Image' && (
        // Background only valid when no preview or active mode
        <ImageCard
          chat={chat}
          background={
            position && !activeMode && !previewMode
              ? theme.backgroundColor?.chatSentBubbleBackground
              : theme.backgroundColor?.chatReceivedBubbleBackground
          }
          color={fontColor}
          previewMode={previewMode}
          activeMode={activeMode}
        />
      )}

      {/* File Card */}
      {chat.messageType === 'File' && (
        <FileCard
          chat={chat}
          background={
            position && !activeMode
              ? theme.backgroundColor?.chatPreviewSentBubbleBackground
              : theme.backgroundColor?.chatPreviewRecievedBubbleBackground
          }
          color={fontColor}
          previewMode={previewMode}
          activeMode={activeMode}
        />
      )}

      {/* Gif Card */}
      {chat.messageType === 'GIF' && (
        <GIFCard
          chat={chat}
          background={
            position && !activeMode && !previewMode
              ? theme.backgroundColor?.chatSentBubbleBackground
              : theme.backgroundColor?.chatReceivedBubbleBackground
          }
          color={fontColor}
          previewMode={previewMode}
          activeMode={activeMode}
        />
      )}

      {/* Default Message Card - Only support limited message types like Reaction */}
      {chat.messageType === 'Reaction' && (
        <MessageCard
          chat={chat}
          position={position}
          account={account}
          color={fontColor}
          previewMode={previewMode}
          activeMode={activeMode}
        />
      )}
    </>
  );
};
