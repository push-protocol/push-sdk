// React + Web3 Essentials
import { useContext, useRef, useState, useEffect, RefObject } from 'react';

// External Packages
import { TYPES, CONSTANTS } from '@pushprotocol/restapi';

// Internal Compoonents
import { Image, Section, Button, Spinner } from '../../../reusables';
import { ThemeContext } from '../../theme/ThemeProvider';
import { useChatData } from '../../../../hooks';

// Internal Configs

// Assets
import { EmojiCircleIcon } from '../../../../icons/PushIcons';

// Interfaces & Types
import { IMessagePayload } from '../../exportedTypes';
import { pCAIP10ToWallet } from '../../../../helpers';

// Constants

// Exported Interfaces & Types

// Exported Functions

export const ReactionPicker = ({
  chat,
  chatId,
  userSelectingReaction,
  setUserSelectingReaction,
  actionId,
  singularActionId,
  setSingularActionId,
  chatSidebarRef,
}: {
  chat: IMessagePayload;
  chatId: string;
  userSelectingReaction: boolean;
  setUserSelectingReaction: (userSelectingReaction: boolean) => void;
  actionId?: string | null | undefined;
  singularActionId?: string | null | undefined;
  setSingularActionId?: (singularActionId: string | null | undefined) => void;
  chatSidebarRef: RefObject<HTMLDivElement>;
}) => {
  // get theme
  const theme = useContext(ThemeContext);

  // to adjust reaction selection position
  const reactionSelectionRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  // adjust position of reaction selection
  const adjustPosition = () => {
    // TODO: Resize should adjust reaction picker
    // const element = reactionSelectionRef.current;
    // if (element) {
    //   const rect = element.getBoundingClientRect();
    //   const elementWidth = rect.width;
    //   const overflowRight = rect.left + elementWidth + 50 - window.innerWidth;
    //   if (overflowRight > 0) {
    //     element.style.left = `${overflowRight - rect.left}px`; // Adjust left so the element is 30px inside the window
    //   }
    // }
  };

  useEffect(() => {
    adjustPosition();
    window.addEventListener('resize', adjustPosition);
    return () => window.removeEventListener('resize', adjustPosition);
  }, []);

  // get user
  const { user } = useChatData();

  // when sending reaction
  const [sendingReaction, setSendingReaction] = useState<string | null>(null);

  // prepare to send reaction
  const processSendReaction = (reaction: string) => {
    // reset user selecting reaction
    setUserSelectingReaction(!userSelectingReaction);

    // set sending reaction
    setSendingReaction(reaction);
  };

  useEffect(() => {
    // to send reaction
    const sendReaction = async (reaction: string) => {
      // try to send reaction
      user?.chat
        .send(chatId, {
          type: 'Reaction',
          content: reaction,
          reference: (chat as any).cid,
        })
        .then((response) => {
          console.debug(
            'UIWeb::components::ChatViewBubble::ReactionPicker::sendReaction success with response:',
            response
          );
        })
        .catch((error) => {
          console.error('UIWeb::components::ChatViewBubble::ReactionPicker::sendReaction error:', error);
        })
        .finally(() => {
          setSendingReaction('');
        });
    };

    if (sendingReaction) {
      sendReaction(sendingReaction);
    }
  }, [sendingReaction]);

  const chatPosition =
    pCAIP10ToWallet(chat.fromDID).toLowerCase() !== pCAIP10ToWallet(user?.account ?? '')?.toLowerCase() ? 0 : 1;


  return (
    <Section
      justifyContent={chatPosition ? 'flex-end' : 'flex-start'}
    >
      {/* To display emoji picker */}
      <Button
        borderRadius={theme.borderRadius?.reactionsPickerBorderRadius}
        background={userSelectingReaction ? theme.backgroundColor?.chatReceivedBubbleBackground : 'transparent'}
        hoverBackground={theme.backgroundColor?.chatReceivedBubbleBackground}
        padding={theme.padding?.reactionsPickerPadding}
        border={theme.border?.reactionsBorder}
        hoverBorder={theme.border?.reactionsHoverBorder}
        onClick={(e) => {
          e.stopPropagation();
          adjustPosition();
          setUserSelectingReaction(!userSelectingReaction);

          if (setSingularActionId) {
            setSingularActionId(actionId);
          }
        }}
      >
        <EmojiCircleIcon
          color={theme.iconColor?.emoji}
          size={20}
        />
      </Button>

      {/* To pick emoji from emoji picker render and if actionId matches singularActionId */}
      {userSelectingReaction && actionId === singularActionId && (
        <Section
          ref={reactionSelectionRef}
          position="absolute"
          top="100%"
          bottom="-70px"
          gap={theme.padding?.reactionsPickerPadding}
          fontSize="x-large"
          alignSelf="center"
          padding={theme.padding?.reactionsPickerPadding}
          border={theme.border?.reactionsHoverBorder}
          borderRadius={theme.borderRadius?.reactionsPickerBorderRadius}
          background={theme.backgroundColor?.chatReceivedBubbleBackground}
        >
          {/* To display processing if sending reaction is not null */}
          {sendingReaction && (
            <Section padding={theme.padding?.reactionsPickerPadding}>
              <Spinner
                color={theme.spinnerColor}
                size="20"
              />
            </Section>
          )}

          {/* To display reaction only when sending reaction is null */}
          {!sendingReaction && (
            <>
              <Button
                borderRadius={theme.borderRadius?.reactionsPickerBorderRadius}
                padding={theme.padding?.reactionsPickerPadding}
                onClick={() => processSendReaction('👍')}
              >
                <span
                  role="img"
                  aria-label="thumbs up"
                >
                  👍
                </span>
              </Button>

              <Button
                borderRadius={theme.borderRadius?.reactionsPickerBorderRadius}
                padding={theme.padding?.reactionsPickerPadding}
                onClick={() => processSendReaction('❤️')}
              >
                <span
                  role="img"
                  aria-label="heart"
                >
                  ❤️
                </span>
              </Button>

              <Button
                borderRadius={theme.borderRadius?.reactionsPickerBorderRadius}
                padding={theme.padding?.reactionsPickerPadding}
                onClick={() => processSendReaction('🔥')}
              >
                <span
                  role="img"
                  aria-label="fire"
                >
                  🔥
                </span>
              </Button>

              <Button
                borderRadius={theme.borderRadius?.reactionsPickerBorderRadius}
                padding={theme.padding?.reactionsPickerPadding}
                onClick={() => processSendReaction('😲')}
              >
                <span
                  role="img"
                  aria-label="surprised"
                >
                  😲
                </span>
              </Button>

              <Button
                borderRadius={theme.borderRadius?.reactionsPickerBorderRadius}
                padding={theme.padding?.reactionsPickerPadding}
                onClick={() => processSendReaction('😂')}
              >
                <span
                  role="img"
                  aria-label="laugh"
                >
                  😂
                </span>
              </Button>

              <Button
                borderRadius={theme.borderRadius?.reactionsPickerBorderRadius}
                padding={theme.padding?.reactionsPickerPadding}
                onClick={() => processSendReaction('😢')}
              >
                <span
                  role="img"
                  aria-label="sad"
                >
                  😢
                </span>
              </Button>
            </>
          )}
        </Section>
      )}
    </Section>
  );
};
