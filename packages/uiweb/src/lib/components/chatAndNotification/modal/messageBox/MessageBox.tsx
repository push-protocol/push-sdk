import {
  ChatMainStateContext,
  ChatAndNotificationPropsContext,
  ChatAndNotificationMainContext,
} from '../../../../context';
import React, { useEffect, useRef, useContext } from 'react';
import { Image, Section, Span } from '../../../reusables/sharedStyling';
import styled from 'styled-components';
import useFetchHistoryMessages from '../../../../hooks/chat/useFetchHistoryMessages';
import type { IMessageIPFS } from '@pushprotocol/restapi';
import { Spinner } from '../../../reusables/Spinner';
import moment from 'moment';
import {
  dateToFromNowDaily,
  formatFileSize,
  shortenText,
} from '../../../../helpers';
import { pCAIP10ToWallet } from '../../../../helpers';
import { CheckCircleIcon } from '../../../../icons/CheckCircle';
import useApproveChatRequest from '../../../../hooks/chat/useApproveChatRequest';
import type { FileMessageContent } from '../../../../types';

import { Typebar } from './typebar/Typebar';
import { FILE_ICON } from '../../../../config';
import { EncryptionIcon } from '../../../../icons/Encryption';
import { NoEncryptionIcon } from '../../../../icons/NoEncryption';
import { ChatMainStateContextType } from '../../../../context/chatAndNotification/chat/chatMainStateContext';

const CHATS_FETCH_LIMIT = 15;

const FileCard = ({
  chat,
  position,
}: {
  chat: IMessageIPFS;
  position: number;
}) => {
  const fileContent: FileMessageContent = JSON.parse(chat.messageContent);
  const name = fileContent.name;

  const content = fileContent.content as string;
  const size = fileContent.size;

  return (
    <Section
      alignSelf={position ? 'end' : 'start'}
      maxWidth="80%"
      margin="5px 0"
      background="#343536"
      borderRadius="8px"
      justifyContent="space-around"
      padding="10px 13px"
      gap="15px"
    >
      <Image
        src={FILE_ICON(name.split('.').slice(-1)[0])}
        alt="extension icon"
        width="20px"
        height="20px"
      />
      <Section flexDirection="column" gap="5px">
        <Span color="#fff" fontSize="15px">
          {shortenText(name, 11)}
        </Span>
        <Span color="#fff" fontSize="12px">
          {formatFileSize(size)}
        </Span>
      </Section>
      <FileDownloadIconAnchor
        href={content}
        target="_blank"
        rel="noopener noreferrer"
        download
      >
        <FileDownloadIcon className="fa fa-download" aria-hidden="true" />
      </FileDownloadIconAnchor>
    </Section>
  );
};

const ImageCard = ({
  chat,
  position,
}: {
  chat: IMessageIPFS;
  position: number;
}) => {
  return (
    <Section
      alignSelf={position ? 'end' : 'start'}
      maxWidth="65%"
      margin="5px 0"
    >
      <Image
        src={JSON.parse(chat.messageContent).content}
        alt=""
        width="100%"
        borderRadius={position ? '12px 12px 0px 12px' : '12px 12px 12px 0px'}
      />
    </Section>
  );
};

const GIFCard = ({
  chat,
  position,
}: {
  chat: IMessageIPFS;
  position: number;
}) => {
  return (
    <Section
      alignSelf={position ? 'end' : 'start'}
      maxWidth="65%"
      margin="5px 0"
    >
      <Image
        src={chat.messageContent}
        alt=""
        width="100%"
        borderRadius={position ? '12px 12px 0px 12px' : '12px 12px 12px 0px'}
      />
    </Section>
  );
};
const MessageCard = ({
  chat,
  position,
}: {
  chat: IMessageIPFS;
  position: number;
}) => {
  const time = moment(chat.timestamp).format('hh:mm a');
  return (
    <Section
      gap="5px"
      background={position ? '#0D67FE' : '#EDEDEE'}
      padding="8px 12px"
      borderRadius={position ? '2px 12px 0px 12px' : '12px 12px 12px 0px'}
      margin="5px 0"
      alignSelf={position ? 'end' : 'start'}
      justifyContent="start"
      maxWidth="80%"
      minWidth="71px"
      position="relative"
    >
      {' '}
      <Section flexDirection="column" padding="5px 0 15px 0">
        {chat.messageContent.split('\n').map((str) => (
          <Span
            key={Math.random().toString()}
            alignSelf="start"
            textAlign="left"
            fontSize="16px"
            fontWeight="400"
            color={position ? '#fff' : '#000'}
          >
            {str}
          </Span>
        ))}
      </Section>
      <Span
        position="absolute"
        fontSize="12px"
        fontWeight="400"
        color={position ? '#A9C8FF' : '#62626A'}
        bottom="6px"
        right="10px"
      >
        {time}
      </Span>
    </Section>
  );
};

