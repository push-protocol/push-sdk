import axios from 'axios';
import { getAPIBaseUrls } from '../helpers';
import Constants, { ENV } from '../constants';
import { ChatMemberProfile } from '../types';
import { handleError } from '../errors/ValidationError';

/**
 * GET /v1/chat/:chatId/members
 */

export interface FetchChatGroupInfoType {
  chatId: string;
  page?: number;
  limit?: number;
  pending?: boolean;
  role?: string;
  env?: ENV;
}

export const getGroupMembers = async (
  options: FetchChatGroupInfoType
): Promise<ChatMemberProfile[]> => {
  const {
    chatId,
    page = 1,
    limit = 20,
    env = Constants.ENV.PROD,
    pending,
    role,
  } = options;

  try {
    if (!chatId) {
      throw new Error('Chat ID is required.');
    }

    const API_BASE_URL = getAPIBaseUrls(env);
    let requestUrl = `${API_BASE_URL}/v1/chat/groups/${chatId}/members?pageNumber=${page}&pageSize=${limit}`;
    if (pending !== undefined) {
      requestUrl += `&pending=${pending}`;
    }
    if (role) {
      requestUrl += `&role=${encodeURIComponent(role)}`;
    }
    const response = await axios.get(requestUrl);
    return response.data.members;
  } catch (error) {
    throw handleError(error, getGroupMembers.name);
  }
};
