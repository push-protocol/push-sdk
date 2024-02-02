import React, {  useContext } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Section } from '../../reusables';
import { Button } from '../../../config';

// import { ThemeContext } from '../../chat/theme/ThemeProvider';

export interface IHyperlinkProps {
  link: string;
  text: string;
  icon?:boolean
}

// interface ILabelProps {
//   fontSize?: string;
//   fontWeight?: string;
//   textColor?: string;
// }
export const Hyperlink = ({link,text,icon=false}: IHyperlinkProps) => {

  // const theme = useContext(ThemeContext);

  return (
    // <ThemeProvider theme={theme}>
      <HyperlinkContainer>
       <Span>{Text}</Span>
       <Button></Button>
      </HyperlinkContainer>
    // </ThemeProvider>
  );
};

/* styling */
const HyperlinkContainer = styled(Section)`
  display: flex;
  width:100%;
  font-family: inherit;
    align-items:center;
`;



