import React, { useContext } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Anchor, Section, Span, Image } from '../../reusables';
import { Button } from '../../../config';
import HyperLinkIcon from '../../../icons/hyperlink.svg';
import { ThemeContext } from '../theme/ThemeProvider';

// import { ThemeContext } from '../../chat/theme/ThemeProvider';

type CustomStyleParamsType = {
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  textDecoration?: string;
};
export interface IHyperlinkProps {
  link: string;
  text: string;
  icon?: boolean;
  customStyle?: CustomStyleParamsType;
}

export const Hyperlink = ({ link, text, customStyle }: IHyperlinkProps) => {
  const theme = useContext(ThemeContext);

  return (
    <ThemeProvider theme={theme}>
    <HyperlinkContainer justifyContent="start">
      <Anchor
        href = {link}
        target='_blank'
        fontSize={customStyle?.fontSize ?? '12px'}
        fontWeight={customStyle?.fontWeight ?? '400'}
        textDecoration={customStyle?.textDecoration ?? 'underline'}
        color={customStyle?.color ?? theme.textColor?.modalHighlightedText}
      >
        {text}
        <Button border="none" background={theme?.backgroundColor?.modalBackground} verticalAlign='text-bottom'>
          <Image src={HyperLinkIcon} />
        </Button>
      </Anchor>
   
    </HyperlinkContainer>
    </ThemeProvider>
  );
};

/* styling */
const HyperlinkContainer = styled(Section)`
  display: flex;
  width: 100%;
  font-family: inherit;
`;
