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
  borderRadius: '32px',
  iconColorPrimary: 'none',
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
};

export const darkChatTheme: IChatTheme = {
  chatBubblePrimaryBgColor: 'fff',
  bgColorPrimary: 'rgb(47, 49, 55)',
  bgColorSecondary: 'rgb(40, 42, 46)',
  textColorPrimary: '#fff',
  textColorSecondary: 'rgb(182, 188, 214)',
  chatBubbleAccentBgColor: 'rgb(202, 89, 155)',
  accentBgColor: 'rgb(202, 89, 155)',
  accentTextColor: '#fff',
  btnColorPrimary: 'rgb(202, 89, 155)',
  border: 'none',
  borderRadius: '32px',
  iconColorPrimary:
    'brightness(0) saturate(100%) invert(89%) sepia(8%) saturate(1567%) hue-rotate(191deg) brightness(86%) contrast(93%)',
    dropdownBorderColor: '1px solid rgb(74, 79, 103)',
  modalPrimaryTextColor: '#B6BCD6',
  modalSearchBarBorderColor: '#4A4F67',
  modalSearchBarBackground: '#282A2E',
  snapFocusBg: '#404650',
  groupButtonBackgroundColor: '#2F3137',
  groupButtonTextColor: '#787E99',
  modalConfirmButtonBorder: '1px solid 787E99',
  groupSearchProfilBackground: '#404650',
  modalInputBorderColor: '#4A4F67',
  snackbarBorderText: '#B6BCD6',
  snackbarBorderIcon:
  'brightness(0) saturate(100%) invert(89%) sepia(8%) saturate(1567%) hue-rotate(191deg) brightness(86%) contrast(93%)',
  modalContentBackground: '#2F3137',
  modalProfileTextColor: '#B6BCD6',
};

