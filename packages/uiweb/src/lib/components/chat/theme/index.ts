/**
 * @file theme file: all the predefined themes are defined here
 */
import { CHAT_THEME_OPTIONS } from '../exportedTypes';

//theme type
interface IBorder {
  chatViewComponent?: string;
  chatProfile?: string;
  messageInput?: string;
}
interface IBorderRadius {
  chatViewComponent?: string;
  chatProfile?: string;
  messageInput?: string;
}
interface IBackgroundColor {
  chatViewComponentBackground?: string;
  chatProfileBackground?: string;
  messageInputBackground?: string;
  chatSentBubbleBackground?: string;
  chatReceivedBubbleBackground?: string;
  encryptionMessageBackground?: string;
  buttonBackground?: string;
}

interface ITextColor {
  chatProfileText?: string;
  messageInputText?: string;
  chatSentBubbleText?: string;
  chatReceivedBubbleText?: string;
  timestamp?: string;
  encryptionMessageText?: string;
  buttonText?: string;
  chatReceivedBubbleAddressText?: string;
  chatReceivedBubbleTimestampText?: string;
  chatSentBubbleTimestampText?: string;
}
interface IFont {
  chatProfileText?: string;
  messageInputText?: string;
  chatSentBubbleText?: string;
  chatReceivedBubbleText?: string;
  timestamp?: string;
  encryptionMessageText?: string;
  chatReceivedBubbleAddressText?: string;
  chatReceivedBubbleTimestampText?: string;
  chatSentBubbleTimestampText?: string;
}
interface IFontWeight {
  chatProfileText?: string;
  messageInputText?: string;
  chatSentBubbleText?: string;
  chatReceivedBubbleText?: string;
  timestamp?: string;
  encryptionMessageText?: string;
  chatReceivedBubbleAddressText?: string;
  chatReceivedBubbleTimestampText?: string;
  chatSentBubbleTimestampText?: string;
}
interface IIconColor {
  emoji?: string;
  attachment?: string;
  sendButton?: string;
  groupSettings?: string;
}
export interface IChatTheme {
  borderRadius?: IBorderRadius;

  backgroundColor?: IBackgroundColor;

  fontSize?: IFont;

  fontWeight?: IFontWeight;

  fontFamily?: string;

  border?: IBorder;
  iconColor?: IIconColor;
  textColor?: ITextColor;
  backdropFilter?: string;
  scrollbarColor?: string;

  //below needs to be categorised
  spinnerColor?: string;
  modalBackgroundColor?:string;
  modalPrimaryTextColor?: string;
  modalSearchBarBorderColor?: string;
  modalSearchBarBackground?: string;
  snapFocusBg?: string;
  groupButtonBackgroundColor?: string;
  groupButtonTextColor?: string;
  modalConfirmButtonBorder?: string;
  groupSearchProfilBackground?: string;
  modalInputBorderColor?: string;
  snackbarBorderText?: string;
  snackbarBorderIcon?: string;
  modalContentBackground?: string;
  modalProfileTextColor?: string;
  toastSuccessBackground?: string;
  toastErrorBackground?: string;
  toastShadowColor?: string;
  toastBorderColor?: string;
  mainBg?: string;
  modalBorderColor?: string;
  modalDescriptionTextColor?: string;
  modalIconColor?: string;
  pendingCardBackground?: string;
  modalHeadingColor?: string;
  defaultBorder?: string;
}

