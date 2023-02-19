import axios from 'axios';
import {
    getAPIBaseUrls,
} from '../helpers';
import Constants from '../constants';
import {
    AccountEnvOptionsType, IGroup
} from '../types';


/**
 *  GET /v1/chat/groups/:chatId
 */

export interface GetGroupType extends AccountEnvOptionsType {
    groupName: string,
}

export const getGroupByName = async (
    options: GetGroupType
): Promise<IGroup> => {
    const {
        groupName,
        env = Constants.ENV.PROD,
    } = options || {};

    try {

        if (groupName == null || groupName.length == 0) {
            throw new Error(`groupName cannot be null or empty`);
        }

        const API_BASE_URL = getAPIBaseUrls(env);
        const requestUrl = `${API_BASE_URL}/v1/chat/groups?groupName=${groupName}`;
        return axios
            .get(requestUrl)
            .then((response) => {
                return response.data;
            })
            .catch((err) => {
                console.error(`[EPNS-SDK] - API ${requestUrl}: `, err);
                throw Error(`[EPNS-SDK] - API ${requestUrl}: ${err}`);
            });
    } catch (err) {
        console.error(`[EPNS-SDK] - API  - Error - API send() -:  `, err);
        throw Error(`[EPNS-SDK] - API  - Error - API send() -: ${err}`);
    }
};