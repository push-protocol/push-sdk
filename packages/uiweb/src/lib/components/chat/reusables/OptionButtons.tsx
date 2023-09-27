import React, { useContext } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Section, Span } from '../../reusables';
import { Button } from './Button';
import { ThemeContext } from '../theme/ThemeProvider';
import { device } from '../../../config';

export interface OptionDescription {
  heading: string;
  subHeading?: string;
  value: string;
}
interface OptionButtonsProps {
  options: Array<OptionDescription>;
  // selectedValue: string;
  // handleClick: ()=>void;
}

interface ButtonSectionProps {
  borderWidth: string;
  borderRadius: string;
  borderColor: string;
  // background:string;
}
const OptionDescripton = ({ heading, subHeading,value }: OptionDescription) => {
  const theme = useContext(ThemeContext);
  return (
    <>
      <Span
        color={
          // selectedValue === value?
          // theme.textColor?.modalHeadingText
          // :
          theme.textColor?.modalSubHeadingText
        }
        fontSize="18px"
        fontWeight="500"
      >
        {heading}
      </Span>
      <Span
        color={theme.textColor?.modalSubHeadingText}
        fontWeight="400"
        fontSize="12px"
      >
        {subHeading}
      </Span>
    </>
  );
};
const OptionButtons = ({ options,
  //  selectedValue
   }: OptionButtonsProps) => {
  const theme = useContext(ThemeContext);
  return (
    <ThemeProvider theme={theme}>
      <ButtonContainer>
        {options.map((option, index) => (
          <ButtonSection
            borderRadius={
              index === 0 ? '12px 0px 0px 12px' : '0px 12px 12px 0px'
            }
            borderColor={theme.border!.modalInnerComponents!}
            borderWidth={index === 0 ? '1px 0px 1px 1px' : '1px'}
            // background={selectedValue === option.value?theme.backgroundColor.modalHoverBackground:'none'}
          >
            <OptionDescripton {...option} />
          </ButtonSection>
        ))}
      </ButtonContainer>
    </ThemeProvider>
  );
};

export default OptionButtons;

const ButtonContainer = styled.div`
  display: flex;
`;

const ButtonSection = styled(Section)<ButtonSectionProps>`
  cursor:pointer
  justify-content: center;
  align-items: center;
  gap: 3px;
  width:160px;
  @media ${device.mobileL} {
    width:130px;
  }
  padding: 10px;
  border: ${(props) => props.borderColor};
  // background: ${(props) => props.background};
  border-width: ${(props) => props.borderWidth};
  border-style: solid;
  border-radius: ${(props) => props.borderRadius};
  flex-direction: column;
  &:hover{
    background: ${(props) => props.theme.backgroundColor.modalHoverBackground};
  }
`;
