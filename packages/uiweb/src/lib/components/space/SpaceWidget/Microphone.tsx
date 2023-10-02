import React, { useContext } from 'react';
import { ThemeProvider } from 'styled-components';
import type { ToggleSource } from '@livekit/components-core';
import { useTrackToggle, TrackToggleProps } from "@livekit/components-react";

import { ThemeContext } from '../theme/ThemeProvider';

import { Image, Item, Text } from '../../../config';
import MicEngagedIcon from '../../../icons/MicEngage.svg';
import MuteIcon from '../../../icons/Muted.svg';

export default function Microphone<T extends ToggleSource>({ showIcon, ...props }: TrackToggleProps<T>) {
    const { enabled } = useTrackToggle(props);
    const theme = useContext(ThemeContext);

    return (
        <ThemeProvider theme={theme}>
            <Item
                cursor={'pointer'}
                display={'flex'}
                alignItems={'center'}
                gap={'8px'}
                padding={'10px'}
            >
                <Image
                    width={'14px'}
                    height={'20px'}
                    src={
                        enabled
                            ? MicEngagedIcon
                            : MuteIcon
                    }
                    alt="Mic Icon"
                />
                <Text
                    color={`${theme.btnOutline}`}
                    fontSize={'14px'}
                    fontWeight={600}
                >
                    {enabled ? 'Speaking' : 'Muted'}
                </Text>
            </Item>
        </ThemeProvider>
    )
}