//dark theme object
export const lightChatTheme: IChatTheme = {
  borderRadius: {
    chatViewComponent: '24px',
    chatProfile: '32px',
    messageInput: '13px',
  },

  backgroundColor: {
    chatViewComponentBackground:
      'linear-gradient(179.97deg, #EEF5FF 0.02%, #ECE9FA 123.25%)',
    chatProfileBackground: '#fff',
    messageInputBackground: '#fff',
    chatSentBubbleBackground: 'rgb(202, 89, 155)',
    chatReceivedBubbleBackground: '#fff',
    encryptionMessageBackground: '#fff',
    buttonBackground: 'rgb(202, 89, 155)',
  },

  fontSize: {
    chatProfileText: '17px',
    messageInputText: '16px',
    chatSentBubbleText: '16px',
    chatReceivedBubbleText: '16px',
    timestamp: '12px',
    encryptionMessageText: '13px',
    chatReceivedBubbleAddressText: '16px',
    chatReceivedBubbleTimestampText: '12px',
    chatSentBubbleTimestampText: '12px',
  },

  fontWeight: {
    chatProfileText: '300',
    messageInputText: '400',
    chatSentBubbleText: '400',
    chatReceivedBubbleText: '400',
    timestamp: '400',
    encryptionMessageText: '400',
    chatReceivedBubbleAddressText: '300',
    chatReceivedBubbleTimestampText: '400',
    chatSentBubbleTimestampText: '400',
  },

  fontFamily: 'inherit',

  border: {
    chatViewComponent: 'none',
    chatProfile: 'none',
    messageInput: 'none',
  },

  iconColor: {
    emoji: 'rgb(101, 119, 149)',
    attachment: 'rgb(101, 119, 149)',
    sendButton: 'rgb(101, 119, 149)',
    groupSettings: 'rgb(101, 119, 149)',
  },
  textColor: {
    chatProfileText: '#000',
    messageInputText: '#000',
    chatSentBubbleText: '#fff',
    chatReceivedBubbleText: '#000',
    timestamp: '400',
    encryptionMessageText: '#000',
    buttonText: '#fff',
    chatReceivedBubbleAddressText: '#000',
    chatReceivedBubbleTimestampText: '#000',
    chatSentBubbleTimestampText: '#fff',
  },
  backdropFilter: 'none',
  spinnerColor: 'rgb(202, 89, 155)',
  scrollbarColor: 'rgb(202, 89, 155)',
  //the rest param needs to be included in categories
  modalBackgroundColor:'#fff',
  modalPrimaryTextColor: '#1E1E1E',
  modalSearchBarBorderColor: '#BAC4D6',
  modalSearchBarBackground: '#FFF',
  snapFocusBg: '#F4F5FA',
  groupButtonBackgroundColor: '#ADB0BE',
  groupButtonTextColor: '#FFF',
  modalConfirmButtonBorder: '1px solid #F4DCEA',
  groupSearchProfilBackground: '#F4F5FA',
  modalInputBorderColor: '#C2CBDB',
  snackbarBorderText: '#000',
  snackbarBorderIcon: 'none',
  modalContentBackground: '#FFFFFF',
  modalProfileTextColor: '#1E1E1E',
  toastSuccessBackground:
    'linear-gradient(90.15deg, #30CC8B -125.65%, #30CC8B -125.63%, #F3FFF9 42.81%)',
  toastErrorBackground:
    'linear-gradient(90.15deg, #FF2070 -125.65%, #FF2D79 -125.63%, #FFF9FB 42.81%)',
  toastShadowColor: '#ccc',
  toastBorderColor: '#F4F3FF',
  mainBg: '#fff',
  modalBorderColor: '#E5E8F6',
  modalDescriptionTextColor: '#575D73',
  modalIconColor: '#657795',
  pendingCardBackground: 'rgba(173, 176, 190, 0.12)',
  modalHeadingColor: '#333333',
  defaultBorder: '#E5E8F6',
};

