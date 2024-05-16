import { IFeeds } from '@pushprotocol/restapi';
import { Dispatch, useContext, useState } from 'react';
import { MdCheckCircle } from 'react-icons/md';
import styled from 'styled-components';
import { useChatData } from '../../../hooks';
import useApproveChatRequest from '../../../hooks/chat/useApproveChatRequest';
import useRejectChatRequest from '../../../hooks/chat/useRejectChatRequest';
import { Section, Span, Spinner } from '../../reusables';
import ParticleEffectButton from '../../reusables/ParticleEffectButton';
import { Group } from '../exportedTypes';
import { IChatTheme } from '../theme';
import { ThemeContext } from '../theme/ThemeProvider';
import { IChatInfoResponse } from '../types';
import { AcceptCircleIcon, CancelCircleIcon } from '../../../icons/PushIcons';

// Constants
const APPROVE_REQUEST_TEXT = {
  GROUP: `You were invited to this group. Please accept to continue messaging in this group.`,
  W2W: `This wallet wants to chat with you! Please accept to continue or reject to decline.`,
};

/**
 * @interface IThemeProps
 * this interface is used for defining the props for styled components
 */
interface IThemeProps {
  theme?: IChatTheme;
}
export interface IActionRequestBubbleProps {
  chatInfo?: IChatInfoResponse | null;
}

export const ActionRequestBubble = ({ chatInfo = null }: IActionRequestBubbleProps) => {
  const { user, toast } = useChatData();

  const theme = useContext(ThemeContext);
  const { approveChatRequest, loading: approveLoading } = useApproveChatRequest();
  const { rejectChatRequest, loading: rejectLoading } = useRejectChatRequest();

  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);

  const handleApproveChatRequest = async () => {
    try {
      if (!user || user.readmode()) {
        return;
      }

      if (chatInfo?.recipient) {
        const response = await approveChatRequest({
          chatId: chatInfo?.recipient, // since recipient is chatId for group but wallet for dms
        });
        setIsApproved(true);
      } else {
        toast.showMessageToast({
          toastTitle: 'Error',
          toastMessage: 'Invalid Chat',
          toastType: 'ERROR',
          getToastIcon: (size: number) => (
            <MdCheckCircle
              size={size}
              color="red"
            />
          ),
        });
      }
    } catch (err: Error | any) {
      console.error(`UIWeb::ActionRequestBubble::handleApproveChatRequest::error`, err);
    }
  };

  const handleRejectChatRequest = async () => {
    try {
      if (!user || user.readmode()) {
        return;
      }

      if (chatInfo?.recipient) {
        const response = await rejectChatRequest({
          chatId: chatInfo?.recipient, // since recipient is chatId for group but wallet for dms
        });
        setIsRejected(true);

        toast.showMessageToast({
          toastTitle: 'Invitation Declined',
          toastMessage: 'This conversation has been removed from your request list.',
          toastType: 'WARNING',
          getToastIcon: (size: number) => (
            <MdCheckCircle
              size={size}
              color="grey"
            />
          ),
        });
      } else {
        toast.showMessageToast({
          toastTitle: 'Error',
          toastMessage: 'Invalid Chat ID',
          toastType: 'ERROR',
          getToastIcon: (size: number) => (
            <MdCheckCircle
              size={size}
              color="red"
            />
          ),
        });
      }
    } catch (err: Error | any) {
      console.error(`UIWeb::ActionRequestBubble::handleRejectChatRequest::error`, err);
    }
  };

  // Render
  return (
    <Section justifyContent="start">
      <ParticleEffectButton
        color={theme.iconColor?.approveRequest}
        hidden={isApproved}
      >
        <ParticleEffectButton
          color={theme.iconColor?.rejectRequest}
          hidden={isRejected}
          type={'triangle'}
          direction={'right'}
        >
          <Section
            color={theme.textColor?.chatReceivedBubbleText}
            gap="10px"
            background={theme.backgroundColor?.chatReceivedBubbleBackground}
            padding="16px 24px"
            margin="7px 0"
            borderRadius=" 0px 12px 12px 12px"
            alignSelf="start"
            justifyContent="start"
            maxWidth="600px"
            minWidth="150px"
            position="relative"
            flexDirection="row"
          >
            <Span
              alignSelf="center"
              textAlign="left"
              fontSize={theme.fontSize?.chatReceivedBubbleText}
              fontWeight={theme.fontWeight?.chatReceivedBubbleText}
              color={theme.textColor?.chatReceivedBubbleText}
              lineHeight="24px"
              maxWidth="250px"
            >
              {chatInfo?.meta?.group ? APPROVE_REQUEST_TEXT.GROUP : APPROVE_REQUEST_TEXT.W2W}
            </Span>

            <Button
              theme={theme}
              onClick={() => (!approveLoading && !rejectLoading ? handleRejectChatRequest() : null)}
              className={
                isRejected || isApproved
                  ? 'disabled'
                  : rejectLoading
                  ? 'active secondary'
                  : approveLoading
                  ? 'disabled secondary'
                  : ''
              }
            >
              {rejectLoading ? (
                <Spinner
                  color="#fff"
                  size="24"
                />
              ) : (
                <CancelCircleIcon
                  size={40}
                  color={theme.iconColor?.rejectRequest}
                />
              )}
            </Button>

            <Button
              theme={theme}
              onClick={() => (!approveLoading && !rejectLoading ? handleApproveChatRequest() : null)}
              className={
                isRejected || isApproved
                  ? 'disabled'
                  : approveLoading
                  ? 'active primary'
                  : rejectLoading
                  ? 'disabled primary'
                  : ''
              }
            >
              {approveLoading ? (
                <Spinner
                  color="#fff"
                  size="24"
                />
              ) : (
                <AcceptCircleIcon
                  size={40}
                  color={theme.iconColor?.approveRequest}
                />
              )}
            </Button>
          </Section>
        </ParticleEffectButton>
      </ParticleEffectButton>
    </Section>
  );
};

//styles
const Button = styled.button<IThemeProps>`
  border: none;
  cursor: pointer;
  border-radius: 100%;
  background: transparent;
  padding: 0px;
  border: none;
  height: 40px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;

  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &.primary.active {
    background: ${(props) => props.theme.iconColor?.approveRequest};
  }

  &.secondary.active {
    background: ${(props) => props.theme.iconColor?.rejectRequest};
  }
`;
