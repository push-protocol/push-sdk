/**
 * @file ThemeProvider.tsx: This acts as the custom theme provider for the entire app.
 */
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import { Theme, lightTheme, darkTheme } from './index';

/**
 * @param theme optional: light or dark theme. defaults to light
 * @param customTheme optional: custom colors/theme
 * @param children children to be wrapped with ThemeProvider
 */
export interface IThemeProviderProps {
    theme?: 'light' | 'dark';
    customTheme?: Partial<Theme>; // Optional custom theme
    children: any;
}

const getTheme = (theme: string | undefined): Theme => {
if (theme === 'light') {
    return lightTheme;
} else if (theme === 'dark') {
    return darkTheme;
} else {
    return lightTheme;
}
};

export const ThemeProvider = ({ theme, customTheme, children }: IThemeProviderProps) => {
    const selectedTheme = getTheme(theme);

    /**
     * Merge the custom theme with the selected theme
     * Tihs allows SDK users and developers to override certain colors
     * according to their app's design system,
     * while keeping the existing light/dark theme colors
     */
    let mergedTheme;

    if(customTheme) {
        mergedTheme = Object.assign({}, selectedTheme, { customTheme });
    } else {
        mergedTheme = theme;
    }

    return (
        <StyledThemeProvider theme={mergedTheme}>
            { children }
        </StyledThemeProvider>
    );
};
