/**
 * @file ThemeProvider.tsx: This acts as the custom theme provider for the entire app.
 */
import { createContext } from 'react';

import { IChatTheme, lightChatTheme } from './index';
export { lightChatTheme, darkChatTheme } from './index';
/**
 * @param theme optional: light or dark theme. defaults to light
 * @param customTheme optional: custom colors/theme
 * @param children children to be wrapped with ThemeProvider
 */
export interface IThemeProviderProps {
    theme?: IChatTheme;
    children: any;
}

export const ThemeContext = createContext<IChatTheme>(lightChatTheme);
