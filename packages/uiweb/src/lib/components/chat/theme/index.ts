/**
 * @file theme file: all the predefined themes are defined here
 */
import { CHAT_THEME_OPTIONS } from '../exportedTypes';

export interface IChatTheme {
  bgColorPrimary?: string;
  bgColorSecondary?: string;
  textColorPrimary?: string;
  textColorSecondary?: string;
  accentBgColor?: string;
  accentTextColor?: string;
  btnColorPrimary?: string;
  chatBubbleAccentBgColor?:string;
  border?: string;
  borderRadius?: string;
  iconColorPrimary?: string;
  fontFamily?: string;
  chatBubblePrimaryBgColor?: string;
  fileIconColor?: string;
  dropdownBorderColor?: string;
  modalPrimaryTextColor?: string;
  modalSearchBarBorderColor?: string;
  modalSearchBarBackground?: string;
  snapFocusBg?: string;
  groupButtonBackgroundColor?: string;
  groupButtonTextColor?: string;
  modalConfirmButtonBorder?: string;
  groupSearchProfilBackground?: string,
  modalInputBorderColor?: string,
  snackbarBorderText?: string,
  snackbarBorderIcon?: string,
  modalContentBackground?: string,
  modalProfileTextColor?: string,
  toastSuccessBackground?: string;
  toastErrorBackground?: string;
  toastShadowColor?: string;
  toastBorderColor?: string;
  mainBg?: string;
  modalBorderColor?: string;
  modalDescriptionTextColor?: string;
  modalIconColor?: string;
  pendingCardBackground?: string,
  modalHeadingColor?: string;
  defaultBorder?: string;
}

export const lightChatTheme: IChatTheme = {
  bgColorPrimary: '#fff',
  chatBubblePrimaryBgColor: '#fff',
  bgColorSecondary:
    'linear-gradient(179.97deg, #EEF5FF 0.02%, #ECE9FA 123.25%)',
  textColorPrimary: '#000',
  textColorSecondary: 'rgb(101, 119, 149)',
  chatBubbleAccentBgColor: 'rgb(202, 89, 155)',
  accentBgColor: 'rgb(202, 89, 155)',
  accentTextColor: '#fff',
  btnColorPrimary: 'rgb(202, 89, 155)',
  border: 'none',
  borderRadius: '24px',
  iconColorPrimary: 'none',
  fileIconColor: '#000',
  dropdownBorderColor: '1px solid rgb(229, 232, 246)',
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
  toastSuccessBackground: 'linear-gradient(90.15deg, #30CC8B -125.65%, #30CC8B -125.63%, #F3FFF9 42.81%)',
  toastErrorBackground: 'linear-gradient(90.15deg, #FF2070 -125.65%, #FF2D79 -125.63%, #FFF9FB 42.81%)',
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
  chatBubblePrimaryBgColor: '#fff',
  bgColorPrimary: 'rgb(47, 49, 55)',
  bgColorSecondary: 'rgb(40, 42, 46)',
  textColorPrimary: '#fff',
  textColorSecondary: 'rgb(182, 188, 214)',
  chatBubbleAccentBgColor: 'rgb(202, 89, 155)',
  accentBgColor: 'rgb(202, 89, 155)',
  accentTextColor: '#fff',
  btnColorPrimary: 'rgb(202, 89, 155)',
  border: 'none',
  borderRadius: '24px',
  iconColorPrimary:
    'brightness(0) saturate(100%) invert(89%) sepia(8%) saturate(1567%) hue-rotate(191deg) brightness(86%) contrast(93%)',
    dropdownBorderColor: '1px solid rgb(74, 79, 103)',
  fileIconColor: '#fff',
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
  toastSuccessBackground: 'linear-gradient(90.15deg, #30CC8B -125.65%, #30CC8B -125.63%, #2F3137 42.81%)',
  toastErrorBackground: 'linear-gradient(89.96deg, #FF2070 -101.85%, #2F3137 51.33%)',
  toastShadowColor: '#00000010',
  toastBorderColor: '#4A4F67',
  mainBg: '#000',
  modalBorderColor: '#4A4F67',
  modalDescriptionTextColor: '#787E99',
  modalIconColor: '#787E99',
  pendingCardBackground: 'rgba(173, 176, 190, 0.08)',
  modalHeadingColor: '#B6BCD6',
  defaultBorder: '#4A4F67'
};

