/**
 * @file theme file: all the predefined themes are defined here
 */
import styled, { css, keyframes } from 'styled-components';
import { CHAT_THEME_OPTIONS } from '../exportedTypes';
// bgColorPrimary: "#fff",
//   bgColorSecondary: "#D53A94",
//   textColorPrimary: "#1e1e1e",
//   textColorSecondary: "#fff",
//   btnColorPrimary: "#D53A94",
//   btnColorSecondary: "#494D5F",
//   border: "1px solid #E4E8EF", done
//   borderRadius:"24px", done
//   moduleColor:"#fff",
//theme type
interface IBorder {
  chatViewComponent?: string;
  chatProfile?: string;
  messageInput?: string;
  searchInput?: string;
  modal?: string;
  modalInnerComponents?: string;
  chatPreview?: string;
  userProfile?: string;
  chatWidget?: string;
  chatSentBubble?: string;
  chatReceivedBubble?: string;
  reactionsBorder?: string;
  reactionsHoverBorder?: string;
}
interface IBorderRadius {
  chatViewComponent?: string;
  chatProfile?: string;
  messageInput?: string;
  searchInput?: string;
  modal?: string;
  modalInnerComponents?: string;
  chatPreview?: string;
  userProfile?: string;
  chatWidget?: string;
  chatBubbleBorderRadius?: string;
  chatBubbleContentBorderRadius?: string;
  chatBubbleReplyBorderRadius?: string;
  reactionsPickerBorderRadius?: string;
  reactionsBorderRadius?: string;
}

interface IPadding {
  chatPreviewListPadding?: string;
  chatPreviewPadding?: string;
  chatProfilePadding?: string;
  chatViewPadding?: string;
  chatViewListPadding?: string;
  messageInputPadding?: string;
  chatBubbleSenderPadding?: string;
  chatBubbleReceiverPadding?: string;
  chatBubbleContentPadding?: string;
  chatBubbleInnerContentPadding?: string;
  reactionsPickerPadding?: string;
  reactionsPadding?: string;
}

interface IMargin {
  chatPreviewListMargin?: string;
  chatPreviewMargin?: string;
  chatProfileMargin?: string;
  chatViewMargin?: string;
  chatViewListMargin?: string;
  messageInputMargin?: string;
  chatBubbleSenderMargin?: string;
  chatBubbleReceiverMargin?: string;
  chatBubbleContentMargin?: string;
  chatBubbleReplyMargin?: string;
}

interface IBackgroundColor {
  inputBackground?: string;
  inputHoverBackground?: string;
  chatViewComponentBackground?: string;
  chatProfileBackground?: string;
  messageInputBackground?: string;
  chatSentBubbleBackground?: string;
  chatReceivedBubbleBackground?: string;
  chatPreviewSentBubbleBackground?: string;
  chatPreviewSentBorderBubbleBackground?: string;
  chatPreviewRecievedBubbleBackground?: string;
  chatPreviewRecievedBorderBubbleBackground?: string;
  chatActivePreviewBubbleBackground?: string;
  chatActivePreviewBorderBubbleBackground?: string;
  chatPreviewTagBackground?: string;
  chatFrameBackground?: string;
  encryptionMessageBackground?: string;
  buttonBackground?: string;
  buttonHotBackground?: string;
  buttonDisableBackground?: string;
  searchInputBackground?: string;
  modalBackground?: string;
  modalInputBackground?: string;
  modalHoverBackground?: string;
  toastSuccessBackground?: string;
  toastErrorBackground?: string;
  toastWarningBackground?: string;
  toastShadowBackground?: string;
  criteriaLabelBackground?: string;
  chatPreviewBackground?: string;
  chatPreviewSelectedBackground?: string;
  chatPreviewBadgeBackground?: string;
  chatPreviewHoverBackground?: string;
  userProfileBackground?: string;
  chatWidgetModalBackground?: string;
}

