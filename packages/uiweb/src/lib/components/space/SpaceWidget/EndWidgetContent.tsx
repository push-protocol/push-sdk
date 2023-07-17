import React from 'react';
import { Button, Container, Image, Text } from '../../../config';
import SpaceEnded from '../../../icons/SpaceEnded.svg';
import { SpaceInfoText } from './ScheduledWidgetContent';

interface IEndWidgetContentProps {
  tempProp?: string;
}

export const EndWidgetContent: React.FC<IEndWidgetContentProps> = (
  IEndWidgetContentProps
) => {
  return (
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
      <Button
        padding={'9px 34px'}
        borderRadius={'8px'}
        background={'#8B5CF6'}
        border={'1px solid #703BEB'}
        cursor={'pointer'}
      >
        <Text fontSize="14px" fontWeight={600} color="#fff">
          Close
        </Text>
      </Button>
    </Container>
  );
};
