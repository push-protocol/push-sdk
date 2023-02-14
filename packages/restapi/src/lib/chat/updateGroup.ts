import axios from 'axios';
import {
    getAPIBaseUrls, walletToPCAIP10,
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
        groupImage: string,
        members: Array < string >,
        admins: Array < string >,
        pgpPrivateKey?: string,
}


export const updateGroup = async (
  options: ChatUpdateGroupType
) => {
    const {
        chatId,
        groupName,
        groupImage,
        members,
        admins,
        account,
        env = Constants.ENV.PROD,
        pgpPrivateKey = null,
    } = options || {};

    try {

        updateGroupRequestValidator(chatId, groupName, groupImage, members, admins, account);

        const connectedUser = await getConnectedUser(account, pgpPrivateKey, env);

        const convertedMembers = members.map(walletToPCAIP10);
        const convertedAdmins = admins.map(walletToPCAIP10);
        const bodyToBeHashed = {
            groupName: groupName,
            groupImage: groupImage,
            members: convertedMembers,
            admins: convertedAdmins,
            chatId: chatId,
        }

        const signature: string = await sign( {message: JSON.stringify(bodyToBeHashed),  signingKey: connectedUser.privateKey!} );
        const sigType  = "pgp";

        const verificationProof : string = sigType + ":" + signature + ":" + account;


        const API_BASE_URL = getAPIBaseUrls(env);
        const apiEndpoint = `${API_BASE_URL}/v1/chat/groups/${chatId}`;
        const body: IUpdateGroupRequestPayload = updateGroupPayload(
        groupName,
        groupImage,
        convertedMembers,
        convertedAdmins,
        walletToPCAIP10(account),
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