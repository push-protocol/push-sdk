/**
 * @file theme file: all the predefined themes are defined here
 */

export interface Theme {
    colors: {
        primary: string;
        secondary: string;
        bannerBg?: string;
        // more properties to be added acc to design
    };
}

export const lightTheme: Theme = {
    colors: {
        primary: '#000000',
        secondary: '#FFFFFF',
        bannerBg: '#d400ff' // example property
    },
};

export const darkTheme: Theme = {
    colors: {
        primary: '#FFFFFF',
        secondary: '#000000',
        bannerBg: '#00ff34' // example property
    },
};
