import CONFIG, { API_BASE_URL, ConfigType } from '../config';

/**
 * This config helper returns the API url as well as the
 * EPNS communicator contract method address
 */
export const getConfig = (
  env: string,
  {
    blockchain,
    networkId
  } : {
    blockchain: string,
    networkId: string
  }
) : ConfigType => {

  const blockchainSelector = `${blockchain}:${networkId}`;
  const configuration = CONFIG[env][blockchainSelector];

  if (!configuration) {
    throw Error(`
      [EPNS-SDK] - cannot determine config for 
        env: ${env},
        blockchain: ${blockchain},
        networkId: ${networkId}
    `)
  }

  return configuration;
};


/**
 * This config helper returns only the API urls
 */
export function getAPIBaseUrls(env: string) {
  if (!env) throw Error('ENV not provided!');
  return API_BASE_URL[env];
}