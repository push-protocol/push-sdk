const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const path = require('path');

const reactnativesdkPath = path.resolve(__dirname, '../../reactnative');
const uireactnativePath = path.resolve(__dirname, '../../uireactnative'); // Path of your local module

const thirdPartyPackages = {
  '@pushprotocol/uireactnative': uireactnativePath,
  '@pushprotocol/react-native-sdk': reactnativesdkPath,
};

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    thirdPartyPackages,
  },
  watchFolders: [uireactnativePath, reactnativesdkPath],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
