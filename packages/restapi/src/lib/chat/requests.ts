import axios from 'axios';
import {
    decryptMessage,
    getAPIBaseUrls,
} from '../helpers';
import Constants from '../constants';
import { Chat, IUser } from '../types';
import { getCID, Message } from './ipfs';
import { get as getUser } from '../user'

/**
 *  GET '/v1/w2w/users/:did/requests
 */

export type RequestOptionsType = {
    user: string; // caip10
    connectedUser: IUser;
    pgpPrivateKey: string;
    env?: string;
}

export const requests = async (
    options: RequestOptionsType
): Promise<Message[]> => {
    const {
        user,
        pgpPrivateKey,
        connectedUser,
        env = Constants.ENV.PROD,
    } = options || {};
    const API_BASE_URL = getAPIBaseUrls(env);
    const apiEndpoint = `${API_BASE_URL}/v1/w2w/users/${user}/requests`;
    const requestUrl = `${apiEndpoint}`;
    try {
        const response = await axios.get(requestUrl)
        const requests: Chat[] = JSON.parse(response.data);
        const messages: Message[] = []
        for (const request of requests) {
            if (request.threadhash !== null) {
                const message = await getCID(request.threadhash, { env });
                messages.push(message)
            }
        }
        let otherPeer: IUser;
        let signatureValidationPubliKey: string; // To do signature verification it depends on who has sent the message
        let gotOtherPeer = false;
        for (const message of messages) {
            if (message.fromCAIP10 !== user) {
                if (!gotOtherPeer) {
                    otherPeer = await getUser({ account: message.fromCAIP10, env })
                    gotOtherPeer = true;
                }
                signatureValidationPubliKey = otherPeer!.publicKey
            } else {
                signatureValidationPubliKey = connectedUser.publicKey
            }
            message.messageContent = await decryptMessage({
                encryptedMessage: message.messageContent,
                encryptedSecret: message.encryptedSecret,
                encryptionType: message.encType,
                signature: message.signature,
                signatureValidationPubliKey: signatureValidationPubliKey,
                pgpPrivateKey,
            })
        }
        return messages;
    } catch (err) {
        console.error(`[EPNS-SDK] - API ${requestUrl}: `, err);
        throw Error(`[EPNS-SDK] - API ${requestUrl}: ${err}`);
    }
}
