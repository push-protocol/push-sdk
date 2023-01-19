import axios from 'axios';
import {
  getCAIPAddress,
  getAPIBaseUrls,
  getCAIPWithChainId
} from '../helpers';
import Constants from '../constants';
import { ALIAS_CHAIN, ALIAS_CHAIN_ID } from '../config';

/**
 *  GET /v1/alias/{aliasAddressinCAIP}/channel
 */

export type GetAliasInfoOptionsType = {
  alias: string;
  aliasChain: ALIAS_CHAIN;
  env?: string;
}

// temporary name
export const getAliasInfo = async (
  options : GetAliasInfoOptionsType
) => {
  const {
    alias,
    aliasChain,
    env = Constants.ENV.PROD,
  } = options || {};

  const aliasChainId:number = ALIAS_CHAIN_ID[aliasChain][env];

  const _alias = getCAIPWithChainId(alias, aliasChainId, 'Alias');
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/alias`;
  const requestUrl = `${apiEndpoint}/${_alias}/channel`;

  return await axios.get(requestUrl)
    .then((response) => response.data)
    .catch((err) => {
      console.error(`[EPNS-SDK] - API ${requestUrl}: `, err);
    });
}
