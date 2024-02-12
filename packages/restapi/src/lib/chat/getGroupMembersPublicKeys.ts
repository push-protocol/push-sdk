import axios from 'axios';
import { getAPIBaseUrls } from '../helpers';
import Constants, { ENV } from '../constants';
import { ChatMemberCounts, ChatMemberProfile } from '../types';
import { FetchChatGroupInfoType } from './getGroupMembers';
import { handleError } from '../errors/ValidationError';

/**
 * GET /v1/chat/:chatId/members/public/keys
 */

export const getGroupMembersPublicKeys = async (
  options: FetchChatGroupInfoType
): Promise<{ members: [{ did: string; publicKey: string }] }> => {
  const { chatId, page = 1, limit = 20, env = Constants.ENV.PROD } = options;

  try {
    if (!chatId) {
      throw new Error('Chat ID is required.');
    }

    const API_BASE_URL = getAPIBaseUrls(env);
    const requestUrl = `${API_BASE_URL}/v1/chat/groups/${chatId}/members/publicKeys?pageNumber=${page}&pageSize=${limit}`;

    const response = await axios.get(requestUrl);
    return response.data;
  } catch (error) {
    throw handleError(error, getGroupMembersPublicKeys.name);
  }
};
