import axios from 'axios';
import {
    getAPIBaseUrls,
} from '../helpers';
import Constants from '../constants';
import {
    AccountEnvOptionsType, IUser
} from '../types';
import {
    IUpdateGroupRequestPayload,
    updateGroupPayload,
    createUserIfNecessary,
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
        numberOfERC20: number,
        numberOfNFTs: number,
        profilePicture: string,
        addMembers: Array < string >,
        removeMembers: Array < string >,
        admin: string
}


export const updateGroup = async (
  options: ChatUpdateGroupType
) => {
    const {
        chatId,
        groupName,
        numberOfERC20,
        numberOfNFTs,
        profilePicture,
        addMembers,
        removeMembers,
        admin,
        account,
        env = Constants.ENV.PROD,
    } = options || {};

    try {

        updateGroupRequestValidator(chatId, groupName, addMembers, removeMembers, admin, numberOfNFTs, numberOfERC20);

        const connectedUser : IUser = await createUserIfNecessary({account, env});

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
            numberOfERC20: numberOfERC20,
            numberOfNFTs: numberOfNFTs,
            addMembers: addMembers,
            removeMembers: removeMembers,
            chatId: chatId,
            admin: admin
        }

        const signature: string = await sign( {message: JSON.stringify(bodyToBeHashed),  signingKey: pvtkey} );
        const sigType  = "pgp";

        const verificationProof : string = sigType + ":" + signature;


        const API_BASE_URL = getAPIBaseUrls(env);
        const apiEndpoint = `${API_BASE_URL}/v1/chat/groups/${chatId}`;
        const body: IUpdateGroupRequestPayload = updateGroupPayload(
        groupName,
        numberOfERC20,
        numberOfNFTs,
        profilePicture,
        addMembers,
        removeMembers,
        admin,
        verificationProof);

        return axios
            .post(apiEndpoint, body)
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