import useFetchChats from '../../../../../hooks/chat/useFetchChats';
import React, { useEffect, useState, useContext, useRef } from 'react';
import styled from 'styled-components';

import { ChatAndNotificationPropsContext, NotificationMainStateContext } from '../../../../../context';

import { Div, Section, Span } from '../../../../reusables/sharedStyling';
import { Spinner } from '../../../../reusables/Spinner';

import { useIsInViewport } from '../../../../../hooks';
import { NotificationFeedList } from './NotificationFeedList';

export const SpamNotificationFeedList = () => {
  const { spamNotifsFeed } = useContext<any>(NotificationMainStateContext);
  const { signer} = useContext<any>(ChatAndNotificationPropsContext);
  console.log(spamNotifsFeed);

  return (
    <SpamNotifListCard
      overflow="hidden auto"
      justifyContent="start"
      flexDirection="column"
      width="100%"
      padding="0 3px"
    >
      <Div>
        <NotificationFeedList notificationFeeds={spamNotifsFeed} isSpam={true && signer} />
      </Div>
    </SpamNotifListCard>
  );
};

//styles
const SpamNotifListCard = styled(Section)`
  &::-webkit-scrollbar-thumb {
    background: rgb(181 181 186);
    border-radius: 10px;
  }

  &::-webkit-scrollbar {
    width: 5px;
  }
`;
