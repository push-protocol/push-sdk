const nrwlConfig = require('@nrwl/react/plugins/webpack.js');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = (config, context) => {
  nrwlConfig(config); // Apply @nrwl/react webpack configurations

  // Add the NodePolyfillPlugin to the plugins array
  config.plugins = [...config.plugins, new NodePolyfillPlugin()];

  // Configure resolve fallbacks
  config.resolve = {
    ...config.resolve,
    fallback: {
      ...(config.resolve.fallback || {}),
      http: require.resolve('stream-http'),
      zlib: require.resolve('browserify-zlib'),
      https: require.resolve('https-browserify'),
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
    },
  };

  return config;
};
