import axios from 'axios';
import { getAPIBaseUrls } from '../helpers';
import Constants, { ENV } from '../constants';
import { ChatMemberCounts } from '../types';

/**
 * GET /v1/chat/:chatId/members/count
 */

export interface FetchChatMemberCountType {
  chatId: string;
  env?: ENV;
}

export const getGroupMemberCount = async (
  options: FetchChatMemberCountType
): Promise<ChatMemberCounts> => {
  const { chatId, env = Constants.ENV.PROD } = options;

  try {
    if (!chatId) {
      throw new Error('Chat ID is required.');
    }

    const API_BASE_URL = getAPIBaseUrls(env);
    const requestUrl = `${API_BASE_URL}/v1/chat/groups/${chatId}/members/count`;

    const response = await axios.get(requestUrl);
    const { totalMembersCount } = response.data;

    return totalMembersCount;
  } catch (error) {
    console.error(
      `[Push SDK] - API - Error - API ${getGroupMemberCount.name} -: `,
      error
    );
    throw new Error(
      `[Push SDK] - API - Error - API ${getGroupMemberCount.name} -: ${error}`
    );
  }
};
