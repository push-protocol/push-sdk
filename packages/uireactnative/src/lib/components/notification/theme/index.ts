import type { TextStyle, ViewStyle } from 'react-native';

interface IBorderRadius {
  modal?: ViewStyle['borderRadius'];
  optInButton?: ViewStyle['borderRadius'];
}

interface IColor {
  accentBackground?: ViewStyle['backgroundColor'];
  contentBackground?: ViewStyle['backgroundColor'];
  channelNameText?: TextStyle['color'];
  notificationTitleText?: TextStyle['color'];
  notificationContentText?: TextStyle['color'];
  timestamp?: TextStyle['color'];
  optInButtonText?: TextStyle['color'];
  optInButtonBackground?: ViewStyle['backgroundColor'];
  modalBorder?: ViewStyle['borderColor'];
}

interface IFont {
  channelNameText?: TextStyle['fontSize'];
  notificationTitleText?: TextStyle['fontSize'];
  notificationContentText?: TextStyle['fontSize'];
  timestamp?: TextStyle['fontSize'];
  optInButtonText?: TextStyle['fontSize'];
}

interface IFontWeight {
  channelNameText?: TextStyle['fontWeight'];
  notificationTitleText?: TextStyle['fontWeight'];
  notificationContentText?: TextStyle['fontWeight'];
  timestamp?: TextStyle['fontWeight'];
  optInButtonText?: TextStyle['fontWeight'];
}

export interface INotificationItemTheme {
  borderRadius?: IBorderRadius;

  color?: IColor;

  fontSize?: IFont;

  fontWeight?: IFontWeight;

  fontFamily?: TextStyle['fontFamily'];

  modalDivider?: ViewStyle;
}

export const baseTheme: INotificationItemTheme = {
  borderRadius: {
    modal: 10,
    optInButton: 3,
  },
  fontWeight: {
    channelNameText: '400',
    notificationTitleText: '400',
    notificationContentText: '400',
    timestamp: '600',
    optInButtonText: '500',
  },
  fontSize: {
    channelNameText: 15,
    notificationTitleText: 22,
    notificationContentText: 16,
    timestamp: 10,
    optInButtonText: 12,
  },
  fontFamily: 'System font',
};

export const lightTheme: INotificationItemTheme = {
  ...baseTheme,
  color: {
    accentBackground: '#fff',
    contentBackground: '#e8eaf680',
    channelNameText: '#333333',
    notificationTitleText: '#333333',
    notificationContentText: '#333333',
    timestamp: '#808080',
    optInButtonText: '#fff',
    optInButtonBackground: 'rgb(226, 8, 128)',
    modalBorder: '#D9D9D9',
  },
  modalDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
  },
};

export const darkTheme: INotificationItemTheme = {
  ...baseTheme,
  color: {
    accentBackground: '#2F3137',
    channelNameText: '#C5CAE9',
    contentBackground: '#404650',
    notificationTitleText: '#C5CAE9',
    notificationContentText: '#C5CAE9',
    timestamp: '#808080',
    optInButtonText: '#fff',
    optInButtonBackground: 'rgb(226, 8, 128)',
    modalBorder: '#4A4F67',
  },
  modalDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#4A4F67',
  },
};

export const getCustomTheme = (
  theme: string | undefined,
  customTheme: INotificationItemTheme | undefined
) => {
  return Object.assign(
    {},
    theme === 'dark' ? darkTheme : lightTheme,
    customTheme
  );
};
