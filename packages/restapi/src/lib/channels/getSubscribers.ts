import axios from 'axios';
import {
    getCAIPAddress,
    getAPIBaseUrls,
} from '../helpers';
import Constants from '../constants';
import {
    Subscribers
} from '../types';
import { ResourceLimits } from 'worker_threads';


/**
 *  GET /v1/channels/:channelId/:subscribers
 */

export type GetChannelSubscribersOptionsType = {
  channel: string; // plain ETH Format only
  page: number,
  limit: number,
  env?: string
}

export const getSubscribers = async (
    options: GetChannelSubscribersOptionsType
): Promise < Subscribers > => {
    const {
        channel,
        page,
        limit,
        env = Constants.ENV.PROD,
    } = options || {};

    try {
        if (channel == null || channel.length == 0) {
            throw new Error(`channel cannot be null or empty`);
        }
        const _channel = getCAIPAddress(env, channel, 'Channel');
        const API_BASE_URL = getAPIBaseUrls(env);
        const apiEndpoint = `${API_BASE_URL}/v1/channels/${_channel}/subscribers?page=${page}&limit=${limit}`;
        return await axios.get(apiEndpoint)
            .then((response) => response.data)
            .catch((err) => {
                console.error(`[EPNS-SDK] - API ${apiEndpoint}: `, err);
            });
    } catch (err) {
        console.error(`[EPNS-SDK] - API  - Error - API send() -:  `, err);
        throw Error(`[EPNS-SDK] - API  - Error - API send() -: ${err}`);
    }
};