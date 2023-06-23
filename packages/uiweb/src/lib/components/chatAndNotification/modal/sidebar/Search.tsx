
import type { ChatFeedsType, NotificationFeedsType } from '../../../../types';
import React, { useState } from 'react';
import styled from 'styled-components';
import { SearchIcon } from '../../../../icons/Search';
import { CloseIcon } from '../../../../icons/Close';
import { Spinner } from '../../../reusables/Spinner';
import { Div, Section, Span } from '../../../reusables/sharedStyling';
import useGetChatProfile from '../../../../hooks/chat/useGetChatProfile';

type SearchPropType = {
  feed: ChatFeedsType | NotificationFeedsType;
  handleSearch: any;
  onSearchReset: () => void;
  placeholder:string;
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
    console.log("in here handle")
    handleSearch({ searchedText, feed });
  } else {
    onSearchReset();
  }
 }

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
        placeholder={placeholder}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            onSearch();
          }
        }}
      />
      <Span>
        {!loading && !searchedText && (
          <Div
            cursor="pointer"
            width="17.49px"
            height="17.49px"
            onClick={() =>onSearch()}
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
