import { IMessagePayload, User } from "../exportedTypes";
import { ethers } from "ethers";
import { IGroup } from "../../../types";
import { walletToPCAIP10 } from "../../../helpers";


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

  