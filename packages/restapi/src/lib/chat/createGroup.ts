import axios from 'axios';
import {
    getAPIBaseUrls,
} from '../helpers';
import Constants from '../constants';
import {
    AccountEnvOptionsType,
} from '../types';
import {
    ICreateGroupRequestPayload,
    createGroupPayload,
    getConnectedUser,
    sign,
    createGroupRequestValidator,
} from './helpers';

import {
    decryptWithWalletRPCMethod,
} from '../../../src/lib/helpers';

import * as CryptoJS from "crypto-js"

/**
 *  POST /v1/chat/group
 */


export interface ChatCreateGroupType extends AccountEnvOptionsType {
    /** Name of the group */
    groupName: string,
    groupDescription: string,
    members: Array<string>,
    groupImage: string,
    admins: Array<string>,
    isPublic: boolean,
    groupCreator: string,
    contractAddressNFT?: string
    numberOfNFTs?: number,
    contractAddressERC20?: string,
    numberOfERC20?: number,
    pgpPrivateKey?: string,
}


export const createGroup = async (
    options: ChatCreateGroupType
) => {
    const {
        groupName,
        groupDescription,
        members,
        groupImage,
        admins,
        isPublic,
        contractAddressNFT,
        numberOfNFTs,
        contractAddressERC20,
        numberOfERC20,
        groupCreator,
        account,
        env = Constants.ENV.PROD,
        pgpPrivateKey = null,
    } = options || {};

    try {

        createGroupRequestValidator(groupName, members, admins, groupCreator,contractAddressNFT, numberOfNFTs, contractAddressERC20, numberOfERC20);

        const bodyToBeHashed = {
            groupName: groupName,
            groupDescription: groupDescription == undefined ? null : groupDescription,
            members: members,
            groupImage: groupImage,
            admins: admins,
            isPublic: isPublic,
            contractAddressNFT: contractAddressNFT == undefined ? null : contractAddressNFT,
            numberOfNFTs: numberOfNFTs == undefined ? 0 : numberOfNFTs,
            contractAddressERC20: contractAddressERC20 == undefined ? null : contractAddressERC20,
            numberOfERC20: numberOfERC20 == undefined ? 0 : numberOfERC20,
            groupCreator: groupCreator
        }

        //const connectedUser: IUser = await createUserIfNecessary({ account, env });
        const connectedUser = await getConnectedUser(account, pgpPrivateKey, env);

        let pvtkey = null;
        if (connectedUser?.encryptedPrivateKey) {
            pvtkey = await decryptWithWalletRPCMethod(
                connectedUser.encryptedPrivateKey,
                account
            );
        }
        const hash = CryptoJS.SHA256(JSON.stringify(bodyToBeHashed)).toString()
        const signature: string = await sign({ message: hash, signingKey: pvtkey });
        const sigType = "pgp";

        const verificationProof: string = sigType + ":" + signature;

        const API_BASE_URL = getAPIBaseUrls(env);
        const apiEndpoint = `${API_BASE_URL}/v1/chat/groups`;
        const body: ICreateGroupRequestPayload = createGroupPayload(groupName,
            groupDescription,
            members,
            groupImage,
            admins,
            isPublic,
            groupCreator,
            verificationProof,
            contractAddressNFT,
            numberOfNFTs,
            contractAddressERC20,
            numberOfERC20);

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