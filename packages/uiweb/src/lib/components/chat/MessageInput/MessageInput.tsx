import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';

import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import GifPicker from 'gif-picker-react';
import { createPortal } from 'react-dom';
import { MdCheckCircle, MdError } from 'react-icons/md';
import styled from 'styled-components';

import { deriveChatId, getDomainIfExists, pCAIP10ToWallet, setAccessControl, walletToPCAIP10 } from '../../../helpers';
import { useChatData, useClickAway, useDeviceWidthCheck, usePushChatStream } from '../../../hooks';
import useFetchChat from '../../../hooks/chat/useFetchChat';
import useGetGroupByIDnew from '../../../hooks/chat/useGetGroupByIDnew';
import useGroupMemberUtilities from '../../../hooks/chat/useGroupMemberUtilities';
import usePushSendMessage from '../../../hooks/chat/usePushSendMessage';
import useVerifyAccessControl from '../../../hooks/chat/useVerifyAccessControl';
import { AttachmentIcon } from '../../../icons/Attachment';
import { GifIcon } from '../../../icons/Gif';
import OpenLink from '../../../icons/OpenLink';
import { EmojiCircleIcon } from '../../../icons/PushIcons';
import { SendCompIcon } from '../../../icons/SendCompIcon';
import { Button, Div, Section, Span, Spinner } from '../../reusables';
import { ConditionsInformation } from '../ChatProfile/ChatProfileInfoModal';
import { ConnectButton } from '../ConnectButton';
import { Modal, ModalHeader } from '../reusables/Modal';
import { ThemeContext } from '../theme/ThemeProvider';

import { PUBLIC_GOOGLE_TOKEN, device } from '../../../config';
import usePushUser from '../../../hooks/usePushUser';
import { CancelCircleIcon } from '../../../icons/PushIcons';
import { MODAL_BACKGROUND_TYPE, MODAL_POSITION_TYPE, type FileMessageContent } from '../../../types';
import { GIFType, Group, IChatTheme, MessageInputProps } from '../exportedTypes';
import { checkIfAccessVerifiedGroup } from '../helpers';
import { InfoContainer } from '../reusables';
import { IChatInfoResponse } from '../types';

import { ChatViewBubbleCore } from '../ChatViewBubbleCore';

/**
 * @interface IThemeProps
 * this interface is used for defining the props for styled components
 */
interface IThemeProps {
  theme?: IChatTheme;
}

const ConnectButtonSection = ({ autoConnect }: { autoConnect: boolean }) => {
  const { user, toast } = useChatData();
  return (
    <Section
      width="100%"
      justifyContent="space-between"
      alignItems="center"
      padding="8px"
    >
      {!(user && !user?.readmode() && user?.account) && (
        <Span
          padding="8px 8px 8px 16px"
          color="#B6BCD6"
          fontSize="15px"
          fontWeight="400"
          textAlign="start"
        >
          You need to connect your wallet to get started
        </Span>
      )}
      <ConnectButton autoConnect={autoConnect} />
    </Section>
  );
};

