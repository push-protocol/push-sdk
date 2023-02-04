import {
    isValidETHAddress,
} from '../../helpers';

export const createGroupRequestValidator = (
    groupName: string, members: Array < string > , admins: Array < string > , groupCreator: string, contractAddressNFT ? : string,
    numberOfNFTs ? : number,
    contractAddressERC20 ? : string,
    numberOfERC20 ? : number,
): void => {

    if (groupName == null || groupName.length == 0) {
        throw new Error(`groupName cannot be null or empty`);
    }

    if (groupName.length >= 256) {
        throw new Error(`groupName cannot be more than 256 characters`);
    }

    if (members == null) {
        throw new Error(`members cannot be null`);
    }

    for (let i = 0; i < members.length; i++) {
        if (members[i] && !isValidETHAddress(members[i])) {
            throw new Error(`Invalid member address!`);
        }
    }

    if (admins == null) {
        throw new Error(`admins cannot be null`);
    }

    for (let i = 0; i < admins.length; i++) {
        if (!isValidETHAddress(admins[i])) {
            throw new Error(`Invalid admin address!`);
        }
    }

    if (!isValidETHAddress(groupCreator)) {
        throw new Error(`Invalid groupCreator address!`);
    }


    if (contractAddressNFT != null && contractAddressNFT?.length > 0 && !isValidETHAddress(contractAddressNFT)) {
        throw new Error(`Invalid contractAddressNFT address!`);
    }

    if (numberOfNFTs != null && numberOfNFTs < 0) {
        throw new Error(`numberOfNFTs cannot be negative number`);
    }

    if (contractAddressERC20 != null && contractAddressERC20?.length > 0 && !isValidETHAddress(contractAddressERC20)) {
        throw new Error(`Invalid contractAddressERC20 address!`);
    }

    if (numberOfERC20 != null && numberOfERC20 < 0) {
        throw new Error(`numberOfERC20 cannot be negative number`);
    }
};


export const updateGroupRequestValidator = (
    chatId: string, groupName: string, addMembers: Array < string > ,
    removeMembers: Array < string > , admin: string, numberOfERC20 ? : number, numberOfNFTs ? : number

): void => {


    if (chatId == null || chatId.length == 0) {
        throw new Error(`chatId cannot be null or empty`);
    }

    if (groupName == null || groupName.length == 0) {
        throw new Error(`groupName cannot be null or empty`);
    }

    if (groupName != null && groupName.length >= 256) {
        throw new Error(`groupName cannot be more than 256 characters`);
    }

    if (addMembers != null && addMembers.length > 0) {
        for (let i = 0; i < addMembers.length; i++) {
            if (!isValidETHAddress(addMembers[i])) {
                throw new Error(`Invalid member address in addMembers list!`);
            }
        }
    }

    if (removeMembers != null && removeMembers.length > 0) {
        for (let i = 0; i < removeMembers.length; i++) {
            if (!isValidETHAddress(removeMembers[i])) {
                throw new Error(`Invalid member address in removeMembers list!`);
            }
        }
    }

    if (admin != null && !isValidETHAddress(admin)) {
        throw new Error(`Invalid admin address!`);
    }

    if (numberOfNFTs != null && numberOfNFTs < 0) {
        throw new Error(`numberOfNFTs cannot be negative number`);
    }

    if (numberOfERC20 != null && numberOfERC20 < 0) {
        throw new Error(`numberOfERC20 cannot be negative number`);
    }

};