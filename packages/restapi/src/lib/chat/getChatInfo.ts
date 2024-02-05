import { getAPIBaseUrls } from '../helpers';
import Constants, { ENV } from '../constants';
import { axiosGet } from '../utils/axiosUtil';

/**
 * Represents the response type for the chat status.
 */
export interface ChatInfoResponse {
  meta: {
    group: boolean;
  };
  list: string;
}

/**
 * Represents the input type for fetching chat status.
 */
export interface GetChatInfoType {
  chatId: string;
  address: string; // Ethereum address or similar
  env?: ENV;
}

/**
 * Fetches the chat status for a given chat ID and address.
 */
export const getChatInfo = async (
  options: GetChatInfoType
): Promise<ChatInfoResponse> => {
  const { chatId, address, env = Constants.ENV.PROD } = options;

  try {
    if (!chatId || !address) {
      throw new Error('chatId and address cannot be null or empty');
    }

    const API_BASE_URL = getAPIBaseUrls(env);
    const requestUrl = `${API_BASE_URL}/v1/chat/${chatId}/address/${address}`;
    const response = await axiosGet<ChatInfoResponse>(requestUrl);
    return response.data;
  } catch (err) {
    console.error(`[Push SDK] - API Error in ${getChatInfo.name}: `, err);
    throw new Error(`[Push SDK] - API Error in ${getChatInfo.name}: ${err}`);
  }
};