export const MessageInput: React.FC<MessageInputProps> = ({
  chatId,
  emoji = true,
  gif = true,
  file = true,
  replyPayload = null,
  setReplyPayload,
  isConnected = true,
  autoConnect = false,
  verificationFailModalBackground = MODAL_BACKGROUND_TYPE.OVERLAY,
  verificationFailModalPosition = MODAL_POSITION_TYPE.GLOBAL,
  onVerificationFail,
}) => {
  const [typedMessage, setTypedMessage] = useState<string>('');
  const [showEmojis, setShowEmojis] = useState<boolean>(false);
  const [gifOpen, setGifOpen] = useState<boolean>(false);
  const modalRef = useRef(null);
  const fileUploadInputRef = useRef<HTMLInputElement>(null);
  const [fileUploading, setFileUploading] = useState<boolean>(false);
  const [isRules, setIsRules] = useState<boolean>(false);
  const [isMember, setIsMember] = useState<boolean>(false);
  const [formattedChatId, setFormattedChatId] = useState<string>('');

  const { getGroupByIDnew } = useGetGroupByIDnew();
  const [groupInfo, setGroupInfo] = useState<Group | null>(null);

  const [chatInfo, setChatInfo] = useState<IChatInfoResponse | null>(null);
  const theme = useContext(ThemeContext);
  const isMobile = useDeviceWidthCheck(425);
  const { sendMessage, loading } = usePushSendMessage();
  const {
    verifyAccessControl,
    setVerificationSuccessfull,
    verificationSuccessfull,
    verified,
    setVerified,
    loading: accessLoading,
  } = useVerifyAccessControl();
  const { fetchMemberStatus, joinGroup, joinLoading, joinError } = useGroupMemberUtilities();
  const { fetchUserProfile } = usePushUser();

  const { user, toast } = useChatData();
  const { fetchChat } = useFetchChat();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // setup stream
  const {
    chatAcceptStream,
    participantRemoveStream,
    participantLeaveStream,
    participantJoinStream,
    groupUpdateStream,
  } = useChatData();

  const onChangeTypedMessage = (val: string) => {
    setTypedMessage(val);
  };
  useClickAway(modalRef, () => {
    setShowEmojis(false);
    setGifOpen(false);
  });

  useEffect(() => {
    if (textAreaRef?.current?.style) {
      textAreaRef.current.style.height = 25 + 'px';
      const scrollHeight = textAreaRef.current?.scrollHeight;
      textAreaRef.current.style.height = scrollHeight + 'px';
    }
  }, [textAreaRef, typedMessage]);

  useEffect(() => {
    if (!loading && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [loading, textAreaRef]);

  useEffect(() => {
    if (groupInfo) {
      const storedTimestampJSON = localStorage.getItem(chatId);

      if (storedTimestampJSON) {
        const storedTimestamp = JSON.parse(storedTimestampJSON);
        const currentTimestamp = new Date().getTime();
        const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;

        if (Math.abs(currentTimestamp - storedTimestamp) < twentyFourHoursInMilliseconds) {
          setVerified(true);
        } else {
          setVerified(false);
          setAccessControl(formattedChatId, true);
        }
      }
    }
  }, [chatId, verified, isMember, user]);

  useEffect(() => {
    (async () => {
      if (!user) return;
      if (chatId) {
        let derivedChatId = chatId;
        if (getDomainIfExists(derivedChatId)) {
          derivedChatId = (await deriveChatId(chatId, user))!;
        }

        // set formatted chat id
        setFormattedChatId(derivedChatId);

        try {
          const chat = await user.chat.info(derivedChatId);
          setChatInfo(chat);
        } catch (error) {
          console.error('UIWeb::MessageInput::useEffect[chatId, user]::error while fetching chat info', error);
        }
      }
    })();
  }, [chatId, user]);

  useEffect(() => {
    (async () => {
      let GroupProfile;
      if (chatInfo && chatInfo?.meta?.group) {
        GroupProfile = await getGroupByIDnew({ groupId: formattedChatId });
        if (GroupProfile) setGroupInfo(GroupProfile);
      }
    })();
  }, [chatInfo]);

  //moniter stream changes
  useEffect(() => {
    if (Object.keys(groupUpdateStream || {}).length > 0 && groupUpdateStream.constructor === Object)
      transformGroupDetails(groupUpdateStream);
  }, [groupUpdateStream]);

  useEffect(() => {
    if (!user) return;
    if (user && groupInfo) {
      (async () => {
        const status = await fetchMemberStatus({
          chatId: groupInfo.chatId!,
          accountId: user?.account,
        });
        if (status && typeof status !== 'string') {
          setIsMember(status?.participant);
        } else {
          //show toast
          showError('Error', 'Error in fetching member details');
        }
      })();
    }
  }, [
    user,
    groupInfo,
    chatInfo,
    chatAcceptStream,
    participantJoinStream,
    participantLeaveStream,
    participantRemoveStream,
  ]);

  useEffect(() => {
    if (!user) return;
    if (user && chatId && groupInfo) {
      setIsRules(checkIfAccessVerifiedGroup(groupInfo));
    }
  }, [chatId, groupInfo, user]);

  // to change chatInfo when user action changes if chat info matches
  useEffect(() => {
    if (chatInfo && chatInfo.chatId === chatAcceptStream.chatId && chatInfo?.list === 'REQUESTS') {
      setChatInfo((prevInfo) => {
        if (!prevInfo) return null; // Handle the case where prevInfo is null

        return {
          ...prevInfo,
          list: 'CHATS', // Example of updating the list
          chatId: prevInfo.chatId, // Directly use the existing chatId, ensuring it's not undefined
          meta: {
            group: prevInfo.meta?.group ?? false, // Provide default value if undefined
            encrypted: prevInfo.meta?.encrypted ?? false,
            visibility: prevInfo.meta?.visibility ?? true,
          },
        };
      });
    }
  }, [chatAcceptStream]);

  const transformGroupDetails = (item: any): void => {
    if (groupInfo?.chatId === item?.chatId) {
      const updatedGroupInfo = groupInfo;
      if (updatedGroupInfo) {
        updatedGroupInfo.groupName = item?.meta?.name;
        updatedGroupInfo.groupDescription = item?.meta?.description;
        updatedGroupInfo.groupImage = item?.meta?.image;
        updatedGroupInfo.groupCreator = item?.meta?.owner;
        updatedGroupInfo.isPublic = !item?.meta?.private;
        updatedGroupInfo.rules = item?.meta?.rules;
        setGroupInfo(updatedGroupInfo);
      }
    }
  };

  const addEmoji = (emojiData: EmojiClickData, event: MouseEvent): void => {
    setTypedMessage(typedMessage + emojiData.emoji);
    setShowEmojis(false);
  };

  const handleUploadFile = () => {
    if (fileUploadInputRef.current) {
      fileUploadInputRef.current.click();
    }
  };

  const checkVerification = () => {
    if (user?.account) {
      verifyAccessControl({ chatId, did: user.account });
    } else {
      console.error("UIWeb::MessageInput::checkVerification::User's account is not available");
    }
  };

  const handleJoinGroup = async () => {
    if (chatInfo && groupInfo) {
      const response = await joinGroup({
        chatId: formattedChatId,
      });
      if (typeof response !== 'string') {
        showSuccess('Success', 'Successfully joined group');
      } else {
        if (joinError) {
          showError('Error', 'Unable to join group');
        }
      }
    } else {
      const sendTextMessage = await sendMessage({
        message: `Hello, please let me join this group, my wallet address is ${pCAIP10ToWallet(user?.account || '')}`,
        chatId: groupInfo?.groupCreator || '',
        messageType: 'Text',
      });
      if (sendTextMessage) {
        showSuccess('Success', 'Request sent successfully');
      } else {
        showError('Error', 'Unable to send request');
      }
    }
  };

  const showError = (title: string, subTitle: string) => {
    toast.showMessageToast({
      toastTitle: title,
      toastMessage: subTitle,
      toastType: 'ERROR',
      getToastIcon: (size: number) => (
        <MdError
          size={size}
          color="red"
        />
      ),
    });
  };

  const showSuccess = (title: string, subTitle: string) => {
    toast.showMessageToast({
      toastTitle: title,
      toastMessage: subTitle,
      toastType: 'SUCCESS',
      getToastIcon: (size: number) => (
        <MdCheckCircle
          size={size}
          color="green"
        />
      ),
    });
  };

  const uploadFile = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (!(e.target instanceof HTMLInputElement)) {
      return;
    }
    if (!e.target.files) {
      return;
    }
    if (e.target && (e.target as HTMLInputElement).files && ((e.target as HTMLInputElement).files as FileList).length) {
      const file: File = e.target.files[0];
      if (file) {
        try {
          const TWO_MB = 1024 * 1024 * 2;
          if (file.size > TWO_MB) {
            console.log('Files larger than 2mb is not allowed');
            throw new Error('Files larger than 2mb is not allowed');
          }
          setFileUploading(true);
          const messageType = file.type.startsWith('image') ? 'Image' : 'File';
          const reader = new FileReader();
          let fileMessageContent: FileMessageContent;
          reader.readAsDataURL(file);
          reader.onloadend = async (e): Promise<void> => {
            fileMessageContent = {
              content: e.target!.result as string,
              name: file.name,
              type: file.type,
              size: file.size,
            };

            sendPushMessage(JSON.stringify(fileMessageContent), messageType);
          };
        } catch (err) {
          console.log(err);
        } finally {
          setFileUploading(false);
        }
      }
    }
  };

  const isJoinGroup = () => {
    return user && !user?.readmode() && !isMember;
  };

  const isNotVerified = () => {
    return user && !user?.readmode() && !verified && isMember && isRules;
  };

  const sendPushMessage = async (content: string, type: string) => {
    try {
      const sendMessageResponse = await sendMessage({
        chatId: formattedChatId,
        message: content,
        messageType: type as any,
        replyRef: replyPayload?.cid || undefined,
      });
      if (sendMessageResponse && typeof sendMessageResponse === 'string' && sendMessageResponse.includes('403')) {
        setAccessControl(chatId, true);
        setVerified(false);
        setVerificationSuccessfull(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      // reset reply payload
      setReplyPayload?.(null);
    }
  };

  const sendTextMsg = async () => {
    if (typedMessage.trim() !== '') {
      await sendPushMessage(typedMessage as string, 'Text');
      setTypedMessage('');
    }
  };

  const sendGIF = async (emojiObject: GIFType) => {
    sendPushMessage(emojiObject.url as string, 'GIF');
    setGifOpen(false);
  };

  // To focus when replyPayload is truthly
  useEffect(() => {
    if (replyPayload) {
      textAreaRef.current?.focus();
    }
  }, [replyPayload]);

  return !(user && !user?.readmode()) && isConnected ? (
    <TypebarSection
      width="100%"
      overflow="hidden"
      borderRadius="13px"
      position="static"
      padding={` ${user && !user?.readmode() ? '14px 16px' : ''}`}
      background={`${theme.backgroundColor?.messageInputBackground}`}
      alignItems="center"
      justifyContent="space-between"
    >
      <ConnectButtonSection autoConnect={autoConnect} />
    </TypebarSection>
  ) : Object.keys(chatInfo || {}).length ? (
    <MessageInputContainer
      width="100%"
      justifyContent="space-between"
      alignItems="center"
      className={chatInfo?.list === 'REQUESTS' ? 'hide' : ''}
    >
      <TypebarSection
        width="100%"
        borderRadius={theme.borderRadius?.messageInput}
        position="static"
        border={theme.border?.messageInput}
        padding={` ${user && !user?.readmode() ? '14px 16px' : ''}`}
        background={`${theme.backgroundColor?.messageInputBackground}`}
        alignItems="center"
        justifyContent="space-between"
      >
        {Object.keys(chatInfo || {}).length && groupInfo ? (
          <>
            {(isJoinGroup() || isNotVerified()) && (
              <Section
                width="100%"
                justifyContent="space-between"
                alignItems="center"
              >
                <Span
                  padding="8px 8px 8px 0px"
                  color={theme.textColor?.chatReceivedBubbleText}
                  fontSize="15px"
                  fontWeight="500"
                  textAlign="start"
                >
                  {isJoinGroup() && 'Click on the button to join the group'}
                  {isNotVerified() && (
                    <>
                      Sending messages requires to staisfy the group rules.{' '}
                      <Link
                        href="https://push.org/docs/chat/build/conditional-rules-for-group/"
                        target="_blank"
                        color={theme.backgroundColor?.chatSentBubbleBackground}
                      >
                        Learn More <OpenLink />
                      </Link>
                    </>
                  )}
                </Span>
                <ConnectWrapper>
                  <Connect onClick={async () => (isJoinGroup() ? await handleJoinGroup() : await checkVerification())}>
                    {isJoinGroup() && (
                      <>
                        {joinLoading ? (
                          <Spinner
                            color="#fff"
                            size="24"
                          />
                        ) : (
                          ' Join Group '
                        )}
                      </>
                    )}
                    {isNotVerified() && (
                      <>
                        {accessLoading ? (
                          <Spinner
                            color="#fff"
                            size="24"
                          />
                        ) : (
                          'Verify Access'
                        )}
                      </>
                    )}
                  </Connect>
                </ConnectWrapper>
              </Section>
            )}
            {!!user &&
              !user?.readmode() &&
              !verificationSuccessfull &&
              createPortal(
                <Modal
                  width="550px"
                  modalBackground={verificationFailModalBackground}
                  modalPositionType={verificationFailModalPosition}
                >
                  <Section
                    margin="5px 0px 0px 0px"
                    gap="16px"
                    flexDirection="column"
                    width="100%"
                  >
                    <ModalHeader title="Access Failed" />
                    <ConditionsInformation
                      theme={theme}
                      groupInfo={groupInfo}
                      subheader="Please make sure the following conditions
                    are met to pariticpate and send messages."
                      alert={true}
                    />
                    <ConnectWrapperClose
                      onClick={() => {
                        if (onVerificationFail) {
                          onVerificationFail();
                        }
                        setVerificationSuccessfull(true);
                      }}
                    >
                      <ConnectClose>Cancel</ConnectClose>
                    </ConnectWrapperClose>
                    <InfoContainer
                      cta="https://push.org/docs/chat/build/conditional-rules-for-group/"
                      label="Learn more about access gating rules"
                    />
                  </Section>
                  {/* </Section> */}
                </Modal>,

                document.body
              )}
          </>
        ) : null}

        {/* Message bar logic */}
        {user && !user?.readmode() && (((isRules ? verified : true) && isMember) || (chatInfo && !groupInfo)) && (
          <Section
            flexDirection="column"
            flex="1"
            gap="12px"
          >
            {/* Render reply message */}
            {replyPayload && (
              <Section
                flexDirection="column"
                alignItems="flex-start"
                overflow="hidden"
                gap="8px"
              >
                <Section
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  overflow="hidden"
                  gap="8px"
                >
                  <Span
                    padding="0px"
                    fontSize="10px"
                    color={theme.iconColor?.emoji}
                  >
                    {`Reply to `}
                    <Span
                      fontWeight="500"
                      padding="0px"
                    >
                      {`${replyPayload.fromDID?.split(':')[1].slice(0, 6)}...${replyPayload.fromDID
                        ?.split(':')[1]
                        .slice(-6)}`}
                    </Span>
                  </Span>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (setReplyPayload) {
                        setReplyPayload(null);
                      }
                    }}
                  >
                    <CancelCircleIcon
                      size={14}
                      color={theme.textColor?.messageInputText}
                    />
                  </Button>
                </Section>
                <ChatViewBubbleCore
                  chat={replyPayload}
                  chatId={chatId}
                  previewMode={true}
                  activeMode={true}
                />
              </Section>
            )}

            {/* Render message bar */}
            <SendSection flex="1">
              {emoji && (
                <Div
                  width="25px"
                  cursor="pointer"
                  height="25px"
                  alignSelf="end"
                  onClick={() => setShowEmojis(!showEmojis)}
                >
                  <EmojiCircleIcon
                    color={theme.iconColor?.emoji}
                    size={22}
                  />
                </Div>
              )}
              {showEmojis && (
                <Section
                  ref={modalRef}
                  position="absolute"
                  bottom="50px"
                  left="-12px"
                  zIndex="700"
                >
                  <EmojiPicker
                    width={isMobile ? 260 : 320}
                    height={370}
                    onEmojiClick={addEmoji}
                  />
                </Section>
              )}

              <MultiLineInput
                ref={textAreaRef}
                disabled={loading ? true : false}
                theme={theme}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    sendTextMsg();
                  }
                }}
                placeholder="Type your message..."
                onChange={(e) => onChangeTypedMessage(e.target.value)}
                value={typedMessage}
                rows={1}
              />
              {gif && (
                <Section
                  width="30px"
                  height="24px"
                  cursor="pointer"
                  alignSelf="end"
                  onClick={() => setGifOpen(!gifOpen)}
                >
                  <GifIcon />
                </Section>
              )}
              {gifOpen && (
                <Section
                  position="absolute"
                  bottom="50px"
                  right="-18px"
                  zIndex="1"
                  ref={modalRef}
                >
                  <GifPicker
                    onGifClick={sendGIF}
                    width={isMobile ? 260 : 320}
                    height={370}
                    tenorApiKey={String(PUBLIC_GOOGLE_TOKEN)}
                  />
                </Section>
              )}
              <Section onClick={handleUploadFile}>
                {!fileUploading && file && (
                  <>
                    <Section
                      width="18px"
                      height="24px"
                      cursor="pointer"
                      alignSelf="end"
                    >
                      <AttachmentIcon color={theme.iconColor?.attachment} />
                    </Section>
                    <FileInput
                      type="file"
                      ref={fileUploadInputRef}
                      onChange={(e) => uploadFile(e)}
                    />
                  </>
                )}
              </Section>
              {!(loading || fileUploading) && (
                <Section
                  cursor="pointer"
                  alignSelf="end"
                  height="20px"
                  width="22px"
                  onClick={() => sendTextMsg()}
                >
                  <SendCompIcon color={theme.iconColor?.sendButton} />
                </Section>
              )}

              {(loading || fileUploading) && (
                <Section
                  alignSelf="end"
                  height="24px"
                >
                  <Spinner
                    color={theme.spinnerColor}
                    size="22"
                  />
                </Section>
              )}
            </SendSection>
          </Section>
        )}
      </TypebarSection>
    </MessageInputContainer>
  ) : (
    <></>
  );
};

