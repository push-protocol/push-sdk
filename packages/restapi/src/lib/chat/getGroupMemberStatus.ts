import { convertToValidDID, getAPIBaseUrls } from '../helpers';
import Constants, { ENV } from '../constants';
import { GroupMemberStatus } from '../types';
import { axiosGet } from '../utils/axiosUtil';
import { handleError } from '../errors/validationError';

/**
 * GET /v1/chat/groups/:chatId/access/:did
 */

export interface GetGroupMemberStatusType {
  chatId: string;
  did: string; // Decentralized Identifier
  env?: ENV;
  chainId?: string;
}

export const getGroupMemberStatus = async (
  options: GetGroupMemberStatusType
): Promise<GroupMemberStatus> => {
  // Replace "any" with the actual response type
  const { chatId, did, env = Constants.ENV.PROD } = options || {};
  try {
    if (chatId == null || chatId.length === 0) {
      throw new Error(`chatId cannot be null or empty`);
    }

    if (did == null || did.length === 0) {
      throw new Error(`did cannot be null or empty`);
    }

    const user = await convertToValidDID(did, env, options.chainId);

    const API_BASE_URL = getAPIBaseUrls(env);
    const requestUrl = `${API_BASE_URL}/v1/chat/groups/${chatId}/members/${user}/status`;

    const response = await axiosGet<GroupMemberStatus>(requestUrl);
    return response.data;
  } catch (err) {
    throw handleError(err, getGroupMemberStatus.name);
  }
};
