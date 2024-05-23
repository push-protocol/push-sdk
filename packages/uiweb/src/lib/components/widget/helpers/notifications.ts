import { NotificationSettingType, UserSetting } from '@pushprotocol/restapi';

const isSettingType1 = (setting: NotificationSettingType) => setting.type === 1;

export const notifUserSettingFormatString = ({ settings }: { settings: NotificationSettingType[] }) => {
  const _notifSettings: UserSetting[] = [];
  settings &&
    settings.length &&
    settings.forEach((setting) =>
      isSettingType1(setting)
        ? _notifSettings.push({
            enabled: setting?.userPreferance?.enabled || false,
          })
        : _notifSettings.push({
            value: setting?.userPreferance?.value,
            enabled: setting?.userPreferance?.enabled || false,
          })
    );
  return _notifSettings;
};
export const notifStrictUserSettingFromat = ({ settings }: { settings: NotificationSettingType[] }) => {
  const _notifSettings: NotificationSettingType[] = [];

  settings &&
    settings.length &&
    settings.forEach((setting) =>
      isSettingType1(setting)
        ? _notifSettings.push({
            ...setting,
            userPreferance: setting?.userPreferance ?? { value: 0, enabled: false },
          })
        : _notifSettings.push({
            ...setting,
            userPreferance: setting?.userPreferance ?? {
              value: setting.default || 0,
              enabled: false,
            },
          })
    );
  return _notifSettings;
};

export const notifUserSettingFromChannelSetting = ({ settings }: { settings: any[] }) => {
  const _userSettings: NotificationSettingType[] = [];
  settings &&
    settings.length &&
    settings.forEach((setting) =>
      isSettingType1(setting)
        ? _userSettings.push({
            ...setting,
            userPreferance: {
              value: undefined,
              enabled: setting.default,
            },
          })
        : _userSettings.push({
            ...setting,
            userPreferance: {
              value: setting.default,
              enabled: setting.enabled,
            },
            data: {
              upper: setting.upperLimit,
              lower: setting.lowerLimit,
              ticker: setting.ticker,
            },
          })
    );
  return _userSettings;
};
