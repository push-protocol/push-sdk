import { NotificationSettingType } from '../types/index';

export const parseSettings = (settings: string): NotificationSettingType[] => {
  let settingsObj;
  try {
    settingsObj = JSON.parse(settings);
  } catch (error) {
    settingsObj = settings;
  }
  let parsedSettings: NotificationSettingType[] = []
  for(let i = 0; i< settingsObj.length; i++){
    let setting = settingsObj[i];
    if(setting.type == 1){
        parsedSettings.push({
            type: setting.type,
            description: setting.description,
            userPreferance: {
                value: setting.user,
                enabled: setting.user
            }
        })
    }
    else if(setting.type == 2){
        parsedSettings.push({
            type: setting.type,
            description: setting.description,
            data: {
                upper: setting.upperLimit,
                lower: setting.lowerLimit,
                ticker: setting.ticker?? 1
            },
            userPreferance: {
                value: setting.user,
                enabled: setting.enabled
            }
        })
    } else if (setting.type == 3){
        parsedSettings.push({
            type: setting.type,
            description: setting.description,
            data: {
                upper: setting.upperLimit,
                lower: setting.lowerLimit,
                ticker: setting.ticker?? 1
            },
            userPreferance: {
                value: setting.user,
                enabled: setting.enabled
            }
        })
    }
  }

  return parsedSettings
};
