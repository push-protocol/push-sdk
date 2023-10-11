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
  totalWidth?:string;
  selectedValue: string;
  handleClick: (el:string)=>void;
  error?:boolean;
}

interface ButtonSectionProps {
  borderWidth: string;
  borderRadius: string;
  borderColor: string;
  totalWidth:string;
  noOfOptions:number;
  error:boolean;
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
          theme.textColor?.modalHeadingText
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


export const OptionButtons = ({ options,selectedValue,handleClick,  totalWidth = '400px',error}: OptionButtonsProps) => {
  const theme = useContext(ThemeContext);

const getBorderWidth = (index:number) =>{
  if(index === 0)
  return '1px 1px 1px 1px';
 if(index >0 && index <(options.length -1))
    return '1px 1px 1px 0px';
  return '1px 1px 1px 0px';

}
const getBorderRadius = (index:number) =>{
  if(index === 0)
  return '12px 0px 0px 12px';
 if(index >0 && index <(options.length -1))
    return '0px';
  return '0px 12px 12px 0px';

}

  return (
    <ThemeProvider theme={theme}>
      <ButtonContainer>
        {options.map((option, index) => (
          <ButtonSection
            totalWidth={totalWidth}
            noOfOptions={options.length}
            borderRadius={
              getBorderRadius(index)
            }
            error={error || false}
            borderColor={theme.border!.modalInnerComponents!}
            borderWidth={getBorderWidth(index)}
            background={selectedValue === option.value ? theme.backgroundColor?.modalHoverBackground : 'none'}
            onClick={()=>{handleClick(option.value)}}
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
  cursor:pointer;
  justify-content: center;
  align-items: center;
  gap: 3px;
  width: ${(props) => `calc((${props.totalWidth} - 80px) / ${props.noOfOptions})`};
  @media ${device.mobileL} {
    width: ${(props) => `calc(((${props.totalWidth} - 80px) / ${props.noOfOptions}) - 30px)`};
  }
  padding: 10px;
  border: ${(props) => props.borderColor};
  border: ${(props) => props.error?'  #ED5858':props.borderColor};

  // background: ${(props) => props.background};
  border-width: ${(props) => props.borderWidth};
  border-style: solid;
  border-radius: ${(props) => props.borderRadius};
  flex-direction: column;
  &:hover{
    background: ${(props) => props.theme.backgroundColor.modalHoverBackground};
  }
`;
