import { pCAIP10ToWallet } from '../../../helpers';
import { Group } from '../exportedTypes';

// export const getAdminList = (groupInformation: Group): Array<string> => {
//   const adminsFromMembers = convertToWalletAddressList(
//     groupInformation?.members.filter((admin) => admin.isAdmin == true)
//   );
//   const adminsFromPendingMembers = convertToWalletAddressList(
//     groupInformation?.pendingMembers.filter((admin) => admin.isAdmin == true)
//   );
//   const adminList = [...adminsFromMembers, ...adminsFromPendingMembers];
//   return adminList;
// };

export const convertToWalletAddressList = (
  memberList: { wallet: string }[]
): string[] => {
  return memberList ? memberList.map((member) => member.wallet) : [];
};

// export const getUpdatedMemberList = (
//   groupInfo: Group,
//   walletAddress: string
// ): Array<string> => {
//   const members = groupInfo?.members?.filter(
//     (i) => i.wallet?.toLowerCase() !== walletAddress?.toLowerCase()
//   );
//   return convertToWalletAddressList([...members, ...groupInfo.pendingMembers]);
// };

// export const getUpdatedAdminList = (
//   groupInfo: Group,
//   walletAddress: string | null,
//   toRemove: boolean
// ): Array<string> => {
//   const groupAdminList: any = getAdminList(groupInfo);
//   if (!toRemove) {
//     return [...groupAdminList, walletAddress];
//   } else {
//     const newAdminList = groupAdminList.filter(
//       (wallet: any) => wallet.toLowerCase() !== walletAddress?.toLowerCase()
//     );
//     return newAdminList;
//   }
// };

// export const isAccountOwnerAdmin = (groupInfo: Group, account: string) => {
//   if (account && groupInfo) {
//     return groupInfo?.members?.some(
//       (member) =>
//         pCAIP10ToWallet(member?.wallet)?.toLowerCase() ===
//           account?.toLowerCase() && member?.isAdmin
//     );
//   }
//   return false;
// };
