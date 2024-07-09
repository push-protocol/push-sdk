import { ENV, MessageType, ALPHA_FEATURES } from '../constants';
import {
  ChatSendOptionsType,
  GroupAccess,
  GroupDTO,
  IFeeds,
  MessageWithCID,
  SignerType,
  Message,
  ProgressHookType,
  IUser,
  IMessageIPFS,
  GroupInfoDTO,
  ChatMemberProfile,
  GroupParticipantCounts,
} from '../types';
import {
  GroupUpdateOptions,
  ChatListType,
  GroupCreationOptions,
  ManageGroupOptions,
  RemoveFromGroupOptions,
  GetGroupParticipantsOptions,
  ParticipantStatus,
} from './pushAPITypes';
import * as PUSH_USER from '../user';
import * as PUSH_CHAT from '../chat';
import { PGPHelper } from '../chat/helpers';
import {
  convertToValidDID,
  isValidPushCAIP,
  walletToPCAIP10,
} from '../helpers';
import {
  ChatUpdateGroupProfileType,
  updateGroupProfile,
} from '../chat/updateGroupProfile';
import { User, isIUser } from './user';
import { updateGroupConfig } from '../chat/updateGroupConfig';
import { PushAPI } from './PushAPI';
import { ChatInfoResponse } from '../chat';
import {
  ChatActionResponse,
  ChatMemberProfileV2,
  GroupActionResponse,
  IChatListResponse,
  IChatListResponseV2,
  IChatMessage,
  IGroupAccessResponseV2,
  IGroupResponseV2,
  ISendMessageResponseV2,
} from '../interfaces/ichat';
import {
  handleChatListVersion2Response,
  transformToChatMessage,
  transformToGroupV2Response,
  transformToGroupAccessV2,
  transformToGroupParticipantsV2,
} from '../helpers/transformers';

export function isChatListIFeeds(
  response: IChatListResponse
): response is IFeeds[] {
  return (
    Array.isArray(response) && (response.length === 0 || 'msg' in response[0])
  );
}

export class Chat {
  private userInstance: User;
  private scalabilityV2Feature: boolean;

  constructor(
    private account: string,
    private env: ENV,
    private alpha: { feature: string[] },
    private decryptedPgpPvtKey?: string,
    private signer?: SignerType,
    private progressHook?: (progress: ProgressHookType) => void
  ) {
    this.userInstance = new User(this.account, this.env);
    this.scalabilityV2Feature = this.alpha.feature.includes(
      ALPHA_FEATURES.SCALABILITY_V2
    );
  }

  async list(
    type: `${ChatListType}`,
    options?: {
      page?: number;
      limit?: number;
      overrideAccount?: string;
    } & { raw?: boolean; version?: number }
  ): Promise<IFeeds[] | IChatListResponseV2> {
    const accountToUse = options?.overrideAccount || this.account;
    const toDecrypt = !!this.decryptedPgpPvtKey;
    const listParams = {
      account: accountToUse,
      pgpPrivateKey: this.decryptedPgpPvtKey,
      page: options?.page,
      limit: options?.limit,
      env: this.env,
      toDecrypt: toDecrypt, // Set to false if signer is undefined or null,
    };

    const raw = options?.raw || false;
    const version = options?.version || 1;

    let response: IFeeds[];
    switch (type) {
      case ChatListType.CHATS:
        response = await PUSH_CHAT.chats(listParams);
        break;
      case ChatListType.REQUESTS:
        response = await PUSH_CHAT.requests(listParams);
        break;
      default:
        throw new Error('Invalid Chat List Type');
    }

    if (version === 1) {
      return response as IFeeds[];
    } else if (version === 2) {
      return handleChatListVersion2Response(response, type, raw, toDecrypt);
    }
    throw new Error('Invalid version specified');
  }

