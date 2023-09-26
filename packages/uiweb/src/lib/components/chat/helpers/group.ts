import { pCAIP10ToWallet } from '../../../helpers';
import { IGroup } from '../../../types';

export const getAdminList = (groupInformation: IGroup): Array<string> => {
  const adminsFromMembers = convertToWalletAddressList(
    groupInformation?.members.filter((admin) => admin.isAdmin == true)
  );
  const adminsFromPendingMembers = convertToWalletAddressList(
    groupInformation?.pendingMembers.filter((admin) => admin.isAdmin == true)
  );
  const adminList = [...adminsFromMembers, ...adminsFromPendingMembers];
  return adminList;
};

export const convertToWalletAddressList = (
  memberList: { wallet: string }[]
): string[] => {
  return memberList ? memberList.map((member) => member.wallet) : [];
};

export const getUpdatedMemberList = (
  groupInfo: IGroup,
  walletAddress: string
): Array<string> => {
  const members = groupInfo?.members?.filter(
    (i) => i.wallet?.toLowerCase() !== walletAddress?.toLowerCase()
  );
  return convertToWalletAddressList([...members, ...groupInfo.pendingMembers]);
};

export const getUpdatedAdminList = (
  groupInfo: IGroup,
  walletAddress: string | null,
  toRemove: boolean
): Array<string> => {
  const groupAdminList: any = getAdminList(groupInfo);
  if (!toRemove) {
    return [...groupAdminList, walletAddress];
  } else {
    const newAdminList = groupAdminList.filter(
      (wallet: any) => wallet.toLowerCase() !== walletAddress?.toLowerCase()
    );
    return newAdminList;
  }
};

export const isAccountOwnerAdmin = (groupInfo: IGroup, account: string) => {
  if (account && groupInfo) {
    return groupInfo?.members?.some(
      (member) =>
        pCAIP10ToWallet(member?.wallet)?.toLowerCase() ===
          account?.toLowerCase() && member?.isAdmin
    );
  }
  return false;
};
