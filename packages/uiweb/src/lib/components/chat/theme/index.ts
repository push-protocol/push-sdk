/**
 * @file theme file: all the predefined themes are defined here
 */
import { CHAT_THEME_OPTIONS } from '../exportedTypes';

//theme type
interface IBorder {
  chatViewComponent?: string;
  chatProfile?: string;
  messageInput?: string;
  searchInput?:string;
  modal?:string;
  modalInnerComponents?:string;
}
interface IBorderRadius {
  chatViewComponent?: string;
  chatProfile?: string;
  messageInput?: string;
  searchInput?:string;
  modal?:string;
  modalInnerComponents?:string;
}
interface IBackgroundColor {
  chatViewComponentBackground?: string;
  chatProfileBackground?: string;
  messageInputBackground?: string;
  chatSentBubbleBackground?: string;
  chatReceivedBubbleBackground?: string;
  encryptionMessageBackground?: string;
  buttonBackground?: string;
  buttonDisableBackground?: string;
  searchInputBackground?:string;
  modalBackground?:string;
  modalInputBackground?:string;
  modalHoverBackground?:string;
  toastSuccessBackground?: string;
  toastErrorBackground?: string;
  toastShadowBackground?: string;
}

interface ITextColor {
  chatProfileText?: string;
  messageInputText?: string;
  chatSentBubbleText?: string;
  chatReceivedBubbleText?: string;
  timestamp?: string;
  encryptionMessageText?: string;
  buttonText?: string;
  buttonDisableText?: string;
  chatReceivedBubbleAddressText?: string;
  chatReceivedBubbleTimestampText?: string;
  chatSentBubbleTimestampText?: string;
  searchInputText?:string;
  searchPlaceholderText?:string;
  modalHeadingText?:string;
  modalSubHeadingText?:string;
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
  searchInputText?:string;
  searchPlaceholderText?:string;
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
  searchInputText?:string;
  searchPlaceholderText?:string;
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

  spinnerColor?: string;
  
}

//dark theme object
export const lightChatTheme: IChatTheme = {
  borderRadius: {
    chatViewComponent: '24px',
    chatProfile: '32px',
    messageInput: '13px',
    searchInput: '99px',
    modal: '16px',
    modalInnerComponents:'12px'
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
    searchInputBackground: 'rgb(244, 245, 250)',
    modalBackground:'#fff',
    modalInputBackground:'transparent',
    modalHoverBackground:'rgb(244, 245, 250)',
    buttonDisableBackground:'#DFDEE9',
    toastSuccessBackground:
    'linear-gradient(90.15deg, #30CC8B -125.65%, #30CC8B -125.63%, #F3FFF9 42.81%)',
  toastErrorBackground:
    'linear-gradient(90.15deg, #FF2070 -125.65%, #FF2D79 -125.63%, #FFF9FB 42.81%)',
  toastShadowBackground: '#ccc',
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
    searchInputText:'16px',
    searchPlaceholderText:'16px'
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
    searchInputText:'400',
    searchPlaceholderText:'400'
  },

  fontFamily: 'inherit',

  border: {
    chatViewComponent: 'none',
    chatProfile: 'none',
    messageInput: 'none',
    searchInput:'1px solid transparent',
    modal:'none',
    modalInnerComponents:'1px solid rgb(194, 203, 219)'
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
    buttonDisableText:'#AFB3BF',
    chatReceivedBubbleAddressText: '#000',
    chatReceivedBubbleTimestampText: '#000',
    chatSentBubbleTimestampText: '#fff',
    searchInputText:'#000',
    searchPlaceholderText:'rgb(101, 119, 149)',
    modalHeadingText:'#000',
    modalSubHeadingText:'rgb(101, 119, 149)',
  },
  backdropFilter: 'none',
  spinnerColor: 'rgb(202, 89, 155)',
  scrollbarColor: 'rgb(202, 89, 155)',
};

export const darkChatTheme: IChatTheme = {
  borderRadius: {
    chatViewComponent: '24px',
    chatProfile: '32px',
    messageInput: '13px',
    searchInput: '99px',
    modal: '16px',
    modalInnerComponents:'12px'
  },

  backgroundColor: {
    chatViewComponentBackground: 'rgb(40, 42, 46);',
    chatProfileBackground: 'rgb(64, 70, 80);',
    messageInputBackground: 'rgb(64, 70, 80);',
    chatSentBubbleBackground: 'rgb(202, 89, 155)',
    chatReceivedBubbleBackground: 'rgb(64, 70, 80);',
    encryptionMessageBackground: 'rgb(64, 70, 80);',
    buttonBackground: 'rgb(202, 89, 155)',
    modalBackground:'rgb(47, 49, 55)',
    modalInputBackground:'transparent',
    modalHoverBackground:'rgb(64, 70, 80)',
    buttonDisableBackground:'#787E99',
    toastSuccessBackground:
    'linear-gradient(90.15deg, #30CC8B -125.65%, #30CC8B -125.63%, #2F3137 42.81%)',
  toastErrorBackground:
    'linear-gradient(89.96deg, #FF2070 -101.85%, #2F3137 51.33%)',
  toastShadowBackground: '#00000010',
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
    searchInputText:'16px',
    searchPlaceholderText:'16px'
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
    searchInputText:'400',
    searchPlaceholderText:'400'
  },

  fontFamily: 'inherit',

  border: {
    chatViewComponent: 'none',
    chatProfile: 'none',
    messageInput: 'none',
    searchInput:'1px solid transparent',
    modal:'none',
    modalInnerComponents:'1px solid rgb(74, 79, 103)'
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
    searchInputText:'#fff',
    searchPlaceholderText:'rgb(101, 119, 149)',
    modalHeadingText:'#fff',
    modalSubHeadingText:'rgb(182, 188, 214)',
    buttonDisableText:'#B6BCD6'
  },
  backdropFilter: 'none',
  spinnerColor: 'rgb(202, 89, 155)',
  scrollbarColor: 'rgb(202, 89, 155)',

};