  async latest(
    target: string,
    options?: {
      raw?: boolean;
      version?: number;
    }
  ): Promise<IMessageIPFS[] | IChatMessage> {
    const { threadHash, intent } = await PUSH_CHAT.conversationHash({
      conversationId: target,
      account: this.account,
      env: this.env,
    });

    if (!threadHash) {
      return [];
    }
    const toDecrypt = !!this.decryptedPgpPvtKey;

    const latestMessages = await PUSH_CHAT.latest({
      threadhash: threadHash,
      toDecrypt: toDecrypt,
      pgpPrivateKey: this.decryptedPgpPvtKey,
      account: this.account,
      env: this.env,
    });

    const raw = options?.raw || false;
    const version = options?.version || 1;
    const listType = intent ? 'CHATS' : 'REQUESTS';

    if (version === 1) {
      return latestMessages.map((message) => ({ ...message, listType }));
    } else if (version === 2) {
      const chatInfo: ChatInfoResponse = await PUSH_CHAT.getChatInfo({
        recipient: target,
        account: this.account,
        env: this.env,
      });

      if (latestMessages.length > 0) {
        return transformToChatMessage(
          latestMessages[0],
          chatInfo,
          listType,
          raw,
          toDecrypt
        );
      } else {
        return {} as IChatMessage;
      }
    }
    throw new Error('Invalid version specified');
  }

  async history(
    target: string,
    options?: {
      reference?: string | null;
      limit?: number;
    } & { raw?: boolean; version?: number }
  ): Promise<IMessageIPFS[] | IChatMessage[]> {
    let reference: string;
    const { threadHash, intent } = await PUSH_CHAT.conversationHash({
      conversationId: target,
      account: this.account,
      env: this.env,
    });
    if (!options?.reference) {
      reference = threadHash;
    } else {
      reference = options.reference;
    }

    if (!reference) return [];
    const toDecrypt = !!this.decryptedPgpPvtKey;

    const historyMessages = await PUSH_CHAT.history({
      account: this.account,
      env: this.env,
      threadhash: reference,
      pgpPrivateKey: this.decryptedPgpPvtKey,
      toDecrypt: toDecrypt, // Set to false if signer is undefined or null,
      limit: options?.limit,
    });
    const listType = intent ? 'CHATS' : 'REQUESTS';
    const raw = options?.raw || false;
    const version = options?.version || 1;

    if (version === 1) {
      return historyMessages.map((message: any) => ({ ...message, listType }));
    } else if (version === 2) {
      const chatInfo: ChatInfoResponse = await PUSH_CHAT.getChatInfo({
        recipient: target,
        account: this.account,
        env: this.env,
      });
      return historyMessages.map((message) =>
        transformToChatMessage(message, chatInfo, listType, raw, toDecrypt)
      );
    } else {
      throw new Error('Invalid version specified');
    }
  }

  async message(
    target: string,
    options?: {
      reference?: string | null;
    } & { raw?: boolean; version?: number }
  ): Promise<IMessageIPFS | IChatMessage> {
    let reference: string | null = options?.reference || null;
    let intent: boolean | null = null;

    if (!reference) {
      const conversationData = await PUSH_CHAT.conversationHash({
        conversationId: target,
        account: this.account,
        env: this.env,
      });
      reference = conversationData.threadHash;
      intent = conversationData.intent;
    }

    if (!reference) {
      throw new Error('Invalid reference');
    }
    const historyMessages = await this.history(target, { reference, limit: 1 });
    const listType = intent ? 'CHATS' : 'REQUESTS';
    const raw = options?.raw || false;
    const version = options?.version || 1;
    const toDecrypt = !!this.decryptedPgpPvtKey;

    if (historyMessages.length === 0) {
      throw new Error('Invalid reference');
    }

    if (version === 1) {
      const message: IMessageIPFS = historyMessages[0] as IMessageIPFS;
      return { ...message, listType } as IMessageIPFS;
    } else if (version === 2) {
      const chatInfo: ChatInfoResponse = await PUSH_CHAT.getChatInfo({
        recipient: target,
        account: this.account,
        env: this.env,
      });

      return transformToChatMessage(
        historyMessages[0] as IMessageIPFS,
        chatInfo,
        listType,
        raw,
        toDecrypt
      );
    } else {
      throw new Error('Invalid version specified');
    }
  }

