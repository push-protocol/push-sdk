import axios from 'axios';
import {
    getAPIBaseUrls,
} from '../helpers';
import Constants from '../constants';
import { Message } from '../types';

/**
 *  GET '/v1/w2w/users/:did/requests
 */

export type ChatOptionsType = {
    user: string; // caip10
    env?: string;
}

export const requests = async (
    options: ChatOptionsType
): Promise<Message[]> => {
    const {
        user,
        env = Constants.ENV.PROD,
    } = options || {};
    const API_BASE_URL = getAPIBaseUrls(env);
    const apiEndpoint = `${API_BASE_URL}/v1/w2w/users/${user}/requests`;
    const requestUrl = `${apiEndpoint}`;
    try {
        const response = await axios.get(requestUrl)
        const requests: Message[] = JSON.parse(response.data);
        return requests;
    } catch (err) {
        console.error(`[EPNS-SDK] - API ${requestUrl}: `, err);
        throw Error(`[EPNS-SDK] - API ${requestUrl}: ${err}`);
    }
}
