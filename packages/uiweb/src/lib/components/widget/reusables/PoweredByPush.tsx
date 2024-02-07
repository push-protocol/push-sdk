import React, {  useContext } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Image, Section, Span } from '../../reusables';
import PoweredByPushLogo from '../../../icons/poweredByPush.svg';
import { ThemeContext } from '../theme/ThemeProvider';

// import { ThemeContext } from '../../chat/theme/ThemeProvider';



export const PoweredByPush = () => {

  const theme = useContext(ThemeContext);

  return (
    <ThemeProvider theme={theme}>
      <Container alignSelf='end'>
       <Image src={PoweredByPushLogo}/>
      </Container>
     </ThemeProvider>
  );
};

/* styling */
const Container = styled(Section)`
  display: flex;
  width: 93.208px;
  height: 12.861px;
  font-family: inherit;
    align-items:center;
`;



