import React, { useContext, useState } from 'react';
import { Button, PoweredByPush, ToggleInput } from '../reusables';
import { Section, Span, Spinner } from '../../reusables';
import styled from 'styled-components';
import { useManageSubscriptionsUtilities, useWidgetData } from '../../../hooks';
import useToast from '../reusables/NewToast';
import { MdCheckCircle, MdError } from 'react-icons/md';
import { ThemeContext } from '../theme/ThemeProvider';

import RangeSlider from '../reusables/sliders/RangeSlider';
import { WidgetErrorCodes } from './types';
import * as PushAPI from '@pushprotocol/restapi';

// /**
//  * @interface IThemeProps
//  * this interface is used for defining the props for styled components
//  */
// interface IThemeProps {
// }

interface ISettingsComponentProps {
  //remove optional here
  channelSettings?: PushAPI.UserSetting[];
}
export const SettingsComponent: React.FC<ISettingsComponentProps> = (
  options: ISettingsComponentProps
) => {
  const {
    channelSettings = [
      {
        type: 1, // Boolean type
        default: 1,
        description: 'Receive marketing notifications',
      },
      {
        type: 2, // Slider type
        default: 10,
        description: 'Notify when loan health breaches',
        data: { upper: 100, lower: 5, ticker: 1 },
      },
    ],
  } = options || {};

  return (
    <Section flexDirection="column" gap="20px" width='100%'>
      {channelSettings.map((setting) => (
        <>
          <ToggleInput labelHeading='Boolean Setting' checked={true} onToggle={undefined} />
        </>
      ))}
    </Section>
  );
};
