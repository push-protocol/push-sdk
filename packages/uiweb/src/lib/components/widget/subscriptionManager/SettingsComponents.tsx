import React, { useContext, useState } from 'react';
import {  ToggleInput } from '../reusables';
import { Section,  } from '../../reusables';

import * as PushAPI from '@pushprotocol/restapi';
import InputSlider from '../reusables/sliders/InputSlider';

// /**
//  * @interface IThemeProps
//  * this interface is used for defining the props for styled components
//  */
// interface IThemeProps {
// }

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
  const { settings = [], setSettings } = options || {};
  const handleSliderChange = (
    index: number,
    value: number | { lower: number; upper: number }
  ) => {
    const updatedSettings = [...settings];
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
    <Section flexDirection="column" gap="20px" width="100%">
      {settings.map(
        (setting: PushAPI.NotificationSettingType, index: number) => (
          <Section flexDirection="column" key={index}>
      
            <ToggleInput
              labelHeading={`${
                setting.type == 1 ? 'Boolean' : 'Range'
              } Setting`}
              checked={setting?.userPreferance?.enabled || false}
              onToggle={() => handleToggleChange(index, setting)}
            />
    
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
            
          </Section>
        )
      )}
    </Section>
  );
};
