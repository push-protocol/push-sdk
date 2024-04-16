import { getAPIBaseUrls } from '../helpers';
import Constants, { ENV } from '../constants';
import { axiosGet } from '../utils/axiosUtil';
import { handleError } from '../errors/validationError';
import { getUserDID } from './helpers';

/**
 * Represents the response type for the chat status.
 */
export interface ChatInfoResponse {
  meta: {
    group: boolean;
  };
  list: string;
  participants: string[];
  chatId: string;
  recipient: string;
}

/**
 * Represents the input type for fetching chat status.
 */
export interface GetChatInfoType {
  recipient: string;
  account: string; // Ethereum address or similar
  env?: ENV;
}

/**
 * Fetches the chat status for a given chat ID and address.
 */
export const getChatInfo = async (
  options: GetChatInfoType
): Promise<ChatInfoResponse> => {
  const { recipient, account, env = Constants.ENV.PROD } = options;

  try {
    if (!recipient || !account) {
      throw new Error('receipient and account cannot be null or empty');
    }

    const API_BASE_URL = getAPIBaseUrls(env);
    const requestUrl = `${API_BASE_URL}/v1/chat/${await getUserDID(
      recipient,
      env
    )}/address/${await getUserDID(account, env)}`;
    const response = await axiosGet<ChatInfoResponse>(requestUrl);
    return response.data;
  } catch (err) {
    throw handleError(err, getChatInfo.name);
  }
};
