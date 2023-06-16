/**
 * @file theme file: all the predefined themes are defined here
 */

export interface ISpacesTheme {
    primary?: string;
    secondary?: string;
    tertiary?: string;
    bannerBackground1?: string;
    bannerBackground2?: string;
    fontFamily?: string;
}

export const lightTheme: ISpacesTheme = {
    primary: 'rgba(213, 58, 148, 1)',
    secondary: 'rgba(255, 255, 255, 1)',
    tertiary: 'rgba(249, 235, 243, 1)',
    bannerBackground1: 'linear-gradient(87.17deg, #EA4EE4 0%, #D23CDF 0.01%, #8B5CF6 100%)',
    bannerBackground2: '#EDE9FE'
};

export const darkTheme: ISpacesTheme = {
    primary: 'rgba(213, 58, 148, 1)',
    secondary: 'rgba(255, 255, 255, 0)',
    tertiary: 'rgba(64, 70, 80, 1)',
    bannerBackground1: 'linear-gradient(87.17deg, #EA4EE4 0%, #D23CDF 0.01%, #8B5CF6 100%)',
    bannerBackground2: '#EDE9FE'
};
