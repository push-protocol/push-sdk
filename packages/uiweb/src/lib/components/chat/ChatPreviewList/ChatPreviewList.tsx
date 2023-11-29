import React, { useContext, useEffect, useRef, useState } from 'react';

import { IChatPreviewListProps, IChatPreviewPayload, IChatPreviewProps } from '../exportedTypes';

import { CONSTANTS, IFeeds, PushAPI, chat } from '@pushprotocol/restapi';
import moment from 'moment';
import styled from 'styled-components';

import { useChatData, usePushChatSocket } from '../../../hooks';
import { Button, Section, Span, Spinner } from '../../reusables';


import useGetChatProfile from '../../../hooks/useGetChatProfile';


import { ChatPreview } from '../ChatPreview';
import { IChatTheme } from '../theme';
import { ThemeContext } from '../theme/ThemeProvider';

/**
 * @interface IThemeProps
 * this interface is used for defining the props for styled components
 */
interface IThemeProps {
  theme?: IChatTheme;
  blur: boolean;
}

interface IChatPreviewList {
  items: IChatPreviewPayload[];
  page: number;
  preloading: boolean;
  loading: boolean;
  reset: boolean;
  errored: boolean;
  errormsg: string;
}

export const ChatPreviewList: React.FC<IChatPreviewListProps> = (
  options: IChatPreviewListProps
) => {
  // get hooks
  const { env, signer, account, pgpPrivateKey, setPgpPrivateKey, connectedProfile, setConnectedProfile } = useChatData();
  const { fetchChatProfile } = useGetChatProfile();

  // set state
  const [ user, setUser ] = useState<PushAPI>();
  const [ chatPreviewList, setChatPreviewList ] = useState<IChatPreviewList>({ items: [], page: 1, preloading: true, loading: false, reset: false, errored: false, errormsg: '' });
  
  // set theme
  const theme = useContext(ThemeContext);

  // set ref
  const listInnerRef = useRef<HTMLDivElement>(null);

  // set stream hooks
  const { acceptedRequestMessage, messagesSinceLastConnection, groupInformationSinceLastConnection } = usePushChatSocket();

  // Functions
  // Transform chat payloads
  const transformChatItems: (items: IFeeds[]) => IChatPreviewPayload[] = (items: IFeeds[]) => {
    let transformedItems: IChatPreviewPayload[] = [];

    items.forEach((item: IFeeds) => {
      transformedItems.push({
        chatId: item.chatId,
        chatPic: item.groupInformation ? item.groupInformation.groupImage : item.profilePicture,
        chatSender: item.groupInformation ? item.groupInformation.groupName : item.did,
        chatTimestamp: item.msg.timestamp,
        chatMsg: {
          messageType: item.msg.messageType,
          messageContent: item.msg.messageContent,
        }
      });
    });

    return transformedItems;
  };

  // Add to chat payloads
  const modifyChatItems: (items: IFeeds[]) => void = (items: IFeeds[]) => {
    const transformedItems: IChatPreviewPayload[] = transformChatItems(items);
    const combinedItems: IChatPreviewPayload[] = [...chatPreviewList.items, ...transformedItems];
    console.log('combined items', combinedItems);
    const uniqueChatItems: IChatPreviewPayload[] = combinedItems
      .slice()
      .reverse()
      .filter((item, index, self) =>
        index === self.findIndex((t) => t.chatId === item.chatId)
      )
      .reverse();
    
    setChatPreviewList({ 
      items: uniqueChatItems, 
      page: chatPreviewList.page, 
      preloading: chatPreviewList.preloading, 
      loading: chatPreviewList.loading, 
      reset: chatPreviewList.reset, 
      errored: chatPreviewList.errored, 
      errormsg: chatPreviewList.errormsg 
    });
  }

  // Effects
  // If account, env or signer changes
  useEffect(() => {
    const createUser = async () => {
      setChatPreviewList({ items: [], page: 1, preloading: true, loading: false, reset: false, errored: false, errormsg: '' });

      const pushUser = await PushAPI.initialize(signer, {
        account: account,
        env: env
      });

      if (!pgpPrivateKey) {
        const encryptionInfo = await pushUser.encryption.info();
        setPgpPrivateKey(encryptionInfo.decryptedPgpPrivateKey);
      }

      if (!connectedProfile) {
        const user = await fetchChatProfile({ profileId: account!, env });
        if (user) setConnectedProfile(user);
      }

      setUser(pushUser);
    }

    if (signer || account) {
      createUser();
    }
  }, [account, signer, env]);

  // If pushUser changes
  useEffect(() => {
    if (!user) {
      return;
    }

    const initializeChatList = async () => {
      // Load chat type from options, if not present, default to CHATS
      const type = options.listType ? options.listType : CONSTANTS.CHAT.LIST_TYPE.CHATS;

      user.chat.list(type, {
        overrideAccount: options.overrideAccount ? options.overrideAccount : undefined,
      }).then((chats: IFeeds[]) => {
        // get and transform chats
        const transformedChats = transformChatItems(chats);
        setChatPreviewList({ items: transformedChats, page: 1, preloading: false, loading: false, reset: false, errored: false, errormsg: '' });
      }).catch((e) => {
        setChatPreviewList({ items: [], page: 1, preloading: false, loading: false, reset: false, errored: true, errormsg: 'No chats found' });
      });
    }

    initializeChatList();
  }, [user, options.listType, options.overrideAccount, chatPreviewList.reset]);

  // Listen to stream
  useEffect(() => {
    console.log("Message since last connection", messagesSinceLastConnection);
    console.log("Group information since last connection", groupInformationSinceLastConnection);
    console.log("Accepted request message", acceptedRequestMessage);
    if (Object.keys(messagesSinceLastConnection).length > 0 && messagesSinceLastConnection.constructor === Object) {
      const feedTransformedItem: IFeeds = {
        msg: {
          timestamp: messagesSinceLastConnection.timestamp,
          messageType: messagesSinceLastConnection.messageType,
          messageContent: messagesSinceLastConnection.messageContent,
        },
        did: messagesSinceLastConnection.fromDID.replace("eip155:"),
        wallets: '',
        profilePicture: '',
        name: '',
        publicKey: '',
        about: '',
        threadhash: '',
        intent: '',
        intentSentBy: '',
        intentTimestamp: new Date(),
        combinedDID: '',
        cid: messagesSinceLastConnection.cid,
        chatId: messagesSinceLastConnection.chatid,
        groupInformation: {},
        deprecated: false,
        deprecatedCode: ''
      }
      // form an array and pass it to modifyChatItems
      modifyChatItems([feedTransformedItem]);
    }
  }, [messagesSinceLastConnection, groupInformationSinceLastConnection, acceptedRequestMessage]);

  // Render
  return (
    <ChatPreviewListContainer
      ref={listInnerRef}
      theme={theme}
    >
      {chatPreviewList.preloading ? <Spinner color={theme.spinnerColor} /> : ''}
      {chatPreviewList.errored && 
        <Section
          padding="10px"
          flexDirection="column"
        >
          <Span margin="0 0 10px 0">{chatPreviewList.errormsg}</Span>
          <Button
            onClick={() => {setChatPreviewList({ items: [], page: 1, preloading: true, loading: false, reset: true, errored: false, errormsg: '' })}}
            background='rgb(226,8,128)'
            color='#fff'
            borderRadius='16px'
            padding='4px 12px'
          >
            Refresh
          </Button>
        </Section>
      }
      
      {/* do actual chat previews */}
      {!chatPreviewList.preloading && 
        chatPreviewList.items.map((item: IChatPreviewPayload) => {
          return (
            <ChatPreview
              selected={false}
              chatPreviewPayload={item}
            />
          )
        })
      }
    </ChatPreviewListContainer>
  );
};

//styles
const ChatPreviewListContainer = styled(Section)<IThemeProps>`
  height: inherit;
  overflow: hidden scroll;
  flex-direction: column;
  width: 100%;
  justify-content: start;
  padding: 0 2px;

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.scrollbarColor};
    border-radius: 10px;
  }

  &::-webkit-scrollbar {
    width: 5px;
  }
  
  overscroll-behavior: contain;
  scroll-behavior: smooth;
`;

