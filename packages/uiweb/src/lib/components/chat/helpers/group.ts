import { ChatMemberProfile } from '@pushprotocol/restapi';
import { pCAIP10ToWallet } from '../../../helpers';
import { Group } from '../exportedTypes';
import { GROUP_ROLES } from '../types';



export const convertToWalletAddressList = (
  memberList: { wallet: string }[]
): string[] => {
  return memberList ? memberList.map((member) => member.wallet) : [];
};



export const isAdmin = (member:ChatMemberProfile):boolean=>{

  if(member?.role === GROUP_ROLES.ADMIN)
  {
    return true;
  }
  return false;

}
