import { NewMessage } from '../../../../icons/NewMessage';
import { SearchIcon } from '../../../../icons/Search';
import type { SidebarPlaceholderKeys } from '../../../../types';
import type React from 'react';
import { Section, Span } from '../../../reusables';

type SidebarPlaceholderPropsType = {
  id: SidebarPlaceholderKeys;
};

const SidebarPlaceholderContent = {
  SEARCH: {
    title: 'No Results',
    subTitle: '',
    IconComponent: <SearchIcon height="40" width="40" />,
  },
  CHAT: {
    title: 'Start a new chat',
    subTitle: 'Start by searching for a domain or wallet address',
    IconComponent: <NewMessage />,
  },
  NOTIFICATION: {
    title: 'No message from apps yest',
    subTitle:
      'Keep an eye out for upcoming messages from the apps you connect with.',
    IconComponent: <NewMessage />,
  },
};
export const SidebarPlaceholder: React.FC<SidebarPlaceholderPropsType> = ({ id }) => {
  return (
    <Section flexDirection="column" margin="77px 0 0 0 " gap="15px">
      {SidebarPlaceholderContent[id].IconComponent}
      <Section flexDirection="column" gap="10px">
        <Span
          textAlign="center"
          fontSize="18px"
          fontWeight="700"
          lineHeight="24px"
          color={'#62626A'}
        >
          {SidebarPlaceholderContent[id].title}
        </Span>
        <Span
          textAlign="center"
          fontSize="14px"
          fontWeight="400"
          lineHeight="20px"
          color={'#62626A'}
          padding="0px 100px"
        >
          {SidebarPlaceholderContent[id].subTitle}
        </Span>
      </Section>
    </Section>
  );
};

