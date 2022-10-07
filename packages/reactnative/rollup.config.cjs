const nrwlConfig = require('@nrwl/react/plugins/bundle-rollup');
const replace = require('@rollup/plugin-replace');

module.exports = (config) => {
  const nxConfig = nrwlConfig(config);

  return {
    ...nxConfig,
    plugins: [
      ...nxConfig.plugins,

    /** 
     * IMAGE path hack for packaged library to be able to read images on 
     * the BUNDLE path instead of the SOURCE path
     */
      replace({
        values: {
          '../../assets/frownface.png': './lib/assets/frownface.png',
          '../../assets/epnsbot.png': './lib/assets/epnsbot.png'
        },
        delimiters: ['', ''],
      })

    ]
  };
}