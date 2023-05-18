import {
  ChatMainStateContext,
  ChatPropsContext,
} from '../../../../context';
import React, { useEffect, useRef, useContext } from 'react';
import { Image, Section, Span } from '../../../reusables/sharedStyling';
import styled from 'styled-components';
import useFetchHistoryMessages from '../../../../hooks/chat/useFetchHistoryMessages';
import { IMessageIPFS } from '@pushprotocol/restapi';
import { Spinner } from '../../../reusables/Spinner';
import moment from 'moment';
import { dateToFromNowDaily } from '../../../../helpers';
import { pCAIP10ToWallet } from '../../../../helpers';
import CheckCircleIcon from '../../../../icons/chat/checkCircle.svg';
import useApproveChatRequest from '../../../../hooks/chat/useApproveChatRequest';
import { PUSH_TABS } from '../../../../types';
import { Typebar } from './typebar/Typebar';

const CHATS_FETCH_LIMIT = 15;

// const FileCard = ({
//   chat,
//   position,
// }: {
//   chat: IMessageIPFS;
//   position: number;
// }) => {
//   return (
//     <Section alignSelf={position ? 'end' : 'start'}  maxWidth="80%" margin="5px 0"
//     >
//       <Image
//        src={(JSON.parse(chat.messageContent)).content}
//         alt=""
//         width='100%'
//         borderRadius={position ? '12px 12px 0px 12px' : '12px 12px 12px 0px'}
//       />
//     </Section>
//   );
// };

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
      maxWidth="80%"
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
      maxWidth="80%"
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
      minWidth="15%"
      position="relative"
    >
      {' '}
      <Section flexDirection="column"     padding="5px 0 15px 0">
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

//make provision for different msg type
const Messages = ({ chat }: { chat: IMessageIPFS }) => {
  const { account } = useContext<any>(ChatPropsContext);
  console.log(chat.fromDID);
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
  return <MessageCard chat={chat} position={position} />;
};

export const MessageBox = () => {
  const {
    selectedChatId,
    chatsFeed,
    requestsFeed,
    chats,
    setRequestsFeed,
    setActiveTab,
    setChatFeed,
    activeTab
  } = useContext<any>(ChatMainStateContext);
  const { account, env, decryptedPgpPvtKey } =
    useContext<any>(ChatPropsContext);
  const selectedChat =
    chatsFeed[selectedChatId] || requestsFeed[selectedChatId];
  const requestFeedids = Object.keys(requestsFeed);
  const selectedMessages = chats.get(selectedChatId);
  const dates = new Set();
  const listInnerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { historyMessages, loading } = useFetchHistoryMessages();
  const { approveChatRequest } = useApproveChatRequest();

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

  console.log(loading);

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
      selectedMessages?.messages.length &&
      selectedMessages?.messages.length <= CHATS_FETCH_LIMIT
    ) {
      scrollToBottom(null);
    }
  }, [chats.get(selectedChatId)]);

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
         

          // const chatTemp = { ...chatsFeed };
          console.log(selectedChatId)
          // chatTemp[selectedChatId] = selectedRequest;
          setChatFeed(selectedChatId, selectedRequest);
          setActiveTab(PUSH_TABS.CHATS);
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
      margin="20px  0"
      height="100%"
    >
      <Container
        width="100%"
        height="85%"
        justifyContent="start"
        flexDirection="column"
        alignItems="start"
        borderWidth="1px 0 1px 0"
        borderStyle='dashed none solid none'
        borderColor='#ededee transparent #dddddf transparent'
      >
        {!loading ? <Spinner size="sm" /> : ''}
        <MessageListCard
          flexDirection="column"
          justifyContent="start"
          width="100%"
          overflow="hidden scroll"
          padding="0 3px"
          ref={listInnerRef}
          onScroll={onScroll}
        >
          {selectedMessages?.messages.map(
            (chat: IMessageIPFS, index: number) => {
              const dateNum = moment(chat.timestamp).format('ddMMyyyy');

              return (
                <>
                  {dates.has(dateNum) ? null : renderDate({ chat, dateNum })}
                  <Messages chat={chat} key={index} />
                </>
              );
            }
          )}
          {requestFeedids.includes(selectedChatId) && (
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
                This is your first conversation with the sender.
              </Span>
              <Image
                src={CheckCircleIcon}
                alt="approve icon"
                width="36px"
                height="36px"
                cursor="pointer"
                onClick={() => handleApproveChatRequest()}
              />
            </Section>
          )}
          <div ref={bottomRef} />
        </MessageListCard>
      </Container>

     { !(activeTab === PUSH_TABS.REQUESTS) && <Typebar scrollToBottom={scrollToBottom} />}
    </Section>
  );
};

//styles
const Container = styled(Section)`
  // border-top: 1px dashed #ededee;
  // border-bottom: 1px solid #dddddf;
`;

const MessageListCard = styled(Section)`
  &::-webkit-scrollbar-thumb {
    background: rgb(181 181 186);
    border-radius: 10px;
  }

  &::-webkit-scrollbar {
    width: 5px;
  }
`;