const Messages = ({ chat }: { chat: IMessageIPFS }) => {
  const { account } = useContext<any>(ChatAndNotificationPropsContext);
  const position =
    pCAIP10ToWallet(chat.fromDID).toLowerCase() !== account.toLowerCase()
      ? 0
      : 1;
  if (chat.messageType === 'GIF') {
    return <GIFCard chat={chat} position={position} />;
  }
  if (chat.messageType === 'Image') {
    return <ImageCard chat={chat} position={position} />;
  }
  if (chat.messageType === 'File') {
    return <FileCard chat={chat} position={position} />;
  }
  return <MessageCard chat={chat} position={position} />;
};

export const MessageBox = () => {
  const { activeTab, setActiveTab } = useContext<any>(
    ChatAndNotificationMainContext
  );
  const {
    selectedChatId,
    chatsFeed,
    requestsFeed,
    chats,
    setRequestsFeed,
    setChatFeed,
    setSearchedChats,
    searchedChats,
    setSelectedChatId,
  } = useContext<ChatMainStateContextType>(ChatMainStateContext);
  const { account, env, decryptedPgpPvtKey } = useContext<any>(
    ChatAndNotificationPropsContext
  );

  const selectedChat =
    chatsFeed[selectedChatId as string] ||
    requestsFeed[selectedChatId as string] ||
    (searchedChats ? searchedChats[selectedChatId as string] : null);
  const requestFeedids = Object.keys(requestsFeed);
  const selectedMessages = chats.get(selectedChatId as string);
  const dates = new Set();
  const listInnerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { historyMessages, loading } = useFetchHistoryMessages();
  const { approveChatRequest, loading: approveLoader } =
    useApproveChatRequest();

  type RenderDataType = {
    chat: IMessageIPFS;
    dateNum: string;
  };

  const renderDate = ({ chat, dateNum }: RenderDataType) => {
    const timestampDate = dateToFromNowDaily(chat.timestamp as number);
    dates.add(dateNum);
    return (
      <Span
        margin="15px 0"
        fontSize="14px"
        fontWeight="600"
        color="#AFAFB6"
        textAlign="center"
      >
        {timestampDate}
      </Span>
    );
  };

  const scrollToBottom = (behavior?: string | null) => {
    bottomRef?.current?.scrollIntoView(
      !behavior ? true : { behavior: 'smooth' }
    );
  };

  const onScroll = async () => {
    if (listInnerRef.current) {
      const { scrollTop } = listInnerRef.current;
      if (scrollTop === 0) {
        const content = listInnerRef.current;
        const curScrollPos = content.scrollTop;
        const oldScroll = content.scrollHeight - content.clientHeight;

        await getChatCall();

        const newScroll = content.scrollHeight - content.clientHeight;
        content.scrollTop = curScrollPos + (newScroll - oldScroll);
      }
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [selectedChatId]);

  useEffect(() => {
    if (
      selectedChatId &&
      selectedMessages &&
      selectedMessages?.messages.length
      // selectedMessages?.messages.length <= CHATS_FETCH_LIMIT
    ) {
      scrollToBottom(null);
    }
  }, [chats.get(selectedChatId as string)]);

  //optimise it
  const getChatCall = async () => {
    let threadHash = null;
    if (!selectedMessages && selectedChat?.threadhash) {
      threadHash = selectedChat?.threadhash;
    } else if (chats.size && selectedMessages?.lastThreadHash) {
      threadHash = selectedMessages?.lastThreadHash;
    }
    if (threadHash) {
      await historyMessages({
        limit: CHATS_FETCH_LIMIT,
        threadHash,
      });
    }
  };

  useEffect(() => {
    // // only for user who has requests but hasn't created user in push chat yet
    // if (selectedMessages?.messages.length) {
    //   return;
    // }

    (async function () {
      await getChatCall();
    })();
  }, [selectedChatId]);

  const handleApproveChatRequest = async () => {
    if (selectedChatId) {
      try {
        if (!decryptedPgpPvtKey) {
          return;
        }
        const response = await approveChatRequest({
          senderAddress: selectedChatId,
        });
        if (response) {
          const updatedRequestsfeed = { ...requestsFeed };
          const selectedRequest = updatedRequestsfeed[selectedChatId];
          delete updatedRequestsfeed[selectedChatId];
          setChatFeed(selectedChatId, selectedRequest);
          setSearchedChats(null);
          setRequestsFeed(updatedRequestsfeed);
        }
      } catch (error_: Error | any) {
        console.log(error_.message);
      }
    } else {
      return;
    }
  };

  return (
    <Section
      flexDirection="column"
      justifyContent="start"
      alignItems="start"
      width="100%"
      overflow="hidden"
      height="100%"
    >
      {loading ? <Spinner /> : ''}
      <Section
        width="100%"
        height="85%"
        overflow="hidden"
        justifyContent="start"
        flexDirection="column"
        alignItems="start"
        borderWidth="0 0 1px 0"
        // borderStyle={ "none none solid none"}
        borderColor="transparent transparent #dddddf transparent"
      >
        {!loading && (
          <>
            {selectedChat && !selectedChat.publicKey ? (
              <Section
                padding="12px"
                gap="8px"
                borderRadius="12px"
                borderStyle="solid"
                borderWidth="1px"
                borderColor="var(--neutral-neutral-100, #EDEDEE)"
                background='var(--neutral-neutral-050, #F5F5F5)'
                margin="10px"
              >
                <NoEncryptionIcon />
                <Span
                  
                  fontSize="13px"
                  color="var(--neutral-neutral-600, #62626A)"
                  fontWeight='600'
                  textAlign='left'
                >
                  Messages are not encrypted until chat request is accepted.
                </Span>
              </Section>
            ) : (
              <Section  padding="12px"
              gap="8px"
              borderRadius="12px"
              borderStyle="solid"
              borderWidth="1px"
              borderColor="var(--neutral-neutral-100, #EDEDEE)"
              background='var(--neutral-neutral-050, #F5F5F5)'
              margin="10px">
                <EncryptionIcon />

                <Span
                  fontSize="13px"
                  color="var(--neutral-neutral-600, #62626A)"
                  fontWeight='600'
                  textAlign="left"
                >
                  Messages are end-to-end encrypted. Only users in this chat can
                  view or listen to them.
                </Span>
              </Section>
            )}
            {
              selectedMessages ? (
                <MessageListCard
                  flexDirection="column"
                  justifyContent="start"
                  width="100%"
                  overflow="hidden scroll"
                  padding="0 3px 15px 3px"
                  ref={listInnerRef}
                  onScroll={onScroll}
                >
                  {selectedMessages?.messages.map(
                    (chat: IMessageIPFS, index: number) => {
                      const dateNum = moment(chat.timestamp).format('ddMMyyyy');

                      return (
                        <>
                          {dates.has(dateNum)
                            ? null
                            : renderDate({ chat, dateNum })}
                          <Messages chat={chat} key={index} />
                        </>
                      );
                    }
                  )}
                  {requestFeedids.includes(selectedChatId as string) && (
                    <Section
                      gap="5px"
                      background="#EDEDEE"
                      padding="8px 12px"
                      margin="5px 0"
                      borderRadius="12px 12px 12px 0px"
                      alignSelf="start"
                      justifyContent="start"
                      maxWidth="80%"
                      minWidth="15%"
                      position="relative"
                    >
                      <Span
                        alignSelf="center"
                        textAlign="left"
                        fontSize="16px"
                        fontWeight="400"
                        color="#000"
                      >
                        Please accept to enable push chat from this wallet
                      </Span>
                      <Section
                        width="36px"
                        height="36px"
                        cursor="pointer"
                        alignItems="center"
                        onClick={() => handleApproveChatRequest()}
                      >
                        {approveLoader ? <Spinner /> : <CheckCircleIcon />}
                      </Section>
                    </Section>
                  )}
                  <div ref={bottomRef} />
                </MessageListCard>
              ) : null
              //  (
              //   <Span margin="20px" fontSize="13px" color="rgb(101, 119, 149)">
              //     This is your first conversation with recipient. Start the
              //     conversation by sending a message.
              //   </Span>
              // )
            }
          </>
        )}
      </Section>

      {!requestFeedids.includes(selectedChatId as string) && (
        <Typebar scrollToBottom={scrollToBottom} />
      )}
    </Section>
  );
};

//styles

const MessageListCard = styled(Section)`
  &::-webkit-scrollbar-thumb {
    background: rgb(181 181 186);
    border-radius: 10px;
  }

  &::-webkit-scrollbar {
    width: 5px;
  }
`;

const FileDownloadIcon = styled.i`
  color: #575757;
`;

const FileDownloadIconAnchor = styled.a`
  font-size: 20px;
`;
