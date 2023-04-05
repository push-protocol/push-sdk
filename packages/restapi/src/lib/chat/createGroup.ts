import axios from 'axios';
import { getAPIBaseUrls, walletToPCAIP10 } from '../helpers';
import Constants from '../constants';
import { EnvOptionsType, SignerType } from '../types';
import {
    ICreateGroupRequestPayload,
    createGroupPayload,
    getConnectedUser,
    sign,
    createGroupRequestValidator,
    getWallet,
    getAccountAddress,
} from './helpers';
import * as CryptoJS from "crypto-js";

export interface ChatCreateGroupType extends EnvOptionsType {
    account?: string,
    signer?: SignerType,
    groupName: string,
    groupDescription: string,
    members: Array<string>,
    groupImage: string,
    admins: Array<string>,
    isPublic: boolean,
    contractAddressNFT?: string
    numberOfNFTs?: number,
    contractAddressERC20?: string,
    numberOfERC20?: number,
    pgpPrivateKey?: string,
    meta?:string
}

export const createGroup = async (
    options: ChatCreateGroupType
) => {
    const {
        account = null,
        signer = null,
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
        env = Constants.ENV.PROD,
        pgpPrivateKey = null,
        meta,
    } = options || {};

    try {
        if(account == null && signer == null) {
          throw new Error(`At least one from account or signer is necessary!`);
        }
      
        const wallet = getWallet({ account, signer });
        const address = await getAccountAddress(wallet);
        createGroupRequestValidator(groupName, groupDescription, members, admins, contractAddressNFT, numberOfNFTs, contractAddressERC20, numberOfERC20);

        const convertedMembers = members.map(walletToPCAIP10);
        const convertedAdmins = admins.map(walletToPCAIP10);

        const bodyToBeHashed = {
            groupName: groupName,
            groupDescription: groupDescription == undefined ? null : groupDescription,
            members: convertedMembers,
            groupImage: groupImage,
            admins: convertedAdmins,
            isPublic: isPublic,
            contractAddressNFT: contractAddressNFT == undefined ? null : contractAddressNFT,
            numberOfNFTs: numberOfNFTs == undefined ? 0 : numberOfNFTs,
            contractAddressERC20: contractAddressERC20 == undefined ? null : contractAddressERC20,
            numberOfERC20: numberOfERC20 == undefined ? 0 : numberOfERC20,
            groupCreator: walletToPCAIP10(address)
        }

        const connectedUser = await getConnectedUser(wallet, pgpPrivateKey, env);

        const hash = CryptoJS.SHA256(JSON.stringify(bodyToBeHashed)).toString()
        const signature: string = await sign({ message: hash, signingKey: connectedUser.privateKey! });
        const sigType = "pgp";

        const verificationProof: string = sigType + ":" + signature;

        const API_BASE_URL = getAPIBaseUrls(env);
        const apiEndpoint = `${API_BASE_URL}/v1/chat/groups`;
        const body: ICreateGroupRequestPayload = createGroupPayload(groupName,
            groupDescription,
            convertedMembers,
            groupImage,
            convertedAdmins,
            isPublic,
            walletToPCAIP10(address),
            verificationProof,
            contractAddressNFT,
            numberOfNFTs,
            contractAddressERC20,
            numberOfERC20,
            meta);

        return axios
            .post(apiEndpoint, body)
            .then((response) => {
                return response.data;
            })
            .catch((err) => {
                if (err?.response?.data)
                    throw new Error(err?.response?.data);
                throw new Error(err);
            });

    } catch (err) {
        console.error(`[Push SDK] - API  - Error - API ${createGroup.name} -:  `, err);
        throw Error(`[Push SDK] - API  - Error - API ${createGroup.name} -: ${err}`);
    }
};