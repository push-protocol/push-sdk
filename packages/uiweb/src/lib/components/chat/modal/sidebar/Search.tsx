import { ChatMainStateContext } from '../../../../context';
import { ChatMainStateContextType } from '../../../../context/chat/chatMainStateContext';
import { getObjectsWithMatchingKeys } from '../../../../helpers';
import { ChatFeedsType } from '../../../../types';
import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import SearchIcon from '../../../../icons/chat/search.svg';
import CloseIcon from '../../../../icons/chat/close.svg';
import { Spinner } from '../../../reusables/Spinner';
import { Section, Span } from '../../../reusables/sharedStyling';

type SearchPropType = {
  chatsFeed: ChatFeedsType;
};

export const Search: React.FC<SearchPropType> = ({ chatsFeed }) => {
  const [searchedText, setSearchedText] = useState<string>('');
  const { setSearchedChats,web3NameList} =
    useContext<ChatMainStateContextType>(ChatMainStateContext);
  const [loading, setLoading] = useState<boolean>(false);
  const onChangeSearchText = (val: string) => {
    setSearchedText(val);
  };

  const handleSearch = () => {
    const result = getObjectsWithMatchingKeys(chatsFeed, searchedText,web3NameList);

    if (Object.keys(result || {}).length) setSearchedChats(result);
    else {
      setSearchedChats({});
    }
  };

  React.useEffect(() => {
    setLoading(true);
    const getData = setTimeout(() => {
        if(searchedText){
            handleSearch();

        }
        setLoading(false);

    }, 2000);
    return () => clearTimeout(getData);
  }, [searchedText]);


  const onSearchReset = ()=>{
    setSearchedText('');
    setSearchedChats(null);
  }

  return (
    <Container justifyContent="space-between"
    padding="8px 12px" margin='4px 0' alignItems='center' background='#ededee'>
      <Input
        type="text"
        value={searchedText}
        onChange={(e) => onChangeSearchText(e.target.value)}
        placeholder="Search User"
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
        {loading  && <Spinner size="17.49" />}
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
  cursor:pointer;
`;

