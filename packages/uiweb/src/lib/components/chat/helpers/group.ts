import { ChatMemberProfile, IUser } from '@pushprotocol/restapi';
import { GROUP_ROLES } from '../types';

export const convertToWalletAddressList = (
  memberList: { wallet: string }[]
): string[] => {
  return memberList ? memberList.map((member) => member.wallet) : [];
};

export const isAdmin = (member:ChatMemberProfile):boolean=>{

  if(member?.role === GROUP_ROLES.ADMIN.toLowerCase())
  {
    return true;
  }
  return false;
}

export   const transformIUserToChatMemberProfile = (
  profile: IUser,
  intent: boolean
) => {
  const transformedProfile: ChatMemberProfile = {
    address: profile.wallets,
    intent: intent,
    role: GROUP_ROLES.MEMBER,
    userInfo: {
      msgSent: profile.msgSent,
      maxMsgPersisted: profile.maxMsgPersisted,
      did: profile.did,
      wallets: profile.wallets,
      profile: profile.profile,
      encryptedPrivateKey: profile.encryptedPrivateKey,
      publicKey: profile.publicKey,
      verificationProof: profile.verificationProof,
      origin: profile.origin,
    },
  };
  return transformedProfile;
};