const TypebarSection = styled(Section) <{ border?: string }>`
  // gap: 10px;
  border: ${(props) => props.border || 'none'};
  @media ${device.mobileL} {
    gap: 0px;
  }
`;

const MessageInputContainer = styled(Section)`
  transition: transform 0.3s ease-in-out;
  transform: translateY(0);

  &.hide {
    transform: translateY(calc(100% + 20px));
  }
`;

const SendSection = styled(Section)`
  gap: 12px;
  @media ${device.mobileL} {
    gap: 8px;
  }
`;
const MultiLineInput = styled.textarea<IThemeProps>`
  font-family: inherit;
  font-weight: 400;
  transform: translateY(3px);
  font-size: 15px;
  outline: none;
  overflow-y: auto;
  box-sizing: border-box;
  background: ${(props) => props.theme.backgroundColor?.messageInputBackground};
  border: none;
  color: ${(props) => props.theme.textColor?.messageInputText};
  resize: none;
  flex: 1;
  padding-right: 5px;
  align-self: end;
  @media ${device.mobileL} {
    font-size: 16px;
    width: 100%;
  }
  &&::-webkit-scrollbar {
    width: 4px;
    padding-right: 0px;
  }
  ::-webkit-scrollbar-thumb {
    background: rgb(181 181 186);
    border-radius: 10px;
    height: 50px;
  }
  ::placeholder {
    color: ${(props) => props.theme.textColor?.messageInputText};
    transform: translateY(0px);
    @media ${device.mobileL} {
      font-size: 14px;
    }
  }

  min-height: 25px;
  max-height: 80px;
  word-break: break-word;
`;
const FileInput = styled.input`
  display: none;
`;

const ConnectWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
`;

const StyledButton = styled.button`
  border: 0px;
  outline: 0px;
  padding: 24px 9px;
  font-weight: 500;
  border-radius: 12px;
  font-size: 17px;
  cursor: pointer;
  width: 147px;
  height: 44px;
  text-align: start;
  align-items: center;
  display: flex;
  justify-content: center;
`;

const Connect = styled(StyledButton)`
  color: rgb(255, 255, 255);
  background: #d53a94;
`;

const ConnectWrapperClose = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const StyledButtonClose = styled.button`
  border: 0px;
  outline: 0px;
  padding: 24px 9px;
  font-weight: 500;
  border-radius: 12px;
  font-size: 17px;
  cursor: pointer;
  width: 147px;
  height: 44px;
  text-align: start;
  align-items: center;
  display: flex;
  justify-content: center;
`;

const ConnectClose = styled(StyledButtonClose)`
  color: rgb(255, 255, 255);
  background: #d53a94;
  gap: 8px;
`;

const TokenWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const TokenStyledButton = styled.button`
  border: 0px;
  outline: 0px;
  padding: 22px 9px;
  font-weight: 500;
  border-radius: 12px;
  font-size: 17px;
  cursor: pointer;
  width: 100%;
  height: 44px;
  text-align: start;
  align-items: center;
  display: flex;
  justify-content: center;
`;

const TokenGet = styled(TokenStyledButton)`
  color: #d53a94;
  border: 2px solid #d53a94;
  background: none;
  gap: 8px;
`;
const Link = styled.a`
  color: #d53a94;
  link-decoration: none;
  text-decoration: none;
`;
