import { getAPIBaseUrls } from '../helpers';
import Constants, {ENV} from '../constants';
import {
 GroupDTO
} from '../types';
import { axiosGet } from '../utils/axiosUtil';


/**
 *  GET /v1/chat/groups/:chatId
 */

export interface GetGroupByNameType {
    groupName: string,
    env?: ENV,
}

export const getGroupByName = async (
    options: GetGroupByNameType
): Promise<GroupDTO> => {
    const { groupName, env = Constants.ENV.PROD } = options || {};
    try {
        console.log("=============================================");
        console.log("NOTICE: The method 'getGroupByName' will be deprecated on January 1st, 2024. Please update your code to remove this.");
        console.log("=============================================");
        if (groupName == null || groupName.length == 0) {
            throw new Error(`Group Name cannot be null or empty`);
        }

        const API_BASE_URL = getAPIBaseUrls(env);
        const requestUrl = `${API_BASE_URL}/v1/chat/groups?groupName=${groupName}`;
        const response = await axiosGet<GroupDTO>(requestUrl);
        return response.data;
    } catch (err) {
        console.error(`[Push SDK] - API  - Error - API ${getGroupByName.name} -:  `, err);
        throw Error(`[Push SDK] - API  - Error - API ${getGroupByName.name} -: ${err}`);
    }
};