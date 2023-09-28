import React, {  useContext, useRef, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';

import { ThemeContext } from '../theme/ThemeProvider';
import { IChatTheme } from '../theme';
import { Span, Image, Section } from '../../reusables';

import ArrowIcon from '../../../icons/CaretUp.svg';
import { useClickAway } from '../../../hooks';
import Dropdown, { DropdownValueType } from './DropDown';

export interface IDropDownInputProps {
  selectedValue: string;
  labelName?: string;
  dropdownValues: DropdownValueType[];
}

export const DropDownInput = (props: IDropDownInputProps) => {
  const theme = useContext(ThemeContext);
  const [showDropdown, setshowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<any>(null);

  const { selectedValue, dropdownValues, labelName } = props;

  //check if it works
    // useClickAway(dropdownRef, ()=> setshowDropdown(!showDropdown));

  const closeDropdown = () => {
    setshowDropdown(!showDropdown);
  };

  return (
    <ThemeProvider theme={theme}>
      <DropdownContainer>
        <LabelContainer>
          <label>{props.labelName}</label>
        </LabelContainer>
        <DropdownDiv ref={dropdownRef} onClick={closeDropdown}>
          <Span>{selectedValue}</Span>
          <ArrowImage
            src={ArrowIcon}
            width={'auto'}
            setPosition={!showDropdown}
            borderRadius="100%"
          />
        </DropdownDiv>
        {showDropdown && (
          <DropdownListContainer theme={theme} >
            <Dropdown
              dropdownValues={dropdownValues}
              hoverBGColor={theme.backgroundColor?.modalHoverBackground}
            />
          </DropdownListContainer>
        )}
      </DropdownContainer>
    </ThemeProvider>
  );
};

//style
const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  font-family: ${(props) => props.theme.fontFamily};
  gap: 5px;
`;

const LabelContainer = styled.div`
  font-weight: 500;
  font-size: 16px;
  color: ${(props) => props.theme.textColor?.modalHeadingText ?? '#000'};
`;

const DropdownDiv = styled.div<IChatTheme>`
  padding: 16px;
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  background: ${(props) => props.theme.backgroundColor.modalInputBackground};
  border: ${(props) => props.theme.border.modalInnerComponents};
  border-radius: ${(props) => props.theme.borderRadius.modalInnerComponents};

  font-family: ${(props) => props.theme.fontFamily};
  font-size: 16px;

  font-weight: 500;
`;
const ArrowImage = styled(Image)<{ setPosition: boolean }>`
  margin-left: auto;
  transform: ${(props) =>
    props?.setPosition ? 'rotate(0)' : 'rotate(180deg)'};
`;

const DropdownListContainer = styled(Section)<IChatTheme>`
  border-radius: ${(props) => props.theme.borderRadius.modalInnerComponents};
  padding:  8px;
  z-index: 9999999 !important;
  display: flex;
  flex-direction: column !important;
  background: ${(props) => props.theme.backgroundColor.modalBackground};
  border: ${(props) => props.theme.border.modalInnerComponents};
`;
