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
  dropdownBorderColor: '1px solid rgb(229, 232, 246)'
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
    dropdownBorderColor: '1px solid rgb(74, 79, 103)'
};

