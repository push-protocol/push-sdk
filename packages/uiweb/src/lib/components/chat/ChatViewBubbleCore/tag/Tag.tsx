// React + Web3 Essentials
import React, { useContext } from 'react';

// External Packages
import styled from 'styled-components';

// Internal Compoonents
import { Span } from '../../../reusables';
import { ThemeContext } from '../../theme/ThemeProvider';

// Internal Configs

// Assets

// Interfaces & Types
import { IMessagePayload } from '../../exportedTypes';

// Constants

// Exported Interfaces & Types
interface TagProps {
  type: 'Image' | 'GIF' | 'Video' | 'Audio';
}

export const Tag = ({ type }: TagProps) => {
  // get theme
  const theme = useContext(ThemeContext);

  return (
    <Span
      width="auto"
      alignSelf="start"
      textAlign="left"
      lineHeight="1.4em"
      fontSize="10px"
      fontWeight="500"
      padding="4px 8px"
      borderRadius="8px"
      textTransform="uppercase"
      letterSpacing="1.2px"
      color={theme.textColor?.chatSentBubbleText}
      background={theme.backgroundColor?.chatPreviewTagBackground}
    >
      {type}
    </Span>
  );
};