interface ITextColor {
  chatProfileText?: string;
  messageInputText?: string;
  chatSentBubbleText?: string;
  chatReceivedBubbleText?: string;
  chatFrameTitleText?: string;
  chatFrameDescriptionText?: string;
  chatFrameURLText?: string;
  timestamp?: string;
  encryptionMessageText?: string;
  buttonText?: string;
  buttonDisableText?: string;
  chatReceivedBubbleAddressText?: string;
  chatReceivedBubbleTimestampText?: string;
  chatSentBubbleTimestampText?: string;
  searchInputText?: string;
  searchPlaceholderText?: string;
  modalHeadingText?: string;
  modalSubHeadingText?: string;
  chatPreviewParticipantText?: string;
  chatPreviewMessageText?: string;
  chatPreviewDateText?: string;
  chatPreviewBadgeText?: string;
  userProfileText?: string;
  chatWidgetModalHeadingText?: string;
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
  searchInputText?: string;
  searchPlaceholderText?: string;
  chatPreviewParticipantText?: string;
  chatPreviewMessageText?: string;
  chatPreviewDateText?: string;
  chatPreviewBadgeText?: string;
  userProfileText?: string;
  chatFrameTitleText?: string;
  chatFrameDescriptionText?: string;
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
  searchInputText?: string;
  searchPlaceholderText?: string;
  chatPreviewParticipantText?: string;
  chatPreviewMessageText?: string;
  chatPreviewDateText?: string;
  chatPreviewBadgeText?: string;
  userProfileText?: string;
  chatFrameTitleText?: string;
}
interface IIconColor {
  emoji?: string;
  attachment?: string;
  sendButton?: string;
  groupSettings?: string;
  userProfileSettings?: string;
  approveRequest?: string;
  rejectRequest?: string;
  blockRequest?: string;
  primaryColor?: string;
  subtleColor?: string;
}
export interface IChatTheme {
  borderRadius?: IBorderRadius;
  padding?: IPadding;
  margin?: IMargin;

  backgroundColor?: IBackgroundColor;

  fontSize?: IFont;

  fontWeight?: IFontWeight;

  fontFamily?: string;

  border?: IBorder;
  iconColor?: IIconColor;
  textColor?: ITextColor;
  backdropFilter?: string;
  scrollbarColor?: string;
  skeletonBG?: any;
  spinnerColor?: string;
}

const lightSkeletonLoading = keyframes`
  0% {
    background-color: hsl(200, 20%, 80%);
  }
  100% {
    background-color: hsl(200, 20%, 95%);
  }
`;

const darkSkeletonLoading = keyframes`
  0% {
    background-color: #575D73;
  }
  100% {
    background-color: #6E748B;
  }
`;

const animation = () =>
  css`
    ${lightSkeletonLoading} 1s linear infinite alternate;
  `;

const darkAnimation = () =>
  css`
    ${darkSkeletonLoading} 1s linear infinite alternate;
  `;

