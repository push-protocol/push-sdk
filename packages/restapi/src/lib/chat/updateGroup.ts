import axios from 'axios';
import {
    getAPIBaseUrls,
} from '../helpers';
import Constants from '../constants';
import {
    AccountEnvOptionsType
} from '../types';
import {
    IUpdateGroupRequestPayload,
    updateGroupPayload,
    getConnectedUser,
    sign,
    updateGroupRequestValidator
} from './helpers';

import {
    decryptWithWalletRPCMethod,
} from '../../../src/lib/helpers';


/**
 *  PUT /v1/chat/groups/:chatId
 */


export interface ChatUpdateGroupType extends AccountEnvOptionsType {
        chatId: string,
        groupName: string, 
        profilePicture: string,
        members: Array < string >,
        admins: Array < string >,
        address: string
        pgpPrivateKey?: string,
}


export const updateGroup = async (
  options: ChatUpdateGroupType
) => {
    const {
        chatId,
        groupName,
        profilePicture,
        members,
        admins,
        address,
        account,
        env = Constants.ENV.PROD,
        pgpPrivateKey = null,
    } = options || {};

    try {

        updateGroupRequestValidator(chatId, groupName, profilePicture, members, admins, address);

        const connectedUser = await getConnectedUser(account, pgpPrivateKey, env);

        let pvtkey = null;
        if (connectedUser?.encryptedPrivateKey) {
            pvtkey = await decryptWithWalletRPCMethod(
            connectedUser.encryptedPrivateKey,
            account
            );
        }

        const bodyToBeHashed = {
            groupName: groupName,
            profilePicture: profilePicture,
            members: members,
            admins: admins,
            chatId: chatId,
        }

        const signature: string = await sign( {message: JSON.stringify(bodyToBeHashed),  signingKey: pvtkey} );
        const sigType  = "pgp";

        const verificationProof : string = sigType + ":" + signature + ":" + address;


        const API_BASE_URL = getAPIBaseUrls(env);
        const apiEndpoint = `${API_BASE_URL}/v1/chat/groups/${chatId}`;
        const body: IUpdateGroupRequestPayload = updateGroupPayload(
        groupName,
        profilePicture,
        members,
        admins,
        address,
        verificationProof);

        return axios
            .put(apiEndpoint, body)
            .then((response) => {
                return response.data;
            })
            .catch((err) => {
                throw new Error(err);
            });

    } catch (err) {
        console.error(`[EPNS-SDK] - API  - Error - API send() -:  `, err);
        throw Error(`[EPNS-SDK] - API  - Error - API send() -: ${err}`);
    }
};