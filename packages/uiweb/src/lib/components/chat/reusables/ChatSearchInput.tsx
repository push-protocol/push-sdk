import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { Div, Section, Span, Spinner } from '../../reusables';
import { SearchIcon } from '../../../icons/Search';
import { CloseIcon } from '../../../icons/Close';
import { ThemeContext } from '../theme/ThemeProvider';
import { IChatTheme } from '../theme';

/**
 * @interface IThemeProps
 * this interface is used for defining the props for styled components
 */
interface IThemeProps {
  theme?: IChatTheme;
  customStyle?: CustomStyleParamsType | null;
}

type ChatSearchInputPropType = {
  handleSearch: any;
  clearInput: () => void;
  placeholder: string;
  customStyle?: CustomStyleParamsType | null;
};
export type CustomStyleParamsType = {
  background?: string;
  borderRadius?: string;
  placeholderColor?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  border?: string;
};

export const ChatSearchInput: React.FC<ChatSearchInputPropType> = ({
  handleSearch,
  clearInput,
  customStyle = null,
  placeholder,
}) => {
  const theme = useContext(ThemeContext);
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

  const onSearch = () => {
    if (searchedText.trim() !== '') {
      handleSearch({ searchedText });
    } else {
      clearInput();
    }
  };
  return (
    <Container
      justifyContent="space-between"
      margin="4px 0"
      gap="15px"
      width="100%"
      alignItems="center"
    >
      <InputSection
        theme={theme}
        width="100%"
        background={
          customStyle?.background
            ? customStyle.background
            : theme.backgroundColor?.searchInputBackground
        }
        padding="8px 12px"
        borderRadius={
          customStyle?.borderRadius
            ? customStyle.borderRadius
            : theme.borderRadius?.searchInput
        }
        customStyle={customStyle}
      >
        <Input
          theme={theme}
          customStyle={customStyle}
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
                clearInput();
              }}
              width="17.49px"
              height="17.49px"
            >
              <CloseIcon />
            </Div>
          )}
          {loading && <Spinner size="17.49" color={theme.spinnerColor}/>}
        </Span>
      </InputSection>
    </Container>
  );
};

//styles
const Container = styled(Section)`
  border-radius: 4px;
`;

const InputSection = styled(Section)<IThemeProps>`
  border: ${(props) =>
    props.customStyle?.border
      ? props.customStyle.border
      : props.theme.border?.searchInput};


    //   props.customStyle?.background
    //     ? props.customStyle.background
    //     : props.theme.backgroundColor?.searchInputBackground
    //   };
  //   outline: none;
  //   background-image: linear-gradient(#f4f5fa, #f4f5fa),
  //     linear-gradient(
  //       to right,
  //       rgba(182, 160, 245, 1),
  //       rgba(244, 110, 246, 1),
  //       rgba(255, 222, 211, 1),
  //       rgba(255, 207, 197, 1)
  //     );
  //   background-origin: border;
  //   border: 1px solid transparent !important;
  //   background-clip: padding-box, border-box;
  // }

`;

const Input = styled.input<IThemeProps>`
  border: none;
  background: ${(props) =>
    props.customStyle?.background
      ? props.customStyle.background
      : props.theme.backgroundColor?.searchInputBackground};
  width: 100%;
  flex: 1;
  margin-left: 10px;
  font-style: normal;
  color: ${(props) =>
    props.customStyle?.color
      ? props.customStyle.color
      : props.theme.textColor.searchInputText};
  font-weight: ${(props) =>
    props.customStyle?.fontWeight
      ? props.customStyle.fontWeight
      : props.theme.fontWeight.searchInputText};
  font-size: ${(props) =>
    props.customStyle?.fontSize
      ? props.customStyle.fontSize
      : props.theme.fontSize.searchInputText};
  line-height: 24px;
  &:focus {
    outline: none;
    background-origin: border;
    background-clip: padding-box, border-box;
  }
  &::placeholder {
    color: ${(props) =>
      props.customStyle?.placeholderColor
        ? props.customStyle.placeholderColor
        : props.theme.textColor.searchPlaceholderText};
    font-weight: ${(props) =>
      props.customStyle?.fontWeight
        ? props.customStyle.fontWeight
        : props.theme.fontWeight.searchInputText};
    font-size: ${(props) =>
      props.customStyle?.fontSize
        ? props.customStyle.fontSize
        : props.theme.fontSize.searchInputText};
  }
`;

//theme
