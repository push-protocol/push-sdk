import { ChatInfoResponse } from '../chat';
import { ENV } from '../constants';
import {
  ChatMemberProfileV2,
  ChatMessagesListResponseV2,
  ChatMessageResponseV2,
  GroupAccessResponseV2,
  IGroupParticipantsResponseV2,
  IGroupProfile,
  GroupResponseV2,
} from '../interfaces/ichat';
import { ChatListType } from '../pushapi/pushAPITypes';
import {
  ChatMemberProfile,
  GroupAccess,
  GroupDTO,
  GroupInfoDTO,
  IFeeds,
  IMessageIPFS,
  MessageObj,
  UserProfile,
} from '../types';
import * as PUSH_CHAT from '../chat';

export function transformFeedToChatMessage(
  feed: IFeeds,
  type: `${ChatListType}`,
  raw: boolean,
  decrypted: boolean
): ChatMessageResponseV2 {
  const isGroup = Boolean(feed.groupInformation);
  return {
    timestamp: String(feed.msg.timestamp),
    chatId: feed.chatId || '',
    from: {
      wallet: feed.did,
      profile: {
        name: feed.name,
        desc: feed.about,
        image: feed.profilePicture,
      },
    },
    to: {
      wallet: isGroup ? '*' : feed.msg.toCAIP10,
    },
    message: {
      type: feed.msg.messageType,
      content: (feed.msg.messageObj as MessageObj).content,
    },
    meta: {
      type: type,
      decrypted: decrypted,
      group: feed.groupInformation
        ? {
            exist: true,
            profile: {
              name: feed.groupInformation.groupName,
              desc: feed.groupInformation.groupDescription,
              image: feed.groupInformation.groupImage,
            },
          }
        : null,
    },
    reference: feed.msg.cid || '',
    previous: feed.msg.link ? [feed.msg.link] : [],
    raw: raw
      ? {
          msgVerificationProof:
            feed.msg.verificationProof || feed.msg.signature || '',
          from: {
            profileVerificationProof: feed.profileVerificationProof || null,
          },
        }
      : undefined,
  };
}

export function transformToChatMessage(
  message: IMessageIPFS,
  chatInfo: ChatInfoResponse,
  listType: string,
  raw: boolean,
  decrypt: boolean
): ChatMessageResponseV2 {
  const fromProfile = chatInfo.meta.recipients.find(
    (recipient) => recipient.participantId === message.fromDID
  )?.profile as UserProfile;

  const groupProfile: IGroupProfile | undefined = chatInfo.meta.group
    ? {
        name: chatInfo.meta.groupInfo?.profile?.name || null,
        desc: chatInfo.meta.groupInfo?.profile?.desc || null,
        image: chatInfo.meta.groupInfo?.profile?.image || null,
      }
    : undefined;

  return {
    timestamp: String(message.timestamp),
    chatId: chatInfo.chatId,
    from: {
      wallet: message.fromCAIP10,
      profile: {
        name: fromProfile.name,
        image: fromProfile.picture,
        desc: fromProfile.desc,
      },
    },
    to: {
      wallet: message.toCAIP10,
    },
    message: {
      type: message.messageType,
      content: (message.messageObj as MessageObj).content,
    },
    meta: {
      decrypted: decrypt,
      type: listType,
      group: groupProfile ? { exist: true, profile: groupProfile } : null,
    },
    reference: message.cid,
    previous: message.link ? [message.link] : [],
    raw: raw
      ? {
          msgVerificationProof:
            message.verificationProof || message.signature || '',
          from: {
            profileVerificationProof:
              fromProfile?.profileVerificationProof || null,
          },
        }
      : undefined,
  };
}

export async function handleChatListVersion2Response(
  response: IFeeds[],
  type: `${ChatListType}`,
  raw: boolean,
  decrypted: boolean
): Promise<ChatMessagesListResponseV2> {
  return {
    messages: response.map((feed) =>
      transformFeedToChatMessage(feed, type, raw, decrypted)
    ),
  };
}
export async function transformToGroupParticipantsV2(
  members: ChatMemberProfile[],
  includeRaw: boolean,
  group: GroupInfoDTO
): Promise<IGroupParticipantsResponseV2> {
  return {
    members: members.map((member) => {
      const transformedMember: ChatMemberProfileV2 = {
        did: member.userInfo.did,
        wallets: member.userInfo.wallets,
        origin: member.userInfo.origin,
        profile: {
          name: member.userInfo.profile.name,
          desc: member.userInfo.profile.desc,
          image: member.userInfo.profile.picture,
        },
        publicKey: member.userInfo.publicKey,
        config: {
          blockedUsers: member.userInfo.profile.blockedUsersList,
        },
      };

      if (includeRaw) {
        transformedMember.raw = {
          verificationProof: group.verificationProof,
          profileVerificationProof: group.profileVerificationProof,
          configVerificationProof: group.configVerificationProof,
        };
      }

      return transformedMember;
    }),
  };
}

export async function transformToGroupAccessV2(
  access: GroupAccess,
  groupId: string,
  env: ENV,
  raw: boolean
): Promise<GroupAccessResponseV2> {
  const groupInfo = await PUSH_CHAT.getGroup({ chatId: groupId, env });
  const result: GroupAccessResponseV2 = {
    ...access,
  };

  if (raw) {
    result.raw = {
      verificationProof: groupInfo.verificationProof,
      profileVerificationProof: groupInfo.profileVerificationProof,
      configVerificationProof: groupInfo.configVerificationProof,
    };
  }

  return result;
}

export function transformToGroupV2Response(
  group: GroupInfoDTO | GroupDTO,
  raw: boolean
): GroupResponseV2 {
  const response: GroupResponseV2 = {
    group: {
      profile: {
        name: group.groupName,
        desc: group.groupDescription,
        image: group.groupImage,
      },
      rules: group.rules,
      public: group.isPublic,
      type: group.groupType || 'default',
      creator: group.groupCreator,
      config: {
        meta: group.meta || null,
        scheduleAt: group.scheduleAt || null,
        scheduleEnd: group.scheduleEnd || null,
        status: group.status || null,
      },
    },

    chatId: group.chatId,
  };

  if (raw) {
    response.raw = {
      verificationProof: group.verificationProof,
      configVerificationProof: group.configVerificationProof,
      profileVerificationProof: group.profileVerificationProof,
    };
  }
  return response;
}