export const darkChatTheme: IChatTheme = {
  borderRadius: {
    chatViewComponent: '24px',
    chatProfile: '32px',
    messageInput: '13px',
  },

  backgroundColor: {
    chatViewComponentBackground: 'rgb(40, 42, 46);',
    chatProfileBackground: 'rgb(64, 70, 80);',
    messageInputBackground: 'rgb(64, 70, 80);',
    chatSentBubbleBackground: 'rgb(202, 89, 155)',
    chatReceivedBubbleBackground: 'rgb(64, 70, 80);',
    encryptionMessageBackground: 'rgb(64, 70, 80);',
    buttonBackground: 'rgb(202, 89, 155)',
  },

  fontSize: {
    chatProfileText: '17px',
    messageInputText: '16px',
    chatSentBubbleText: '16px',
    chatReceivedBubbleText: '16px',
    timestamp: '12px',
    encryptionMessageText: '13px',
    chatReceivedBubbleAddressText: '16px',
    chatReceivedBubbleTimestampText: '12px',
    chatSentBubbleTimestampText: '12px',
  },

  fontWeight: {
    chatProfileText: '300',
    messageInputText: '400',
    chatSentBubbleText: '400',
    chatReceivedBubbleText: '400',
    timestamp: '400',
    encryptionMessageText: '400',
    chatReceivedBubbleAddressText: '300',
    chatReceivedBubbleTimestampText: '400',
    chatSentBubbleTimestampText: '400',
  },

  fontFamily: 'inherit',

  border: {
    chatViewComponent: 'none',
    chatProfile: 'none',
    messageInput: 'none',
  },

  iconColor: {
    emoji: 'rgba(120, 126, 153, 1)',
    attachment: 'rgba(120, 126, 153, 1)',
    sendButton: 'rgba(120, 126, 153, 1)',
    groupSettings: 'rgba(120, 126, 153, 1)',
  },
  textColor: {
    chatProfileText: 'rgb(182, 188, 214)',
    messageInputText: 'rgb(182, 188, 214)',
    chatSentBubbleText: '#fff',
    chatReceivedBubbleText: 'rgb(182, 188, 214)',
    timestamp: 'rgb(182, 188, 214)',
    encryptionMessageText: 'rgb(182, 188, 214)',
    buttonText: '#fff',
    chatReceivedBubbleAddressText: 'rgb(182, 188, 214)',
    chatReceivedBubbleTimestampText: 'rgb(182, 188, 214)',
    chatSentBubbleTimestampText: '#fff',
  },
  backdropFilter: 'none',
  spinnerColor: 'rgb(202, 89, 155)',
  scrollbarColor: 'rgb(202, 89, 155)',
  //the rest param needs to be included in categories
  modalBackgroundColor:'rgba(47, 49, 55, 1)',
  modalPrimaryTextColor: '#B6BCD6',
  modalSearchBarBorderColor: '#4A4F67',
  modalSearchBarBackground: '#282A2E',
  snapFocusBg: '#404650',
  groupButtonBackgroundColor: '#2F3137',
  groupButtonTextColor: '#787E99',
  modalConfirmButtonBorder: '1px solid #787E99',
  groupSearchProfilBackground: '#404650',
  modalInputBorderColor: '#4A4F67',
  snackbarBorderText: '#B6BCD6',
  snackbarBorderIcon:
    'brightness(0) saturate(100%) invert(89%) sepia(8%) saturate(1567%) hue-rotate(191deg) brightness(86%) contrast(93%)',
  modalContentBackground: '#2F3137',
  modalProfileTextColor: '#B6BCD6',
  toastSuccessBackground:
    'linear-gradient(90.15deg, #30CC8B -125.65%, #30CC8B -125.63%, #2F3137 42.81%)',
  toastErrorBackground:
    'linear-gradient(89.96deg, #FF2070 -101.85%, #2F3137 51.33%)',
  toastShadowColor: '#00000010',
  toastBorderColor: '#4A4F67',
  mainBg: '#000',
  modalBorderColor: '#4A4F67',
  modalDescriptionTextColor: '#787E99',
  modalIconColor: '#787E99',
  pendingCardBackground: 'rgba(173, 176, 190, 0.08)',
  modalHeadingColor: '#B6BCD6',
  defaultBorder: '#4A4F67',
};
