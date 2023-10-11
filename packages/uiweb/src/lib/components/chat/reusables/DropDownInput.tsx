import React, { useContext, useRef, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';

import { ThemeContext } from '../theme/ThemeProvider';
import { IChatTheme } from '../theme';
import { Span, Image, Section } from '../../reusables';

import ArrowIcon from '../../../icons/CaretUp.svg';
import { useClickAway } from '../../../hooks';
import Dropdown, { DropdownValueType } from './DropDown';

export interface IDropDownInputProps {
  selectedValue: number;
  labelName?: string;
  dropdownValues: DropdownValueType[];
  error?:boolean;
}

export const DropDownInput = (props: IDropDownInputProps) => {
  const theme = useContext(ThemeContext);
  const [showDropdown, setshowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<any>(null);

  const { selectedValue, dropdownValues, labelName ,error} = props;

  // useClickAway(dropdownRef, ()=> setshowDropdown(!showDropdown));

  const closeDropdown = () => {
    setshowDropdown(!showDropdown);
  };

  return (
    <ThemeProvider theme={theme}>
      <DropdownContainer >
        <LabelContainer>
          <label>{props.labelName}</label>
        </LabelContainer>
    
            <DropdownDiv ref={dropdownRef} onClick={closeDropdown} error= {error || false} >
              <Span margin="0 7px 0 0">
                {dropdownValues[selectedValue].title}{' '}
              </Span>
              <ArrowImage
                src={ArrowIcon}
                width={'auto'}
                setPosition={!showDropdown}
                borderRadius="100%"
              />
            </DropdownDiv>
 
          {showDropdown && (
            <DropdownListContainer theme={theme} onClick={closeDropdown}>
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
const DropdownContainer = styled(Section)`
  display: flex;
  flex-direction: column;
  width: 100%;
  z-index:unset;
  align-items:flex-start;
  font-family: ${(props) => props.theme.fontFamily};
  gap: 8px;
`;

const LabelContainer = styled.div`
  font-weight: 400;
  font-size: 16px;
  color: ${(props) => props.theme.textColor?.modalHeadingText ?? '#000'};
`;

const DropdownDiv = styled(Section)<IChatTheme & {error:boolean}>`
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  background: ${(props) => props.theme.backgroundColor.modalInputBackground};
  border: ${(props) => props.error?' 1px solid #ED5858':props.theme.border.modalInnerComponents};
  border-radius: ${(props) => props.theme.borderRadius.modalInnerComponents};

  font-family: ${(props) => props.theme.fontFamily};
  font-size: 16px;
  span {
    text-wrap: nowrap;
  }
  font-weight: 500;
`;
const ArrowImage = styled(Image)<{ setPosition: boolean }>`
  margin-left: auto;
  transform: ${(props) =>
    props?.setPosition ? 'rotate(0)' : 'rotate(180deg)'};
`;

const DropdownListContainer = styled(Section)<IChatTheme>`
  position: absolute;
  width: 100%;
  top:30%;
  right:-9px;
  border-radius: ${(props) => props.theme.borderRadius.modalInnerComponents};
  padding: 8px;
  z-index: 100;
  display: flex;
  flex-direction: column !important;
  background: ${(props) => props.theme.backgroundColor.modalBackground};
  border: ${(props) => props.theme.border.modalInnerComponents};
`;
