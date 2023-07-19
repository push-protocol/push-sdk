import React, { MouseEventHandler } from 'react';
import { Item, Container, Image, Text } from '../../../config';
import SpaceEnded from '../../../icons/SpaceEnded.svg';
import { SpaceInfoText } from './ScheduledWidgetContent';

import { ThemeProvider } from 'styled-components';
import { ThemeContext } from '../theme/ThemeProvider';

interface IEndWidgetContentProps {
  onClose: MouseEventHandler;
  toggleWidgetVisibility: () => void;
}

export const EndWidgetContent: React.FC<IEndWidgetContentProps> = ({
  onClose,
  toggleWidgetVisibility,
}) => {
  const theme = React.useContext(ThemeContext);
  const handleCloseWidget: React.MouseEventHandler<HTMLDivElement> = (
    event
  ) => {
    // Call for hiding the widget
    toggleWidgetVisibility();

    // Call for running onClose handler from prop
    onClose(event);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        display={'flex'}
        height={'100%'}
        alignItems={'center'}
        flexDirection={'column'}
        justifyContent={'center'}
        gap={'15px'}
        padding={'0 24px'}
      >
        <Image
          width={'41px'}
          height={'41px'}
          src={SpaceEnded}
          alt="End Icon"
        ></Image>
        <SpaceInfoText>This Space has ended</SpaceInfoText>
        <Item
          padding={'9px 34px'}
          borderRadius={'8px'}
          background={`${theme.btnColorPrimary}`}
          border={`1px solid ${theme.borderColor}`}
          cursor={'pointer'}
          onClick={handleCloseWidget}
        >
          <Text
            fontSize="14px"
            fontWeight={600}
            color={`${theme.textColorPrimary}`}
          >
            Close
          </Text>
        </Item>
      </Container>
    </ThemeProvider>
  );
};
