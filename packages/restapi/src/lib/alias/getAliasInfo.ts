import axios from 'axios';
import {
  getCAIPAddress,
  getAPIBaseUrls
} from '../helpers';
import Constants from '../constants';

/**
 *  GET /v1/alias/{aliasAddressinCAIP}/channel
 */

export type GetAliasInfoOptionsType = {
  alias: string;
  env?: string;
}

// temporary name
export const getAliasInfo = async (
  options : GetAliasInfoOptionsType
) => {
  const {
    alias,
    env = Constants.ENV.PROD,
  } = options || {};

  const _alias = getCAIPAddress(env, alias, 'Alias');
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/alias`;
  const requestUrl = `${apiEndpoint}/${_alias}/channel`;

  return await axios.get(requestUrl)
    .then((response) => response.data)
    .catch((err) => {
      console.error(`[EPNS-SDK] - API ${requestUrl}: `, err);
    });
}
