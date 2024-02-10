import { NotificationSettingType, UserSetting } from "@pushprotocol/restapi";

const isSettingType1 = (setting: NotificationSettingType) => setting.type === 1;

export const notifUserSettingFormatString = ({ settings }: { settings: NotificationSettingType[] }) => {
    const _notifSettings:UserSetting[] = [];
    settings && settings.forEach((setting) => 
        isSettingType1(setting) 
            ? _notifSettings.push({ enabled: setting?.userPreferance?.enabled }) 
            : _notifSettings.push({ value: setting?.userPreferance?.value, enabled:setting?.userPreferance?.enabled }));
    return _notifSettings;
}