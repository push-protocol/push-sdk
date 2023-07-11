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
  modalBorder?:string;
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
    modal: '10px',
    optInButton: '3px',
  },
  fontWeight: {
    channelNameText: 400,
    notificationTitleText: 400,
    notificationContentText: 400,
    timestamp: 600,
    optInButtonText: 500,
  },
  fontSize: {
    channelNameText: '15px',
    notificationTitleText: '22px',
    notificationContentText: '16px',
    timestamp: '10px',
    optInButtonText: 'unset',
  },
  fontFamily: 'Strawford, sans-serif',
};
//light theme object
export const lightTheme: INotificationItemTheme = {
    ...baseTheme,
    color:{
        accentBackground: '#fff',
        channelNameText:'#333333',
        notificationTitleText:'#333333',
        notificationContentText:'#333333',
        timestamp:'#808080',
        optInButtonText:'#fff',
        optInButtonBackground:'rgb(226, 8, 128)',
        modalBorder:'#D9D9D9'
    },
    modalDivider:'1px solid #D9D9D9'
};
//dark theme object
export const darkTheme: INotificationItemTheme = {
    ...baseTheme,
    color:{
        accentBackground: '#2F3137',
        channelNameText:'#C5CAE9',
        notificationTitleText:'#C5CAE9',
        notificationContentText:'#C5CAE9',
        timestamp:'#808080',
        optInButtonText:'#fff',
        optInButtonBackground:'rgb(226, 8, 128)',
        modalBorder:'#4A4F67'
    },
    modalDivider:'1px solid #4A4F67'
};
//function to return final theme object
export const getCustomTheme = (theme:string | undefined,customTheme:INotificationItemTheme) => {
  return Object.assign({}, theme==='dark'?darkTheme:lightTheme, customTheme);
}