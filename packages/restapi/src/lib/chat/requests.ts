import axios from 'axios';
import {
    getAPIBaseUrls,
} from '../helpers';
import Constants from '../constants';
import { Chat } from '../types';

/**
 *  GET '/v1/w2w/users/:did/requests
 */

export type RequestOptionsType = {
    user: string; // caip10
    env?: string;
}

export const requests = async (
    options: RequestOptionsType
): Promise<Chat[]> => {
    const {
        user,
        env = Constants.ENV.PROD,
    } = options || {};
    const API_BASE_URL = getAPIBaseUrls(env);
    const apiEndpoint = `${API_BASE_URL}/v1/w2w/users/${user}/requests`;
    const requestUrl = `${apiEndpoint}`;
    try {
        const response = await axios.get(requestUrl)
        const requests: Chat[] = JSON.parse(response.data);
        return requests;
    } catch (err) {
        console.error(`[EPNS-SDK] - API ${requestUrl}: `, err);
        throw Error(`[EPNS-SDK] - API ${requestUrl}: ${err}`);
    }
}
