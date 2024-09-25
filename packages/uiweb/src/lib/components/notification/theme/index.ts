//theme type
interface IBorderRadius {
  modal?: string;
  optInButton?: string;
}
interface IColor {
  accentBackground?: string;
  channelNameText?: string;
  notificationTitleText?: string;
  notificationContentText?: string;
  timestamp?: string;
  optInButtonText?: string;
  optInButtonBackground?: string;
  contentHoverBackground?: string;
  modalBorder?: string;
}

interface IFont {
  channelNameText?: string;
  notificationTitleText?: string;
  notificationContentText?: string;
  timestamp?: string;
  optInButtonText?: string;
}
interface IFontWeight {
  channelNameText?: number;
  notificationTitleText?: number;
  notificationContentText?: number;
  timestamp?: number;
  optInButtonText?: number;
}
export interface INotificationItemTheme {
  borderRadius?: IBorderRadius;

  color?: IColor;

  fontSize?: IFont;

  fontWeight?: IFontWeight;

  fontFamily?: string;
  modalDivider?: string;
}

//base theme object

export const baseTheme: INotificationItemTheme = {
  borderRadius: {
    modal: '16px',
    optInButton: '3px',
  },
  fontWeight: {
    channelNameText: 500,
    notificationTitleText: 500,
    notificationContentText: 400,
    timestamp: 500,
    optInButtonText: 500,
  },
  fontSize: {
    channelNameText: '14px',
    notificationTitleText: '16px',
    notificationContentText: '14px',
    timestamp: '10px',
    optInButtonText: '12px',
  },
  fontFamily: 'inherit',
};
//light theme object
export const lightTheme: INotificationItemTheme = {
  ...baseTheme,
  color: {
    contentHoverBackground: '#e8eaf680',
    accentBackground: '#fff',
    channelNameText: '#17181B',
    notificationTitleText: '#17181B',
    notificationContentText: '#313338',
    timestamp: '#8C93A0',
    optInButtonText: '#fff',
    optInButtonBackground: '#D548EC',
    modalBorder: '#C4CBD5',
  },
  modalDivider: '1px solid #D9D9D9',
};
//dark theme object
export const darkTheme: INotificationItemTheme = {
  ...baseTheme,
  color: {
    contentHoverBackground: '#404650',
    accentBackground: '#202124',
    channelNameText: '#F5F6F8',
    notificationTitleText: '#F5F6F8',
    notificationContentText: '#C4CBD5',
    timestamp: '#757D8D',
    optInButtonText: '#fff',
    optInButtonBackground: '#D548EC',
    modalBorder: '#484D58',
  },
  modalDivider: '1px solid #4A4F67',
};
//function to return final theme object
export const getCustomTheme = (theme: string | undefined, customTheme: INotificationItemTheme) => {
  return Object.assign({}, theme === 'dark' ? darkTheme : lightTheme, customTheme);
};
