import axios from 'axios';
import { getAPIBaseUrls } from '../helpers';
import Constants from '../constants';
import {
    AccountEnvOptionsType, GroupDTO
} from '../types';


/**
 *  GET /v1/chat/groups/:chatId
 */

export interface GetGroupType extends AccountEnvOptionsType {
    chatId: string,
}

export const getGroup = async (
    options: GetGroupType
): Promise<GroupDTO> => {
    const {
        chatId,
        env = Constants.ENV.PROD,
    } = options || {};

    try {

        if (chatId == null || chatId.length == 0) {
            throw new Error(`chatId cannot be null or empty`);
        }

        const API_BASE_URL = getAPIBaseUrls(env);
        const requestUrl = `${API_BASE_URL}/v1/chat/groups/${chatId}`;
        return axios
            .get(requestUrl)
            .then((response) => {
                return response.data;
            })
            .catch((err) => {
                if (err?.response?.data)
                    throw new Error(err?.response?.data);
                throw new Error(err);
            });
    } catch (err) {
        console.error(`[EPNS-SDK] - API  - Error - API send() -:  `, err);
        throw Error(`[EPNS-SDK] - API  - Error - API send() -: ${err}`);
    }
};