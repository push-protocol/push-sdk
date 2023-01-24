import axios from 'axios';
import {
    getAPIBaseUrls,
    isValidETHAddress,
} from '../helpers';
import Constants from '../constants';
import {
    AccountEnvOptionsType, IUser
} from '../types';
import {
    ICreateGroupRequestPayload,
    createGroupPayload,
    createUserIfNecessary,
    sign,
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
    members: Array < string > ,
    groupImage: string,
    admins: Array < string > ,
    isPublic: boolean,
    groupCreator: string,
    contractAddressNFT ? : string
    numberOfNFTs ? : number,
    contractAddressERC20 ? : string,
    numberOfERC20 ? : number,
}


export const createGroup = async (
  options: ChatCreateGroupType
) => {
    const {
            groupName,
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
    } = options || {};

    try {
        if (groupName == null || groupName.length == 0) {
            throw new Error(`groupName cannot be null or empty`);
        }

        if (groupName.length >= 256) {
            throw new Error(`groupName cannot be more than 256 characters`);
        }

        if (members == null || members.length == 0) {
            throw new Error(`members cannot be null or empty`);
        }

        for(let i = 0; i < members.length; i++) {
            if (!isValidETHAddress(members[i])) {
                throw new Error(`Invalid member address!`);
            }
        }

        if (admins == null || admins.length == 0) {
            throw new Error(`admins cannot be null or empty`);
        }

        for(let i = 0; i < admins.length; i++) {
            if (!isValidETHAddress(admins[i])) {
                throw new Error(`Invalid admin address!`);
            }
        }

        if (!isValidETHAddress(groupCreator)) {
            throw new Error(`Invalid groupCreator address!`);
        }

      
        if (contractAddressNFT!=null && contractAddressNFT?.length > 0 && !isValidETHAddress(contractAddressNFT)) {
            throw new Error(`Invalid contractAddressNFT address!`);
        }

        if (numberOfNFTs!=null && numberOfNFTs < 0) {
            throw new Error(`numberOfNFTs cannot be negative number`);
        }

        if (contractAddressERC20!=null && contractAddressERC20?.length > 0 && !isValidETHAddress(contractAddressERC20)) {
            throw new Error(`Invalid contractAddressERC20 address!`);
        }

        if (numberOfERC20!=null && numberOfERC20 < 0) {
            throw new Error(`numberOfERC20 cannot be negative number`);
        }

        const bodyToBeHashed = {
          groupName: groupName,
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

        const connectedUser : IUser = await createUserIfNecessary({account, env});

        let pvtkey = null;
        if (connectedUser?.encryptedPrivateKey) {
            pvtkey = await decryptWithWalletRPCMethod(
            connectedUser.encryptedPrivateKey,
            account
            );
        }
        const hash = CryptoJS.SHA256(JSON.stringify(bodyToBeHashed)).toString()
        const signature: string = await sign( {message: hash,  signingKey: pvtkey} );
        const sigType  = "pgp";

        const verificationProof : string = sigType + ":" + signature;

        const API_BASE_URL = getAPIBaseUrls(env);
        const apiEndpoint = `${API_BASE_URL}/v1/chat/groups`;
        const body: ICreateGroupRequestPayload = createGroupPayload(groupName,
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