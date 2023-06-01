import { ChatMainStateContext, ChatPropsContext } from '../../../../context';
import { ChatMainStateContextType } from '../../../../context/chat/chatMainStateContext';
import { getDefaultFeedObject, getNewChatUser, getObjectsWithMatchingKeys } from '../../../../helpers';
import { ChatFeedsType } from '../../../../types';
import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import SearchIcon from '../../../../icons/search.svg';
import CloseIcon from '../../../../icons/close.svg';
import { Spinner } from '../../../reusables/Spinner';
import { Section, Span } from '../../../reusables/sharedStyling';
import useGetChatProfile from '../../../../hooks/chat/useGetChatProfile';

type SearchPropType = {
  chatsFeed: ChatFeedsType;
};

export const Search: React.FC<SearchPropType> = ({ chatsFeed }) => {
  const [searchedText, setSearchedText] = useState<string>('');
  const { setSearchedChats, web3NameList, newChat } =
    useContext<ChatMainStateContextType>(ChatMainStateContext);
    const { env } = useContext<any>(ChatPropsContext);
  const [loading, setLoading] = useState<boolean>(false);
  const onChangeSearchText = (val: string) => {
    setSearchedText(val);
  };

  const {fetchChatProfile} = useGetChatProfile();

  const handleSearch = async() => {
    const result = getObjectsWithMatchingKeys(
      chatsFeed,
      searchedText,
      web3NameList
    );

    if (Object.keys(result || {}).length) setSearchedChats(result);
    else {
      if (!newChat) setSearchedChats({});
      else{
        const result = await getNewChatUser({searchText:searchedText,fetchChatProfile,env});
        if(result){
            const defaultFeed= getDefaultFeedObject({user:result});
            setSearchedChats({[defaultFeed.did]:defaultFeed});
        }
        else setSearchedChats({});
      }
    }
  };

  React.useEffect(() => {
    setLoading(true);
    const getData = setTimeout(() => {
      if (searchedText) {
        handleSearch();
      }
      setLoading(false);
    }, 2000);
    return () => clearTimeout(getData);
  }, [searchedText]);

  const onSearchReset = () => {
    setSearchedText('');
    setSearchedChats(null);
  };

  return (
    <Container
      justifyContent="space-between"
      padding="8px 12px"
      margin="4px 0"
      alignItems="center"
      background="#ededee"
    >
      <Input
        type="text"
        value={searchedText}
        onChange={(e) => onChangeSearchText(e.target.value)}
        placeholder="Search User"
        onKeyDown={(event) => {
            if (event.key === 'Enter') {
             handleSearch();
            }
          }}
      />
      <Span>
        {!loading && !searchedText && (
          <Image
            src={SearchIcon}
            alt="search icon"
            onClick={() => handleSearch()}
          />
        )}
        {!loading && searchedText && (
          <Image
            src={CloseIcon}
            alt="close icon"
            onClick={() => onSearchReset()}
          />
        )}
        {loading && <Spinner size="17.49" />}
      </Span>
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
    border: 1px solid transparent !important;
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
