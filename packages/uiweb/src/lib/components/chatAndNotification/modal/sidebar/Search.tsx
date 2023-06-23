
import { PUSH_TABS, type ChatFeedsType, type NotificationFeedsType } from '../../../../types';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { SearchIcon } from '../../../../icons/Search';
import { CloseIcon } from '../../../../icons/Close';
import { Spinner } from '../../../reusables/Spinner';
import { Div, Section, Span } from '../../../reusables/sharedStyling';
import useGetChatProfile from '../../../../hooks/chat/useGetChatProfile';
import { ChatMainStateContext, ChatMainStateContextType } from '../../../../context/chatAndNotification/chat/chatMainStateContext';
import { BackIcon } from '../../../../icons/Back';
import { NewMessage } from '../../../../icons/NewMessage';
import NewMessageContent from './NewMessageContent';

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
  placeholder
}) => {
  const [searchedText, setSearchedText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const onChangeSearchText = (val: string) => {
    setSearchedText(val);
  };

  const {
    newChat,
    setActiveTab,
    searchedChats,
    setSearchedChats
  } = useContext<ChatMainStateContextType>(ChatMainStateContext);


  React.useEffect(() => {
    setLoading(true);
    const getData = setTimeout(() => {
      if (searchedText) {
        handleSearch({ searchedText, feed });
      } else {
        onSearchReset();
      }
      setLoading(false);
    }, 2000);
    return () => clearTimeout(getData);
  }, [searchedText]);



  return (
    <Container
      justifyContent="space-between"
      // padding="8px 12px"
      margin="4px 0"
      alignItems="center"
    // background="#ededee"
    >
      {!newChat && (
        <Section width='100%' background="#ededee" padding='8px 12px' borderRadius='4px'>
          <Input
            type="text"
            value={searchedText}
            onChange={(e) => onChangeSearchText(e.target.value)}
            placeholder={placeholder}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSearch({ searchedText, feed });
              }
            }}
          />
          <Span>
            {!loading && !searchedText && (
              <Div
                cursor="pointer"
                width="17.49px"
                height="17.49px"
                onClick={() => handleSearch({ searchedText, feed })}
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
      )}


      {newChat && (
        <Section flexDirection='column' width='100%'>

          <Section width='100%'>
            <Div
              width='auto'
              cursor="pointer"
              onClick={() => {
                setSearchedChats(null);
                setActiveTab(PUSH_TABS.CHATS);
              }}
            >
              <BackIcon />
            </Div>

            <SubSection>

              {!loading && !searchedText && (
                <Span>
                  <Div
                    cursor="pointer"
                    width="17.49px"
                    height="17.49px"
                  >
                    <SearchIcon />
                  </Div>
                </Span>
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



              <NewMessageInput
                type="text"
                value={searchedText}
                onChange={(e) => onChangeSearchText(e.target.value)}
                placeholder={"Search name or domain"}
              />
            </SubSection>
          </Section>

          {!searchedChats && (
            <NewMessageContent
              IconComponent={<NewMessage />}
              title=" Start a new chat"
              subTitle=" Start by searching for a domain or wallet address"
            />
          )}

        </Section>
      )}






    </Container>
  );
};

//styles
const Container = styled(Section)`
  border-radius: 4px;
`;

const Input = styled.input`
  background: #ededee;
  border: none;
  width: 90%;
  &:focus {
    outline: none;
    background-origin: border;
    // border: 1px solid transparent !important;
    background-clip: padding-box, border-box;
  }
  &::placeholder {
    color: #7a7a85;
  }
`;

const Image = styled.img`
  vertical-align: middle;
  cursor: pointer;
`;

const SubSection = styled(Section)`
  background: #FFFFFF;
  border: 1px solid #C8C8CB;
  border-radius: 8px;
  flex:1;
  padding: 10px 10px 10px 15px;
  margin-left:18px;
`

const NewMessageInput = styled.input`
  border: none;
  width: 100%;
  flex:1;
  margin-left:10px;
  // font-family: 'Inter';
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
    color: #62626A;
  }
`;
