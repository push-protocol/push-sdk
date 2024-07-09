import Constants, { ENV } from '../constants';
import { handleError } from '../errors/validationError';
import { getAPIBaseUrls } from '../helpers';
import { axiosGet } from '../utils/axiosUtil';

export interface Message {
  fromCAIP10: string;
  toCAIP10: string;
  fromDID: string;
  toDID: string;
  messageType: string;
  messageContent: string;
  signature: string;
  sigType: string;
  timestamp?: number;
  encType: string;
  encryptedSecret: string;
  link: string | null;
  cid: string;
}

export interface IPFSOptionsType {
  env?: ENV;
}

export async function getCID(
  cid: string,
  options: IPFSOptionsType
): Promise<Message> {
  const { env = Constants.ENV.PROD } = options || {};
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/ipfs/${cid}`;
  try {
    const response = await axiosGet(apiEndpoint);
    const message: Message = response.data;
    return message;
  } catch (err) {
    throw handleError(err, getCID.name);
  }
}