  async send(
    recipient: string,
    options: Message & { raw?: boolean; version?: number }
  ): Promise<MessageWithCID | ISendMessageResponseV2> {
    if (!this.decryptedPgpPvtKey) {
      throw new Error(PushAPI.ensureSignerMessage());
    }

    if (!options.type) {
      options.type = MessageType.TEXT;
    }
    const sendParams: ChatSendOptionsType = {
      message: options,
      to: recipient,
      account: this.account,
      signer: this.signer,
      pgpPrivateKey: this.decryptedPgpPvtKey,
      env: this.env,
    };
    const response = await PUSH_CHAT.send(sendParams);

    const raw = options.raw || false;
    const version = options.version || 1;

    if (version === 1) {
      return response;
    } else if (version === 2) {
      const v2Response: ISendMessageResponseV2 = {
        timestamp: String(response.timestamp),
        chatId: response.chatId,
        reference: response.cid,
      };

      if (raw) {
        v2Response.raw = {
          msgVerificationProof:
            response.verificationProof || response.signature || '',
        };
      }

      return v2Response;
    }
    throw new Error('Invalid version specified');
  }

  async decrypt(
    messagePayloads: IMessageIPFS[],
    options?: { raw?: boolean; version?: number }
  ): Promise<IMessageIPFS[] | IChatMessage[]> {
    if (!this.decryptedPgpPvtKey) {
      throw new Error(PushAPI.ensureSignerMessage());
    }
    let connectedUser = await this.userInstance.info();
    if (!isIUser(connectedUser)) {
      throw new Error('Connected user does not have the required properties.');
    }
    const raw = options?.raw || false;
    const version = options?.version || 1;
    const historyMessages = await PUSH_CHAT.decryptConversation({
      pgpPrivateKey: this.decryptedPgpPvtKey,
      env: this.env,
      messages: messagePayloads,
      pgpHelper: PGPHelper,
      connectedUser: connectedUser,
    });

    if (historyMessages.length === 0) {
      return [];
    }

    const target = historyMessages[0].fromCAIP10;
    const { intent } = await PUSH_CHAT.conversationHash({
      conversationId: target,
      account: this.account,
      env: this.env,
    });

    const listType = intent ? 'CHATS' : 'REQUESTS';
    const toDecrypt = !!this.decryptedPgpPvtKey;

    if (version === 1) {
      return historyMessages.map((message: any) => ({
        ...message,
        listType,
      }));
    } else if (version === 2) {
      const chatInfo: ChatInfoResponse = await PUSH_CHAT.getChatInfo({
        recipient: target,
        account: this.account,
        env: this.env,
      });
      return historyMessages.map((message) =>
        transformToChatMessage(message, chatInfo, listType, raw, toDecrypt)
      );
    } else {
      throw new Error('Invalid version specified');
    }
  }

  async accept(
    target: string,
    options?: { raw?: boolean; version?: number }
  ): Promise<string | ChatActionResponse> {
    if (!this.decryptedPgpPvtKey) {
      throw new Error(PushAPI.ensureSignerMessage());
    }

    const raw = options?.raw || false;
    const version = options?.version || 1;

    const response = await PUSH_CHAT.approve({
      senderAddress: target,
      env: this.env,
      account: this.account,
      signer: this.signer,
      pgpPrivateKey: this.decryptedPgpPvtKey,
      overrideSecretKeyGeneration: !this.scalabilityV2Feature,
    });

    if (version === 1) {
      return `${response.fromDID}+${response.toDID}`;
    } else if (version === 2) {
      const result: ChatActionResponse = { success: true };
      if (raw) {
        result.raw = {
          actionVerificationProof: response.verificationProof || null,
        };
      }
      return result;
    }

    throw new Error('Invalid version specified');
  }

  async reject(
    target: string,
    options?: { raw?: boolean; version?: number }
  ): Promise<void | ChatActionResponse> {
    if (!this.decryptedPgpPvtKey) {
      throw new Error(PushAPI.ensureSignerMessage());
    }

    const raw = options?.raw || false;
    const version = options?.version || 1;

    const response = await PUSH_CHAT.reject({
      senderAddress: target,
      env: this.env,
      account: this.account,
      signer: this.signer,
      pgpPrivateKey: this.decryptedPgpPvtKey,
    });

    if (version === 1) {
      return;
    } else if (version === 2) {
      const result: ChatActionResponse = { success: true };
      if (raw) {
        result.raw = {
          actionVerificationProof: response.verificationProof || null,
        };
      }
      return result;
    }

    throw new Error('Invalid version specified');
  }

