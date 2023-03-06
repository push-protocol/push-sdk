import axios from "axios";
import Constants, {ENV} from "../constants";
import { getAPIBaseUrls } from "../helpers";

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
}

export interface IPFSOptionsType {
    env?: ENV,
}

export async function getCID(cid: string, options: IPFSOptionsType): Promise<Message> {
    const { env = Constants.ENV.PROD } = options || {};
    const API_BASE_URL = getAPIBaseUrls(env);
    const apiEndpoint = `${API_BASE_URL}/v1/ipfs/${cid}`;
    try {
        const response = await axios.get(apiEndpoint)
        const message: Message = response.data;
        return message;
    } catch (err) {
        console.error(`[Push SDK] - API ${getCID.name}: `, err);
        throw Error(`[Push SDK] - API ${getCID.name}: ${err}`);
    }
}