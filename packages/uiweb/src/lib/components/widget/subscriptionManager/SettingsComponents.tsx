import React, { useContext, useState } from 'react';
import { ToggleInput } from '../reusables';
import { Section } from '../../reusables';

import * as PushAPI from '@pushprotocol/restapi';
import InputSlider from '../reusables/sliders/InputSlider';
import styled from 'styled-components';
import { ThemeContext } from '../theme/ThemeProvider';
import { IWidgetTheme } from '../theme';
import RangeSlider from '../reusables/sliders/RangeSlider';

/**
 * @interface IThemeProps
 * this interface is used for defining the props for styled components
 */
interface IThemeProps {
  theme: IWidgetTheme;
}

interface ISettingsComponentProps {
  settings: PushAPI.NotificationSettingType[];
  setSettings: React.Dispatch<
    React.SetStateAction<PushAPI.NotificationSettingType[] | null>
  >;
}
export const SettingsComponent: React.FC<ISettingsComponentProps> = (
  options: ISettingsComponentProps
) => {
  const theme = useContext(ThemeContext);

  const { settings = [], setSettings } = options || {};
  const handleSliderChange = (
    index: number,
    value: number | { lower: number; upper: number }
  ) => {
    const updatedSettings = [...settings];

    updatedSettings[index].userPreferance!.value = value;
    setSettings(updatedSettings);
  };

  const handleToggleChange = (index: number) => {
    const updatedSettings = [...settings];
    if(updatedSettings[index]?.userPreferance)
    updatedSettings[index].userPreferance!.enabled =
      !updatedSettings[index].userPreferance!.enabled;
    setSettings(updatedSettings);
  };
  return (
    <ScrollSection
      theme={theme}
      flexDirection="column"
      gap="15px"
      width="100%"
      maxHeight="200px"
      justifyContent='start'
      overflow="hidden scroll"
    >
      {settings.map(
        (setting: PushAPI.NotificationSettingType, index: number) => (
          <SettingsSection
            theme={theme}
            flexDirection="column"
            key={index}
            divider={setting.type == 2 || setting.type == 1}
          >
            {(setting.type == 2 || setting.type == 1) && (
              <ToggleInput
                id={`toggle${setting.type}${index}`}
                labelHeading={`${
                  setting.type == 1 ? 'Boolean' : 'Range'
                } Setting`}
                checked={setting?.userPreferance?.enabled || false}
                onToggle={() => {
                  handleToggleChange(index);
                }}
              />
            )}
       

            {setting.type == 2 && setting?.userPreferance?.enabled && (
              <InputSlider
                val={setting?.userPreferance?.value as number}
                max={setting?.data?.upper || 0}
                min={setting?.data?.lower || 0}
                step={setting?.data?.ticker || 1}
                preview={true}
                defaultVal={setting?.userPreferance?.value as number}
                onChange={({ x }) => handleSliderChange(index, x)}
              />
            )}
            {/* {setting.type == 3 && setting?.userPreferance?.enabled && (
              <RangeSlider
                startVal={(setting?.userPreferance?.value as {upper:number,lower:number})?.lower|| 0}
                endVal={setting?.userPreferance?.value?.upper || 0}
                max={setting?.data?.upper || 0}
                min={setting?.data?.upper || 0}
                step={setting?.data?.ticker || 1}
                defaultStartVal={setting?.data?.lower || 0}
                defaultEndVal={setting?.data?.upper || 0}
                onChange={({ startVal, endVal }) =>
                  handleSliderChange(index, { lower: startVal, upper: endVal })
                }
              />
            )} */}
          </SettingsSection>
        )
      )}
    </ScrollSection>
  );
};

const SettingsSection = styled(Section)<IThemeProps & { divider: boolean }>`
  border-bottom: ${(props) =>
    props.divider ? props.theme.border?.divider : 'none'};
  padding-bottom: 15px;
`;
const ScrollSection = styled(Section)<{ theme: IWidgetTheme }>`
  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.scrollbarColor};
    border-radius: 10px;
  }
  &::-webkit-scrollbar-button {
    height: 40px;
  }

  &::-webkit-scrollbar {
    width: 4px;
  }
`;
