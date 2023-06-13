/**
 * @file theme file: all the predefined themes are defined here
 */

export interface ISpacesTheme {
    primary?: string;
    secondary?: string;
    tertiary?: string;
    bannerBackground1?: string;
    bannerBackground2?: string;
}

export const lightTheme: ISpacesTheme = {
    primary: 'rgba(213, 58, 148, 1)',
    secondary: 'rgba(255, 255, 255, 1)',
    tertiary: 'rgba(249, 235, 243, 1)',
    bannerBackground1: 'linear-gradient(87.17deg, #5C74F2 0%, #9065EC 67.25%, #8D6BEF 100%)',
    bannerBackground2: 'linear-gradient(87.17deg, #B6A0F5 0%, #F46EF7 57.29%, #FF95D5 100%)'
};

export const darkTheme: ISpacesTheme = {
    primary: 'rgba(213, 58, 148, 1)',
    secondary: 'rgba(255, 255, 255, 0)',
    tertiary: 'rgba(64, 70, 80, 1)',
    bannerBackground1: 'linear-gradient(87.17deg, #5C74F2 0%, #9065EC 67.25%, #8D6BEF 100%)',
    bannerBackground2: 'linear-gradient(87.17deg, #B6A0F5 0%, #F46EF7 57.29%, #FF95D5 100%)'
};
