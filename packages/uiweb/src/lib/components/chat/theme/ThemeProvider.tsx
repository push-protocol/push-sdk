/**
 * @file ThemeProvider.tsx: This acts as the custom theme provider for the entire app.
 */
import { createContext } from 'react';

import { CHAT_THEME_OPTIONS, ChatThemeOptions, IChatThemeOverride, lightTheme } from './index';

/**
 * @param theme optional: light or dark theme. defaults to light
 * @param customTheme optional: custom colors/theme
 * @param children children to be wrapped with ThemeProvider
 */
export interface IThemeProviderProps {
    theme?: 'light' | 'dark';
    // themeOverride?: Partial<IChatThemeOverride>;
    children: any;
}

export interface IChatTheme {
    theme?:ChatThemeOptions,
// themeOverride?: Partial<IChatThemeOverride>;
}
const default_theme = {
    theme:CHAT_THEME_OPTIONS.LIGHT,
    // themeOverride:lightTheme
}
export const ThemeContext = createContext<IChatTheme>(default_theme);
