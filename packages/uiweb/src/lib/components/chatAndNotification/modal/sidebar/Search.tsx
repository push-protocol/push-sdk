import {
  PUSH_TABS,
  type ChatFeedsType,
  type NotificationFeedsType,
} from '../../../../types';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { SearchIcon } from '../../../../icons/Search';
import { CloseIcon } from '../../../../icons/Close';
import { Spinner } from '../../../reusables/Spinner';
import { Div, Section, Span } from '../../../reusables/sharedStyling';
import type {
  ChatMainStateContextType} from '../../../../context/chatAndNotification/chat/chatMainStateContext';
import {
  ChatMainStateContext
} from '../../../../context/chatAndNotification/chat/chatMainStateContext';
import { BackIcon } from '../../../../icons/Back';
import { ChatAndNotificationMainContext } from '../../../../context';
import type { ChatAndNotificationMainContextType } from '../../../../context/chatAndNotification/chatAndNotificationMainContext';

type SearchPropType = {
  feed: ChatFeedsType | NotificationFeedsType;
  handleSearch: any;
  onSearchReset: () => void;
  placeholder: string;
};

export const Search: React.FC<SearchPropType> = ({
  feed,
  handleSearch,
  onSearchReset,
  placeholder,
}) => {
  const [searchedText, setSearchedText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const onChangeSearchText = (val: string) => {
    setSearchedText(val);
  };

  const {  searchedChats, setSearchedChats } =
    useContext<ChatMainStateContextType>(ChatMainStateContext);

    const {
      newChat,
      setActiveTab
    } = useContext<ChatAndNotificationMainContextType>(ChatAndNotificationMainContext)
  React.useEffect(() => {
    setLoading(true);
    const getData = setTimeout(() => {
      onSearch();
      setLoading(false);
    }, 2000);
    return () => clearTimeout(getData);
  }, [searchedText]);

  
 const onSearch  = () =>{
  if (searchedText.trim() !== '') {
    handleSearch({ searchedText, feed });
  } else {
    onSearchReset();
  }
 }

  return (
    <Container
      justifyContent="space-between"
      margin="4px 0"
      gap="15px"
      alignItems="center"
    >
     {newChat && <Section
        width="auto"
        cursor="pointer"
        onClick={() => {
          setSearchedChats(null);
          setActiveTab(PUSH_TABS.CHATS);
        }}
      >
        <BackIcon />
      </Section>}
      <Section
        width="100%"
        background="#ededee"
        padding="8px 12px"
        borderRadius="4px"
      >
        <Input
          type="text"
          value={searchedText}
          onChange={(e) => onChangeSearchText(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              onSearch()
            }
          }}
        />
        <Span>
          {!loading && !searchedText && (
            <Div
              cursor="pointer"
              width="17.49px"
              height="17.49px"
              onClick={() => onSearch()}
            >
              <SearchIcon />
            </Div>
          )}
          {!loading && searchedText && (
            <Div
              cursor="pointer"
              onClick={() => {
                setSearchedText('');
                onSearchReset();
              }}
              width="17.49px"
              height="17.49px"
            >
              <CloseIcon />
            </Div>
          )}
          {loading && <Spinner size="17.49" />}
        </Span>
      </Section>    
    </Container>
  );
};

//styles
const Container = styled(Section)`
  border-radius: 4px;
`;

//   background: #ededee;
//   border: none;
//   width: 90%;
//   &:focus {
//     outline: none;
//     background-origin: border;
//     background-clip: padding-box, border-box;
//   }
//   &::placeholder {
//     color: #7a7a85;
//   }
// `;

// const Image = styled.img`
//   vertical-align: middle;
//   cursor: pointer;
// `;

// const SubSection = styled(Section)`
//   background: #ffffff;
//   border: 1px solid #c8c8cb;
//   border-radius: 8px;
//   flex: 1;
//   padding: 10px 10px 10px 15px;
//   margin-left: 18px;
// `;

const Input = styled.input`
  border: none;
  background: #ededee;
  width: 100%;
  flex: 1;
  margin-left: 10px;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  &:focus {
    outline: none;
    background-origin: border;
    background-clip: padding-box, border-box;
  }
  &::placeholder {
    color: #62626a;
  }
`;