  async block(
    users: Array<string>,
    options?: {
      raw?: boolean;
      version?: number;
    }
  ): Promise<IUser | ChatActionResponse> {
    if (!this.decryptedPgpPvtKey) {
      throw new Error(PushAPI.ensureSignerMessage());
    }
    const user = await PUSH_USER.get({
      account: this.account,
      env: this.env,
    });

    for (const element of users) {
      if (!isValidPushCAIP(element)) {
        throw new Error('Invalid address in the users: ' + element);
      }
    }

    if (!user.profile.blockedUsersList) {
      user.profile.blockedUsersList = [];
    }

    user.profile.blockedUsersList = [
      ...new Set([...user.profile.blockedUsersList, ...users]),
    ];

    if (!this.decryptedPgpPvtKey) {
      throw new Error(PushAPI.ensureSignerMessage());
    }

    const response = await PUSH_USER.config.update({
      pgpPrivateKey: this.decryptedPgpPvtKey,
      account: this.account,
      config: {
        blockedUsersList: user.profile.blockedUsersList,
      },
      env: this.env,
      progressHook: this.progressHook,
    });

    const raw = options?.raw || false;
    const version = options?.version || 1;

    if (version === 1) {
      return response;
    } else if (version === 2) {
      const result: any = { success: true };
      if (raw) {
        result.raw = {
          actionVerificationProof: response.config?.configVerificationProof,
        };
      }
      return result;
    }
    throw new Error('Invalid version specified');
  }

  async unblock(
    users: Array<string>,
    options?: {
      raw?: boolean;
      version?: number;
    }
  ): Promise<IUser | ChatActionResponse> {
    if (!this.decryptedPgpPvtKey) {
      throw new Error(PushAPI.ensureSignerMessage());
    }
    const user = await PUSH_USER.get({
      account: this.account,
      env: this.env,
    });

    for (const element of users) {
      if (!isValidPushCAIP(element)) {
        throw new Error('Invalid address in the users: ' + element);
      }
    }

    if (!user.profile.blockedUsersList) {
      return user;
    }

    const userDIDsPromises = users.map(async (user) => {
      return (await convertToValidDID(user, this.env)).toLowerCase();
    });
    const userDIDs = await Promise.all(userDIDsPromises);

    user.profile.blockedUsersList = user.profile.blockedUsersList.filter(
      (blockedUser: string) => {
        !userDIDs.includes(blockedUser.toLowerCase());
      }
    );

    const response = await PUSH_USER.profile.update({
      pgpPrivateKey: this.decryptedPgpPvtKey,
      account: this.account,
      profile: {
        name: user.profile.name!,
        desc: user.profile.desc!,
        picture: user.profile.picture!,
        blockedUsersList: user.profile.blockedUsersList,
      },
      env: this.env,
      progressHook: this.progressHook,
    });

    const raw = options?.raw || false;
    const version = options?.version || 1;

    if (version === 1) {
      return response;
    } else if (version === 2) {
      const result: any = { success: true };
      if (raw) {
        result.raw = {
          actionVerificationProof: response.config?.configVerificationProof,
        };
      }
      return result;
    }
    throw new Error('Invalid version specified');
  }

  async info(
    recipient: string,
    options?: {
      overrideAccount?: string;
    }
  ): Promise<ChatInfoResponse> {
    const accountToUse = options?.overrideAccount || this.account;
    const request: PUSH_CHAT.GetChatInfoType = {
      recipient: recipient,
      account: accountToUse,
      env: this.env,
    };
    try {
      const chatInfo = await PUSH_CHAT.getChatInfo(request);
      const isGroupChat = chatInfo.meta?.group ?? false;
      let finalRecipient = recipient; // Default to recipient
      if (isGroupChat) {
        // If it's a group chat, use the chatId as the recipient
        finalRecipient = chatInfo.chatId;
      } else {
        // If it's not a group chat, find the actual recipient among participants
        const participants = chatInfo.participants ?? [];
        // Find the participant that is not the account being used
        const participant = participants.find(
          (participant) => participant !== walletToPCAIP10(accountToUse)
        );
        if (participant) {
          finalRecipient = participant;
        }
      }
      const response: ChatInfoResponse = {
        meta: chatInfo.meta,
        list: chatInfo.list,
        participants: chatInfo.participants,
        chatId: chatInfo.chatId,
        recipient: finalRecipient,
      };
      return response;
    } catch (error) {
      console.error(`Error in Chat.info: `, error);
      throw new Error(`Error fetching chat info: ${error}`);
    }
  }

