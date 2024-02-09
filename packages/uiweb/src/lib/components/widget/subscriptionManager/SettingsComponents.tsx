import React, { useContext, useState } from 'react';
import { ToggleInput } from '../reusables';
import { Section } from '../../reusables';

import * as PushAPI from '@pushprotocol/restapi';
import InputSlider from '../reusables/sliders/InputSlider';
import styled from 'styled-components';
import { ThemeContext } from '../theme/ThemeProvider';
import { IWidgetTheme } from '../theme';

/**
 * @interface IThemeProps
 * this interface is used for defining the props for styled components
 */
interface IThemeProps {
  theme: IWidgetTheme;
}

interface ISettingsComponentProps {
  //remove optional here
  settings: PushAPI.NotificationSettingType[];
  setSettings: React.Dispatch<
    React.SetStateAction<PushAPI.NotificationSettingType[]>
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
    console.log(value);
    updatedSettings[index].userPreferance.value = value;
    setSettings(updatedSettings);
  };

  const handleToggleChange = (index: number, setting: any) => {
    const updatedSettings = [...settings];
    console.log(updatedSettings[index], index, setting);
    updatedSettings[index].userPreferance.enabled =
      !updatedSettings[index].userPreferance.enabled;

    setSettings(updatedSettings);
  };
  console.log(settings);
  return (
    <Section flexDirection="column" gap="15px" width="100%">
      {settings.map(
        (setting: PushAPI.NotificationSettingType, index: number) => (
          <SettingsSection
            theme={theme}
            flexDirection="column"
            key={index}
     
            divider={(setting.type == 2 || setting.type == 1)}
          >
            {(setting.type == 2 || setting.type == 1) && (
              <ToggleInput
                labelHeading={`${
                  setting.type == 1 ? 'Boolean' : 'Range'
                } Setting`}
                checked={setting?.userPreferance?.enabled || false}
                onToggle={() => handleToggleChange(index, setting)}
              />
            )}

            {setting.type == 2 && setting?.userPreferance?.enabled && (
              <InputSlider
                val={setting?.userPreferance?.value as number}
                max={setting?.data?.upper || 0}
                min={setting?.data?.lower || 0}
                step={setting?.data?.ticker || 1}
                preview={true}
                //what is default val
                defaultVal={setting?.userPreferance?.value as number}
                onChange={({ x }) => handleSliderChange(index, x)}
              />
            )}
          </SettingsSection>
        )
      )}
    </Section>
  );
};

const SettingsSection = styled(Section)<IThemeProps & { divider: boolean }>`
  border-bottom: ${(props) => props.divider? props.theme.border?.divider:'none'};
  padding-bottom: 15px;
`;
