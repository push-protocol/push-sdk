const path = require('path');

const reactnativesdkPath = path.resolve(__dirname, '../../reactnative');
const uireactnativePath = path.resolve(__dirname, '../../uireactnative'); // Path of your local module

const thirdPartyPackages = {
  '@pushprotocol/uireactnative': uireactnativePath,
  '@pushprotocol/react-native-sdk': reactnativesdkPath,
};

const {getDefaultConfig} = require('expo/metro-config');

const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')];
config.resolver.sourceExts = ['jsx', 'js', 'json', 'ts', 'tsx', 'mjs'];
config.resolver.thirdPartyPackages = thirdPartyPackages;
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});
config.watchFolders = [uireactnativePath, reactnativesdkPath];

module.exports = config;