  group = {
    create: async (
      name: string,
      options?: GroupCreationOptions & { raw?: boolean; version?: number }
    ): Promise<GroupInfoDTO | GroupDTO | IGroupResponseV2> => {
      if (!this.decryptedPgpPvtKey) {
        throw new Error(PushAPI.ensureSignerMessage());
      }

      const groupParams: PUSH_CHAT.ChatCreateGroupTypeV2 = {
        account: this.account,
        signer: this.signer,
        pgpPrivateKey: this.decryptedPgpPvtKey,
        env: this.env,

        groupName: name,
        groupDescription: options?.description ?? null,
        groupImage: options?.image ?? null,
        rules: options?.rules ?? {},
        isPublic: !options?.private,
        groupType: 'default',

        config: {
          meta: null,
          scheduleAt: null,
          scheduleEnd: null,
          status: null,
        },

        members: options?.members ? options.members : [],
        admins: options?.admins ? options.admins : [],
      };
      let response: GroupDTO | GroupInfoDTO = await PUSH_CHAT.createGroupV2(
        groupParams
      );

      const raw = options?.raw || false;
      const version = options?.version || 1;

      if (!this.scalabilityV2Feature) {
        response = await PUSH_CHAT.getGroup({
          chatId: response.chatId,
          env: this.env,
        });
      }

      if (version === 1) {
        return response;
      } else if (version === 2) {
        return transformToGroupV2Response(response, raw);
      }
      throw new Error('Invalid version specified');
    },

    participants: {
      list: async (
        chatId: string,
        options?: GetGroupParticipantsOptions & {
          raw?: boolean;
          version?: number;
        }
      ): Promise<{ members: ChatMemberProfile[] | ChatMemberProfileV2[] }> => {
        const {
          page = 1,
          limit = 20,
          filter = { pending: undefined, role: undefined },
        } = options ?? {};
        const getGroupMembersOptions: PUSH_CHAT.FetchChatGroupInfoType = {
          chatId,
          page,
          limit,
          pending: filter.pending,
          role: filter.role,
          env: this.env,
        };

        const members = await PUSH_CHAT.getGroupMembers(getGroupMembersOptions);
        const raw = options?.raw || false;
        const version = options?.version || 1;

        if (version === 1) {
          return { members };
        } else if (version === 2) {
          const group = await PUSH_CHAT.getGroupInfo({
            chatId: chatId,
            env: this.env,
          });
          return await transformToGroupParticipantsV2(members, raw, group);
        }

        throw new Error('Invalid version specified');
      },

      count: async (chatId: string): Promise<GroupParticipantCounts> => {
        const count = await PUSH_CHAT.getGroupMemberCount({
          chatId,
          env: this.env,
        });
        return {
          participants: count.overallCount - count.pendingCount,
          pending: count.pendingCount,
        };
      },

      status: async (
        chatId: string,
        options?: {
          overrideAccount?: string;
        }
      ): Promise<ParticipantStatus> => {
        const accountId = options?.overrideAccount || this.account;
        const status = await PUSH_CHAT.getGroupMemberStatus({
          chatId: chatId,
          did: accountId,
          env: this.env,
        });

        return {
          pending: status.isPending,
          role: status.isAdmin ? 'admin' : 'member',
          participant: status.isMember,
        };
      },
    },

    permissions: async (
      chatId: string,
      options?: { raw?: boolean; version?: number }
    ): Promise<GroupAccess | IGroupAccessResponseV2> => {
      const getGroupAccessOptions: PUSH_CHAT.GetGroupAccessType = {
        chatId,
        did: this.account,
        env: this.env,
      };
      const access = await PUSH_CHAT.getGroupAccess(getGroupAccessOptions);
      const raw = options?.raw || false;
      const version = options?.version || 1;

      if (version === 1) {
        return access;
      } else if (version === 2) {
        return await transformToGroupAccessV2(access, chatId, this.env, raw);
      }

      throw new Error('Invalid version specified');
    },

    info: async (
      chatId: string,
      options?: { raw?: boolean; version?: number }
    ): Promise<GroupDTO | GroupInfoDTO | IGroupResponseV2> => {
      const raw = options?.raw || false;
      const version = options?.version || 1;
      let response: GroupDTO | GroupInfoDTO = this.scalabilityV2Feature
        ? await PUSH_CHAT.getGroupInfo({
            chatId: chatId,
            env: this.env,
          })
        : await PUSH_CHAT.getGroup({
            chatId: chatId,
            env: this.env,
          });
      if (version === 1) {
        return response;
      } else if (version === 2) {
        return transformToGroupV2Response(response, raw);
      }
      throw new Error('Invalid version specified');
    },

    update: async (
      chatId: string,
      options: GroupUpdateOptions & { raw?: boolean; version?: number }
    ): Promise<GroupInfoDTO | GroupDTO | IGroupResponseV2> => {
      if (!this.decryptedPgpPvtKey) {
        throw new Error(PushAPI.ensureSignerMessage());
      }

      const group = await PUSH_CHAT.getGroupInfo({
        chatId: chatId,
        env: this.env,
      });
      if (!group) {
        throw new Error('Group not found');
      }

      const updateGroupProfileOptions: ChatUpdateGroupProfileType = {
        chatId: chatId,
        groupName: options.name ? options.name : group.groupName,
        groupDescription:
          options.description !== undefined
            ? options.description
            : group.groupDescription,
        groupImage:
          options.image !== undefined ? options.image : group.groupImage,
        rules: options.rules ? options.rules : group.rules,
        account: this.account,
        pgpPrivateKey: this.decryptedPgpPvtKey,
        env: this.env,
      };
      const updateGroupConfigOptions = {
        chatId: chatId,
        meta: options.meta ? options.meta : group.meta,
        scheduleAt: options.scheduleAt ? options.scheduleAt : group.scheduleAt,
        scheduleEnd: options.scheduleEnd
          ? options.scheduleEnd
          : group.scheduleEnd,
        status: options.status ? options.status : group.status,
        account: this.account,
        pgpPrivateKey: this.decryptedPgpPvtKey,
        env: this.env,
      };
      await updateGroupProfile(updateGroupProfileOptions);
      let response: GroupDTO | GroupInfoDTO = await updateGroupConfig(
        updateGroupConfigOptions
      );

      const raw = options?.raw || false;
      const version = options?.version || 1;

      if (!this.scalabilityV2Feature) {
        response = await PUSH_CHAT.getGroup({
          chatId: response.chatId,
          env: this.env,
        });
      }

      if (version === 1) {
        return response;
      } else if (version === 2) {
        return transformToGroupV2Response(response, raw);
      }
      throw new Error('Invalid version specified');
    },

    add: async (
      chatId: string,
      options: ManageGroupOptions & { raw?: boolean; version?: number }
    ): Promise<GroupInfoDTO | GroupDTO | GroupActionResponse> => {
      if (!this.decryptedPgpPvtKey) {
        throw new Error(PushAPI.ensureSignerMessage());
      }
      const { role, accounts } = options;

      const validRoles = ['ADMIN', 'MEMBER'];
      if (!validRoles.includes(role)) {
        throw new Error('Invalid role provided.');
      }

      if (!accounts || accounts.length === 0) {
        throw new Error('accounts array cannot be empty!');
      }

      accounts.forEach((account) => {
        if (!isValidPushCAIP(account)) {
          throw new Error(`Invalid account address: ${account}`);
        }
      });

      let response: GroupInfoDTO;
      if (role === 'ADMIN') {
        response = await PUSH_CHAT.addAdmins({
          chatId: chatId,
          admins: accounts,
          env: this.env,
          account: this.account,
          signer: this.signer,
          pgpPrivateKey: this.decryptedPgpPvtKey,
          overrideSecretKeyGeneration: !this.scalabilityV2Feature,
        });
      } else {
        response = await PUSH_CHAT.addMembers({
          chatId: chatId,
          members: accounts,
          env: this.env,
          account: this.account,
          signer: this.signer,
          pgpPrivateKey: this.decryptedPgpPvtKey,
          overrideSecretKeyGeneration: !this.scalabilityV2Feature,
        });
      }
      const raw = options?.raw || false;
      const version = options?.version || 1;
      if (version === 1) {
        if (this.scalabilityV2Feature) {
          return response;
        } else {
          return await PUSH_CHAT.getGroup({
            chatId: response.chatId,
            env: this.env,
          });
        }
      } else if (version === 2) {
        const result: any = { success: true };
        if (raw) {
          result.raw = {
            actionVerificationProof: response.deltaVerificationProof,
          };
        }
        return result;
      }
      throw new Error('Invalid version specified');
    },

    remove: async (
      chatId: string,
      options: RemoveFromGroupOptions & { raw?: boolean; version?: number }
    ): Promise<void | GroupActionResponse> => {
      const { accounts } = options;

      if (!this.decryptedPgpPvtKey) {
        throw new Error(PushAPI.ensureSignerMessage());
      }

      if (!accounts || accounts.length === 0) {
        throw new Error('Accounts array cannot be empty!');
      }

      accounts.forEach((account) => {
        if (!isValidPushCAIP(account)) {
          throw new Error(`Invalid account address: ${account}`);
        }
      });

      const adminsToRemove = [];
      const membersToRemove = [];

      for (const account of accounts) {
        const status = await PUSH_CHAT.getGroupMemberStatus({
          chatId: chatId,
          did: account,
          env: this.env,
        });

        if (status.isAdmin) {
          adminsToRemove.push(account);
        } else if (status.isMember) {
          membersToRemove.push(account);
        }
      }
      let deltaVerificationProof;
      let response;
      if (adminsToRemove.length > 0) {
        response = await PUSH_CHAT.removeAdmins({
          chatId: chatId,
          admins: adminsToRemove,
          env: this.env,
          account: this.account,
          signer: this.signer,
          pgpPrivateKey: this.decryptedPgpPvtKey,
          overrideSecretKeyGeneration: !this.scalabilityV2Feature,
        });
        deltaVerificationProof = response.deltaVerificationProof;
      }

      if (membersToRemove.length > 0) {
        response = await PUSH_CHAT.removeMembers({
          chatId: chatId,
          members: membersToRemove,
          env: this.env,
          account: this.account,
          signer: this.signer,
          pgpPrivateKey: this.decryptedPgpPvtKey,
          overrideSecretKeyGeneration: !this.scalabilityV2Feature,
        });
        deltaVerificationProof = response.deltaVerificationProof;
      }
      const raw = options?.raw || false;
      const version = options?.version || 1;
      if (version === 1) {
        await this.group.info(chatId);
      } else if (version === 2) {
        const result: any = { success: true };
        if (raw && response) {
          result.raw = {
            actionVerificationProof: deltaVerificationProof,
          };
        }
        return result;
      }
      throw new Error('Invalid version specified');
    },

    modify: async (
      chatId: string,
      options: ManageGroupOptions & { raw?: boolean; version?: number }
    ) => {
      const { role, accounts } = options;
      if (!this.decryptedPgpPvtKey) {
        throw new Error(PushAPI.ensureSignerMessage());
      }
      const validRoles = ['ADMIN', 'MEMBER'];
      if (!validRoles.includes(role)) {
        throw new Error('Invalid role provided.');
      }

      if (!accounts || accounts.length === 0) {
        throw new Error('accounts array cannot be empty!');
      }

      accounts.forEach((account) => {
        if (!isValidPushCAIP(account)) {
          throw new Error(`Invalid account address: ${account}`);
        }
      });
      const raw = options?.raw || false;
      const version = options?.version || 1;
      let response: GroupInfoDTO;
      response = await PUSH_CHAT.modifyRoles({
        chatId: chatId,
        newRole: role,
        members: accounts,
        env: this.env,
        account: this.account,
        signer: this.signer,
        pgpPrivateKey: this.decryptedPgpPvtKey,
        overrideSecretKeyGeneration: !this.scalabilityV2Feature,
      });
      if (version === 1) {
        return;
      } else if (version === 2) {
        const result: any = { success: true };
        if (raw && response) {
          result.raw = {
            actionVerificationProof: response.deltaVerificationProof,
          };
        }
        return result;
      }
      throw new Error('Invalid version specified');
    },

    join: async (
      target: string,
      options?: { raw?: boolean; version?: number }
    ): Promise<void | ChatActionResponse> => {
      if (!this.decryptedPgpPvtKey) {
        throw new Error(PushAPI.ensureSignerMessage());
      }
      const status = await PUSH_CHAT.getGroupMemberStatus({
        chatId: target,
        did: this.account,
        env: this.env,
      });

      const raw = options?.raw || false;
      const version = options?.version || 1;

      let deltaVerificationProof;
      if (status.isPending) {
        const response = await PUSH_CHAT.approve({
          senderAddress: target,
          env: this.env,
          account: this.account,
          signer: this.signer,
          pgpPrivateKey: this.decryptedPgpPvtKey,
          overrideSecretKeyGeneration: !this.scalabilityV2Feature,
        });

        if (version === 1) {
          return;
        } else if (version === 2) {
          const result: ChatActionResponse = { success: true };
          if (raw) {
            result.raw = {
              actionVerificationProof: response.verificationProof || null,
            };
          }
          return result;
        }

        throw new Error('Invalid version specified');
      } else if (!status.isMember) {
        const response = await PUSH_CHAT.addMembers({
          chatId: target,
          members: [this.account],
          env: this.env,
          account: this.account,
          signer: this.signer,
          pgpPrivateKey: this.decryptedPgpPvtKey,
          overrideSecretKeyGeneration: !this.scalabilityV2Feature,
        });
        deltaVerificationProof = response.deltaVerificationProof;
      }

      if (version === 1) {
        return;
      } else if (version === 2) {
        const result: any = { success: true };
        if (raw) {
          result.raw = {
            actionVerificationProof: deltaVerificationProof,
          };
        }
        return result;
      }
      throw new Error('Invalid version specified');
    },

    leave: async (
      target: string,
      options?: { raw?: boolean; version?: number }
    ): Promise<GroupInfoDTO | GroupDTO> => {
      if (!this.decryptedPgpPvtKey) {
        throw new Error(PushAPI.ensureSignerMessage());
      }

      const status = await PUSH_CHAT.getGroupMemberStatus({
        chatId: target,
        did: this.account,
        env: this.env,
      });

      let response: GroupInfoDTO;

      if (status.isAdmin) {
        response = await PUSH_CHAT.removeAdmins({
          chatId: target,
          admins: [this.account],
          env: this.env,
          account: this.account,
          signer: this.signer,
          pgpPrivateKey: this.decryptedPgpPvtKey,
          overrideSecretKeyGeneration: !this.scalabilityV2Feature,
        });
      } else {
        response = await PUSH_CHAT.removeMembers({
          chatId: target,
          members: [this.account],
          env: this.env,
          account: this.account,
          signer: this.signer,
          pgpPrivateKey: this.decryptedPgpPvtKey,
          overrideSecretKeyGeneration: !this.scalabilityV2Feature,
        });
      }

      const raw = options?.raw || false;
      const version = options?.version || 1;
      if (version === 1) {
        if (this.scalabilityV2Feature) {
          return response;
        } else {
          return await PUSH_CHAT.getGroup({
            chatId: response.chatId,
            env: this.env,
          });
        }
      } else if (version === 2) {
        const result: any = { success: true };
        if (raw) {
          result.raw = {
            actionVerificationProof: response.deltaVerificationProof,
          };
        }
        return result;
      }
      throw new Error('Invalid version specified');
    },

    reject: async (
      target: string,
      options?: { raw?: boolean; version?: number }
    ): Promise<void | ChatActionResponse> => {
      if (!this.decryptedPgpPvtKey) {
        throw new Error(PushAPI.ensureSignerMessage());
      }
      const response = await PUSH_CHAT.reject({
        senderAddress: target,
        env: this.env,
        account: this.account,
        signer: this.signer,
        pgpPrivateKey: this.decryptedPgpPvtKey,
      });

      const raw = options?.raw || false;
      const version = options?.version || 1;

      if (version === 1) {
        return;
      } else if (version === 2) {
        const result: ChatActionResponse = { success: true };
        if (raw) {
          result.raw = {
            actionVerificationProof: response.verificationProof || null,
          };
        }
        return result;
      }
    },
  };
}
