import axios from 'axios';
import {
    getAPIBaseUrls,
    isValidETHAddress,
} from '../helpers';
import Constants from '../constants';
import {
    AccountEnvOptionsType
} from '../types';
import {
    ICreateGroupRequestPayload,
    createGroupPayload
} from './helpers';
/**
 *  POST /v1/chat/groups
 */


export interface ChatCreateGroupType extends AccountEnvOptionsType {
    /** Name of the group */ 
    groupName: string,
    members: Array < string > ,
    groupImageCID: string,
    admins: Array < string > ,
    isPublic: boolean,
    groupCreator: string,
    signature: string,
    sigType: string,
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
            groupImageCID,
            admins,
            isPublic,
            contractAddressNFT,
            numberOfNFTs,
            contractAddressERC20,
            numberOfERC20,
            groupCreator,
            signature,
            sigType = 'pgp',
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

        const API_BASE_URL = getAPIBaseUrls(env);
        //const apiEndpoint = `${API_BASE_URL}/v1/chat/group`;
        const apiEndpoint = `https://2f5a-49-205-98-54.ngrok.io/apis/v1/chat/group`;
        const body: ICreateGroupRequestPayload = createGroupPayload(groupName,
            members,
            groupImageCID,
            admins,
            isPublic,
            groupCreator,
            signature,
            sigType,
            contractAddressNFT,
            numberOfNFTs,
            contractAddressERC20,
            numberOfERC20);

        
        console.log("payload " + JSON.stringify(body))

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