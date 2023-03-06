import axios from 'axios';
import { getAPIBaseUrls, walletToPCAIP10 } from '../helpers';
import Constants from '../constants';
import { EnvOptionsType, SignerType } from '../types';
import {
    IUpdateGroupRequestPayload,
    updateGroupPayload,
    getConnectedUser,
    sign,
    updateGroupRequestValidator,
    getWallet,
    getAccountAddress
} from './helpers';
import CryptoES from "crypto-es"

export interface ChatUpdateGroupType extends EnvOptionsType {
    account?: string,
    signer?: SignerType,
    chatId: string,
    groupName: string,
    groupImage: string,
    groupDescription: string,
    members: Array<string>,
    admins: Array<string>,
    pgpPrivateKey?: string,
}

/**
 * Update Group information
 */
export const updateGroup = async (
    options: ChatUpdateGroupType
) => {
    const {
        chatId,
        groupName,
        groupImage,
        groupDescription,
        members,
        admins,
        account = null,
        signer = null,
        env = Constants.ENV.PROD,
        pgpPrivateKey = null,
    } = options || {};
    try {
        if(account == null && signer == null) {
          throw new Error(`At least one from account or signer is necessary!`);
        }
      
        const wallet = getWallet({ account, signer });
        const address = await getAccountAddress(wallet);
        updateGroupRequestValidator(chatId, groupName, groupDescription, groupImage, members, admins, address);
        const connectedUser = await getConnectedUser(wallet, pgpPrivateKey, env);
        const convertedMembers = members.map(walletToPCAIP10);
        const convertedAdmins = admins.map(walletToPCAIP10);
        const bodyToBeHashed = {
            groupName: groupName,
            groupDescription: groupDescription,
            groupImage: groupImage,
            members: convertedMembers,
            admins: convertedAdmins,
            chatId: chatId,
        }
        const hash = CryptoES.SHA256(JSON.stringify(bodyToBeHashed)).toString()
        const signature: string = await sign({ message: hash, signingKey: connectedUser.privateKey! });
        const sigType = "pgp";
        const verificationProof: string = sigType + ":" + signature + ":" + account;
        const API_BASE_URL = getAPIBaseUrls(env);
        const apiEndpoint = `${API_BASE_URL}/v1/chat/groups/${chatId}`;
        const body: IUpdateGroupRequestPayload = updateGroupPayload(
            groupName,
            groupImage,
            groupDescription,
            convertedMembers,
            convertedAdmins,
            walletToPCAIP10(address),
            verificationProof);

        return axios
            .put(apiEndpoint, body)
            .then((response) => {
                return response.data;
            })
            .catch((err) => {
                if (err?.response?.data)
                    throw new Error(err?.response?.data);
                throw new Error(err);
            });

    } catch (err) {
        console.error(`[Push SDK] - API  - Error - API ${updateGroup.name} -:  `, err);
        throw Error(`[Push SDK] - API  - Error - API ${updateGroup.name} -: ${err}`);
    }
};