//dark theme object
export const lightChatTheme: IChatTheme = {
  borderRadius: {
    chatViewComponent: '24px',
    chatProfile: '32px',
    messageInput: '13px',
    searchInput: '99px',
    modal: '16px',
    modalInnerComponents: '12px',
    chatPreview: '24px',
    userProfile: '0px',
    chatWidget: '24px',
    chatBubbleBorderRadius: '12px',
    chatBubbleContentBorderRadius: '8px',
    chatBubbleReplyBorderRadius: '12px',
    reactionsPickerBorderRadius: '12px',
    reactionsBorderRadius: '24px',
  },

  padding: {
    chatPreviewListPadding: '0px 6px 0px 0px',
    chatPreviewPadding: '10px 5px',
    chatProfilePadding: '0px',
    chatViewPadding: '0px',
    chatViewListPadding: '0px 6px 0px 0px',
    messageInputPadding: '0px',
    chatBubbleSenderPadding: '0px',
    chatBubbleReceiverPadding: '0px',
    chatBubbleContentPadding: '8px 16px',
    chatBubbleInnerContentPadding: '8px 12px',
    reactionsPickerPadding: '4px',
    reactionsPadding: '4px 8px',
  },

  margin: {
    chatPreviewListMargin: '0px',
    chatPreviewMargin: '2px 0px',
    chatProfileMargin: '10px 10px 2px 10px',
    chatViewMargin: '0px',
    chatViewListMargin: '0px 0px 0px 10px',
    messageInputMargin: '2px 10px 10px 10px',
    chatBubbleSenderMargin: '16px 8px',
    chatBubbleReceiverMargin: '16px 8px',
    chatBubbleContentMargin: '8px',
    chatBubbleReplyMargin: '8px 8px 0px 8px',
  },

  backgroundColor: {
    inputBackground: '#fff',
    inputHoverBackground:
      'linear-gradient(rgb(244, 245, 250), rgb(244, 245, 250)), linear-gradient(to right, rgb(182, 160, 245), rgb(244, 110, 246), rgb(255, 222, 211), rgba(161 159 161, 1))',
    chatViewComponentBackground: 'linear-gradient(179.97deg, #EEF5FF 0.02%, #ECE9FA 123.25%)',
    chatProfileBackground: '#fff',
    messageInputBackground: '#fff',
    chatSentBubbleBackground: 'rgb(202, 89, 155)',
    chatReceivedBubbleBackground: '#fff',
    chatPreviewSentBubbleBackground: 'rgba(255, 255, 255, 0.1)',
    chatPreviewSentBorderBubbleBackground: 'rgba(255, 255, 255, 0.5)',
    chatPreviewRecievedBubbleBackground: 'rgba(0, 0, 0, 0.1)',
    chatPreviewRecievedBorderBubbleBackground: 'rgba(0, 0, 0, 0.5)',
    chatActivePreviewBubbleBackground: '#22222210',
    chatActivePreviewBorderBubbleBackground: '#22222299',
    chatPreviewTagBackground: 'rgba(0, 0, 0, 0.25)',
    chatFrameBackground: '#f5f5f5',
    encryptionMessageBackground: '#fff',
    buttonBackground: 'rgb(202, 89, 155)',
    buttonHotBackground: '#D53A94',
    searchInputBackground: 'rgb(244, 245, 250)',
    modalBackground: '#fff',
    modalInputBackground: 'transparent',
    modalHoverBackground: 'rgb(244, 245, 250)',
    buttonDisableBackground: '#DFDEE9',
    toastSuccessBackground: 'linear-gradient(90.15deg, #30CC8B -125.65%, #30CC8B -125.63%, #F3FFF9 42.81%)',
    toastErrorBackground: 'linear-gradient(90.15deg, #FF2070 -125.65%, #FF2D79 -125.63%, #FFF9FB 42.81%)',
    toastWarningBackground: 'linear-gradient(90.15deg, #FFB800 -125.65%, #FFB800 -125.63%, #FFF9FB 42.81%)',
    toastShadowBackground: '#ccc',
    criteriaLabelBackground: '#657795',
    chatPreviewBackground: '#fff',
    chatPreviewSelectedBackground: '#f5f5f5',
    chatPreviewBadgeBackground: 'rgb(226,8,128)',
    chatPreviewHoverBackground: '#f5f5f5',
    userProfileBackground: '#fff',

    chatWidgetModalBackground: '#fff',
  },

  fontSize: {
    chatProfileText: '17px',
    messageInputText: '16px',
    chatSentBubbleText: '14px',
    chatReceivedBubbleText: '14px',
    timestamp: '12px',
    encryptionMessageText: '13px',
    chatReceivedBubbleAddressText: '12px',
    chatReceivedBubbleTimestampText: '10px',
    chatSentBubbleTimestampText: '10px',
    searchInputText: '16px',
    searchPlaceholderText: '16px',
    chatPreviewParticipantText: '14px',
    chatPreviewMessageText: '14px',
    chatPreviewDateText: '12px',
    chatPreviewBadgeText: '12px',
    userProfileText: '16px',
    chatFrameTitleText: '16px',
    chatFrameDescriptionText: '14px',
  },

  fontWeight: {
    chatProfileText: '500',
    messageInputText: '400',
    chatSentBubbleText: '400',
    chatReceivedBubbleText: '400',
    timestamp: '400',
    encryptionMessageText: '400',
    chatReceivedBubbleAddressText: '500',
    chatReceivedBubbleTimestampText: '400',
    chatSentBubbleTimestampText: '400',
    searchInputText: '400',
    searchPlaceholderText: '400',
    chatPreviewParticipantText: '500',
    chatPreviewMessageText: '400',
    chatPreviewDateText: '400',
    chatPreviewBadgeText: '600',
    userProfileText: '500',
    chatFrameTitleText: '500',
  },

  fontFamily: 'inherit',

  border: {
    chatViewComponent: 'none',
    chatProfile: 'none',
    messageInput: 'none',
    searchInput: '1px solid transparent',
    modal: 'none',
    modalInnerComponents: '1px solid rgb(194, 203, 219)',
    chatPreview: 'none',
    userProfile: 'none',
    chatWidget: '1px solid #E4E8EF',
    chatReceivedBubble: 'none',
    chatSentBubble: 'none',
    reactionsBorder: '1px solid transparent',
    reactionsHoverBorder: '1px solid #DFDFDF',
  },

  iconColor: {
    emoji: 'rgb(101, 119, 149)',
    attachment: 'rgb(101, 119, 149)',
    sendButton: 'rgb(101, 119, 149)',
    groupSettings: 'rgb(101, 119, 149)',
    userProfileSettings: 'rgb(101, 119, 149)',
    approveRequest: '#30CC8B',
    rejectRequest: '#657795',
    primaryColor: '#D53A94',
    subtleColor: '#787E99',
  },

  textColor: {
    chatProfileText: '#000',
    messageInputText: '#000',
    chatSentBubbleText: '#fff',
    chatReceivedBubbleText: '#000',
    chatFrameTitleText: '#000',
    chatFrameDescriptionText: 'rgba(0, 0, 0, 0.5)',
    chatFrameURLText: '#000',
    timestamp: '400',
    encryptionMessageText: '#000',
    buttonText: '#fff',
    buttonDisableText: '#AFB3BF',
    chatReceivedBubbleAddressText: '#000',
    chatReceivedBubbleTimestampText: '#000',
    chatSentBubbleTimestampText: '#fff',
    searchInputText: '#000',
    searchPlaceholderText: 'rgb(101, 119, 149)',
    modalHeadingText: '#000',
    modalSubHeadingText: 'rgb(101, 119, 149)',
    chatPreviewParticipantText: '#000',
    chatPreviewMessageText: '#888',
    chatPreviewDateText: '#888',
    chatPreviewBadgeText: '#fff',
    userProfileText: '#000',
    chatWidgetModalHeadingText: '#000',
  },
  backdropFilter: 'none',
  spinnerColor: 'rgb(202, 89, 155)',
  scrollbarColor: 'rgb(202, 89, 155)',
  skeletonBG: animation,
};

