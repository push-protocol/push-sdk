/**
 * @file App.tsx is an example component to explain
 * the usage of the ThemeProvider
 */

import ThemeProvider from './theme/ThemeProvider';
import { SpaceBanner } from './SpaceBanner/index';

const customTheme = {
    colors: {
        primary: '#FF00FF', // Custom primary color
        secondary: '#00FFFF', // Custom secondary color
        bannerBg: '#ff0000', // custom banner background provided by SDK user
    },
};

const App = () => (
    <ThemeProvider theme="light" customTheme={customTheme}>
        <div>
            <SpaceBanner>Welcome to Push Spaces</SpaceBanner>
        </div>
    </ThemeProvider>
);

export default App;
