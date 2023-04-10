import axios from 'axios';
import { getAPIBaseUrls, } from '../helpers';
import Constants, {ENV} from '../constants';
import {
   SpaceDTO 
} from '../types';
import {
  groupDtoToSpaceDto
} from './../chat/helpers';

/**
 *  GET /v1/chat/groups/:chatId
 */

export interface GetSpaceType {
    spaceId: string,
    env?: ENV
}

export const get = async (
    options: GetSpaceType
): Promise<SpaceDTO> => {
    const { spaceId, env = Constants.ENV.PROD } = options || {};
    try {
        if (spaceId == null || spaceId.length == 0) {
            throw new Error(`spaceId cannot be null or empty`);
        }

        const API_BASE_URL = getAPIBaseUrls(env);
        const requestUrl = `${API_BASE_URL}/v1/chat/groups/${spaceId}`;
        return axios
            .get(requestUrl)
            .then((response) => {
                return groupDtoToSpaceDto(response.data);
            })
            .catch((err) => {
                if (err?.response?.data)
                    throw new Error(err?.response?.data);
                throw new Error(err);
            });
    } catch (err) {
        console.error(`[Push SDK] - API  - Error - API ${get.name} -:  `, err);
        throw Error(`[Push SDK] - API  - Error - API ${get.name} -: ${err}`);
    }
};