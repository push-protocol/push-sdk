/**
 * @file ThemeProvider.tsx: This acts as the custom theme provider for the entire app.
 */
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import { Theme, lightTheme, darkTheme } from './index';

interface ThemeProviderProps {
    theme: 'light' | 'dark';
    customTheme?: Partial<Theme>; // Optional custom theme
    children: any;
}

const getTheme = (theme: string): Theme => {
if (theme === 'light') {
    return lightTheme;
} else if (theme === 'dark') {
    return darkTheme;
} else {
    return lightTheme;
}
};

const ThemeProvider = ({ theme, customTheme, children }: ThemeProviderProps) => {
    const selectedTheme = getTheme(theme);

    /**
     * Merge the custom theme with the selected theme
     * Tihs allows SDK users and developers to override certain colors
     * according to their app's design system,
     * while keeping the existing light/dark theme colors
     */
    const mergedTheme = Object.assign({}, selectedTheme, { customTheme });

    return (
        <StyledThemeProvider theme={mergedTheme}>
            { children }
        </StyledThemeProvider>
    );
};

export default ThemeProvider;
