import axios from 'axios';
import {
    getAPIBaseUrls,
} from '../helpers';
import Constants from '../constants';
import {
    AccountEnvOptionsType, GroupDTO
} from '../types';


/**
 *  GET /v1/chat/groups/:chatId
 */

export interface GetGroupByNameType extends AccountEnvOptionsType {
    groupName: string,
}

export const getGroupByName = async (
    options: GetGroupByNameType
): Promise<GroupDTO> => {
    const {
        groupName,
        env = Constants.ENV.PROD,
    } = options || {};
    try {
        if (groupName == null || groupName.length == 0) {
            throw new Error(`Group Name cannot be null or empty`);
        }

        const API_BASE_URL = getAPIBaseUrls(env);
        const requestUrl = `${API_BASE_URL}/v1/chat/groups?groupName=${groupName}`;
        return axios
            .get(requestUrl)
            .then((response) => {
                return response.data;
            })
            .catch((err) => {
                if(err?.response?.data)
                throw new Error(err?.response?.data);
               throw new Error(err);
            });
    } catch (err) {
        console.error(`[EPNS-SDK] - API  - Error - API getGroupByName() -:  `, err);
        throw Error(`[EPNS-SDK] - API  - Error - API getGroupByName() -: ${err}`);
    }
};