export const darkChatTheme: IChatTheme = {
  borderRadius: {
    chatViewComponent: '24px',
    chatProfile: '32px',
    messageInput: '13px',
    searchInput: '99px',
    modal: '16px',
    modalInnerComponents: '12px',
    chatPreview: '24px',
    userProfile: '0px',
    chatWidget: '24px',
    chatBubbleBorderRadius: '12px',
    chatBubbleContentBorderRadius: '8px',
    chatBubbleReplyBorderRadius: '8px',
    reactionsPickerBorderRadius: '12px',
    reactionsBorderRadius: '24px',
  },

  padding: {
    chatPreviewListPadding: '0px 6px 0px 0px',
    chatPreviewPadding: '10px 5px',
    chatProfilePadding: '0px',
    chatViewPadding: '0px',
    chatViewListPadding: '0px 6px 0px 0px',
    messageInputPadding: '0px',
    chatBubbleSenderPadding: '0px',
    chatBubbleReceiverPadding: '0px',
    chatBubbleContentPadding: '8px 16px',
    chatBubbleInnerContentPadding: '8px 12px',
    reactionsPickerPadding: '4px',
    reactionsPadding: '4px 8px',
  },

  margin: {
    chatPreviewListMargin: '0px',
    chatPreviewMargin: '2px 0px',
    chatProfileMargin: '10px 10px 2px 10px',
    chatViewMargin: '0px',
    chatViewListMargin: '0px 0px 0px 10px',
    messageInputMargin: '2px 10px 10px 10px',
    chatBubbleSenderMargin: '16px 8px',
    chatBubbleReceiverMargin: '16px 8px',
    chatBubbleContentMargin: '8px',
    chatBubbleReplyMargin: '8px',
  },

  backgroundColor: {
    inputBackground: 'rgb(64, 70, 80)',
    inputHoverBackground:
      'linear-gradient(#404650, #404650), linear-gradient(to right, rgba(182, 160, 245, 1), rgba(244, 110, 246, 1), rgba(255, 222, 211, 1), rgba(161 159 161, 1))',
    chatViewComponentBackground: 'rgb(40, 42, 46)',
    chatProfileBackground: 'rgb(64, 70, 80)',
    messageInputBackground: 'rgb(64, 70, 80)',
    chatSentBubbleBackground: 'rgb(202, 89, 155)',
    chatReceivedBubbleBackground: 'rgb(64, 70, 80)',
    chatPreviewSentBubbleBackground: 'rgba(255, 255, 255, 0.1)',
    chatPreviewSentBorderBubbleBackground: 'rgba(255, 255, 255, 0.5)',
    chatPreviewRecievedBubbleBackground: 'rgba(0, 0, 0, 0.1)',
    chatPreviewRecievedBorderBubbleBackground: 'rgba(0, 0, 0, 0.5)',
    chatActivePreviewBubbleBackground: '#ffffff10',
    chatActivePreviewBorderBubbleBackground: '#ffffff99',
    chatPreviewTagBackground: 'rgba(255, 255, 255, 0.25)',
    chatFrameBackground: '#343536',
    encryptionMessageBackground: 'rgb(64, 70, 80)',
    buttonBackground: 'rgb(202, 89, 155)',
    buttonHotBackground: '#D53A94',
    searchInputBackground: 'rgb(64,70,80)',
    modalBackground: '#202124',
    criteriaLabelBackground: '#202124',
    modalInputBackground: 'transparent',
    modalHoverBackground: 'rgb(64, 70, 80)',
    buttonDisableBackground: '#787E99',
    toastSuccessBackground: 'linear-gradient(90.15deg, #30CC8B -125.65%, #30CC8B -125.63%, #2F3137 42.81%)',
    toastErrorBackground: 'linear-gradient(89.96deg, #FF2070 -101.85%, #2F3137 51.33%)',
    toastWarningBackground: 'linear-gradient(90.15deg, #FFB800 -125.65%, #FFB800 -125.63%, #FFF9FB 42.81%)',
    toastShadowBackground: '#00000010',
    chatPreviewBackground: '#202124',
    chatPreviewSelectedBackground: 'rgb(64, 70, 80)',
    chatPreviewBadgeBackground: 'rgb(226,8,128)',
    chatPreviewHoverBackground: 'rgb(64, 70, 80)',
    userProfileBackground: '#202124',
    chatWidgetModalBackground: '#202124',
  },

  fontSize: {
    chatProfileText: '17px',
    messageInputText: '16px',
    chatSentBubbleText: '14px',
    chatReceivedBubbleText: '14px',
    timestamp: '12px',
    encryptionMessageText: '13px',
    chatReceivedBubbleAddressText: '12px',
    chatReceivedBubbleTimestampText: '10px',
    chatSentBubbleTimestampText: '10px',
    searchInputText: '16px',
    searchPlaceholderText: '16px',
    chatPreviewParticipantText: '14px',
    chatPreviewMessageText: '14px',
    chatPreviewDateText: '12px',
    chatPreviewBadgeText: '12px',
    userProfileText: '16px',
    chatFrameTitleText: '16px',
    chatFrameDescriptionText: '14px',
  },

  fontWeight: {
    chatProfileText: '500',
    messageInputText: '400',
    chatSentBubbleText: '400',
    chatReceivedBubbleText: '400',
    timestamp: '400',
    encryptionMessageText: '400',
    chatReceivedBubbleAddressText: '500',
    chatReceivedBubbleTimestampText: '400',
    chatSentBubbleTimestampText: '400',
    searchInputText: '400',
    searchPlaceholderText: '400',
    chatPreviewParticipantText: '500',
    chatPreviewMessageText: '400',
    chatPreviewDateText: '400',
    chatPreviewBadgeText: '600',
    userProfileText: '500',
    chatFrameTitleText: '500',
  },

  fontFamily: 'inherit',

  border: {
    chatViewComponent: 'none',
    chatProfile: 'none',
    messageInput: 'none',
    searchInput: '1px solid transparent',
    modal: 'none',
    modalInnerComponents: '1px solid rgb(74, 79, 103)',
    chatPreview: 'none',
    userProfile: 'none',
    chatReceivedBubble: 'none',
    chatSentBubble: 'none',
    reactionsBorder: '1px solid transparent',
    reactionsHoverBorder: '1px solid #282A2E',
  },

  iconColor: {
    emoji: 'rgba(120, 126, 153, 1)',
    attachment: 'rgba(120, 126, 153, 1)',
    sendButton: 'rgba(120, 126, 153, 1)',
    groupSettings: 'rgba(120, 126, 153, 1)',
    userProfileSettings: 'rgba(120, 126, 153, 1)',
    approveRequest: '#30CC8B',
    rejectRequest: '#657795',
    primaryColor: '#D53A94',
    subtleColor: '#787E99',
  },

  textColor: {
    chatProfileText: 'rgb(182, 188, 214)',
    messageInputText: 'rgb(182, 188, 214)',
    chatSentBubbleText: '#fff',
    chatReceivedBubbleText: 'rgb(182, 188, 214)',
    chatFrameTitleText: 'rgb(182, 188, 214)',
    chatFrameDescriptionText: 'rgba(182, 188, 214, 0.5)',
    chatFrameURLText: 'rgb(182, 188, 214)',
    timestamp: 'rgb(182, 188, 214)',
    encryptionMessageText: 'rgb(182, 188, 214)',
    buttonText: '#fff',
    chatReceivedBubbleAddressText: 'rgb(182, 188, 214)',
    chatReceivedBubbleTimestampText: 'rgb(182, 188, 214)',
    chatSentBubbleTimestampText: '#fff',
    searchInputText: '#fff',
    searchPlaceholderText: 'rgb(101, 119, 149)',
    modalHeadingText: '#fff',
    modalSubHeadingText: 'rgb(182, 188, 214)',
    buttonDisableText: '#B6BCD6',
    chatPreviewParticipantText: '#fff',
    chatPreviewMessageText: '#888',
    chatPreviewDateText: '#888',
    chatPreviewBadgeText: '#fff',
    userProfileText: 'rgb(182, 188, 214)',
    chatWidgetModalHeadingText: '#fff',
  },
  backdropFilter: 'none',
  spinnerColor: 'rgb(202, 89, 155)',
  scrollbarColor: 'rgb(202, 89, 155)',
  skeletonBG: darkAnimation,
};
