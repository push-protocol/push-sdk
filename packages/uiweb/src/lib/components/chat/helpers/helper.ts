import { IMessagePayload, User } from "../exportedTypes";
import { ethers } from "ethers";
import { IGroup } from "../../../types";
import { walletToPCAIP10 } from "../../../helpers";
import { IFeeds } from "@pushprotocol/restapi";

export const getAdminList = (groupInformation: IGroup): Array<string> => {
    const adminsFromMembers = convertToWalletAddressList(groupInformation?.members.filter((admin) => admin.isAdmin == true));
      const adminsFromPendingMembers = convertToWalletAddressList(groupInformation?.pendingMembers.filter((admin) => admin.isAdmin == true));
      const adminList = [...adminsFromMembers,...adminsFromPendingMembers];
      return adminList
  };

export const convertToWalletAddressList = (
    memberList: { wallet: string }[]
  ): string[] => {
    return memberList ? memberList.map((member) => member.wallet) : [];
  }

export const getUpdatedMemberList = (groupInfo: IGroup ,walletAddress:string): Array<string> =>{
    const members = groupInfo?.members?.filter((i) => i.wallet?.toLowerCase() !== walletAddress?.toLowerCase());
    return convertToWalletAddressList([...members,...groupInfo.pendingMembers]);
}

export const getUpdatedAdminList = (groupInfo: IGroup, walletAddress: string | null, toRemove: boolean): Array<string> => {
    const groupAdminList: any = getAdminList(groupInfo);
    if (!toRemove) {
      return [...groupAdminList, walletAddress];
    } else {
      const newAdminList = groupAdminList.filter((wallet: any) => wallet !== walletAddress);
      return newAdminList;
    }
  };

export const profilePicture = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==`;


export const displayDefaultUser = ({ caip10 }: { caip10: string }): User => {
    const userCreated: User = {
      did: caip10,
      wallets: caip10,
      publicKey: 'temp',
      profilePicture: profilePicture,
      encryptedPrivateKey: 'temp',
      encryptionType: 'temp',
      signature: 'temp',
      sigType: 'temp',
      about: null,
      name: null,
      numMsg: 1,
      allowedNumMsg: 100,
      linkedListHash: null,
    };
    return userCreated;
  };

export const findObject = (data: any,parentArray: any[],property: string ): boolean => {
    let isPresent = false;
    if(data) {
    parentArray.map((value) => {
      if (value[property] == data[property]) {
        isPresent = true;
      }
    });
    }
    return isPresent;
  }

export const MemberAlreadyPresent = (member: any, groupMembers: any )=>{
    const memberCheck = groupMembers?.find((x: any)=>x.wallet?.toLowerCase() == member.wallets?.toLowerCase());
    if(memberCheck){
      return true;
    }
    return false;
  }

export const addWalletValidation = (member:User,memberList:any,groupMembers:any,account: any) =>{
    const checkIfMemberisAlreadyPresent = MemberAlreadyPresent(member, groupMembers);
  
    let errorMessage = '';
  
      if (checkIfMemberisAlreadyPresent) {
        errorMessage = "This Member is Already present in the group"
      }
  
      if (memberList?.length + groupMembers?.length >= 9) {
        errorMessage = 'No More Addresses can be added'
      }
  
      if (memberList?.length >= 9) {
        errorMessage = 'No More Addresses can be added'
      }
  
      if (findObject(member, memberList, 'wallets')) {
        errorMessage = 'Address is already added'
      }
  
      if (member?.wallets?.toLowerCase() === walletToPCAIP10(account)?.toLowerCase()) {
        errorMessage = 'Group Creator cannot be added as Member'
      }
  
      return errorMessage;
  }

export function isValidETHAddress(address: string) {
    return ethers.utils.isAddress(address);
  }

 export  const checkIfMember =  (chatFeed:IFeeds,account:string) => {
    const members = chatFeed?.groupInformation?.members || [];
    const pendingMembers = chatFeed?.groupInformation?.pendingMembers || [];
    const allMembers = [...members, ...pendingMembers];
    let isMember = false;
    allMembers.forEach((acc) => {
      if (
        acc.wallet.toLowerCase() === walletToPCAIP10(account!).toLowerCase()
      ) {
       isMember = true;
      }
    });

   
    return isMember;
  };

  export  const checkIfAccessVerifiedGroup =  (chatFeed:IFeeds) => {
    let isRules = false;
    if (
      chatFeed?.groupInformation?.rules &&
      (chatFeed?.groupInformation?.rules?.entry ||
        chatFeed?.groupInformation?.rules?.chat)
    ) {
      isRules = true;
    }
    return isRules;
  };