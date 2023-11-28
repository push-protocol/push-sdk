import { ENV } from '../constants';
import {
  SignerType,
  ProgressHookType,
  SpaceInfoDTO,
  GroupInfoDTO,
  SpaceAccess,
  SpaceIFeeds,
  IFeeds,
  Message,
  MessageWithCID,
  IMessageIPFS,
  GroupParticipantCounts,
  ChatMemberProfile,
  SpaceMemberProfile,
} from '../types';
import {
  GetGroupParticipantsOptions,
  ManageSpaceOptions,
  RemoveFromSpaceOptions,
  SpaceCreationOptions,
  SpaceListType,
  SpaceParticipantStatus,
  SpaceQueryOptions,
  SpaceUpdateOptions,
} from './pushAPITypes';
import * as PUSH_SPACE from '../space';
import * as PUSH_CHAT from '../chat';

import { User } from './user';
import { PushAPI } from './PushAPI';
import {
  ChatUpdateGroupProfileType,
  updateGroupProfile,
} from '../chat/updateGroupProfile';
import { updateGroupConfig } from '../chat/updateGroupConfig';
import { groupInfoDtoToSpaceInfoDto, mapSpaceListTypeToChatListType } from '../chat';
import { isValidETHAddress } from '../helpers';
import { Chat } from './chat';

export class Space {
  private chatInstance: Chat;

  constructor(
    private account: string,
    private env: ENV,
    private decryptedPgpPvtKey?: string,
    private signer?: SignerType,
    private progressHook?: (progress: ProgressHookType) => void
  ) {
    this.chatInstance = new Chat(
      this.account,
      this.env,
      { feature: [] },
      this.decryptedPgpPvtKey,
      this.signer
    );
  }

  async create(
    name: string,
    options: SpaceCreationOptions
  ): Promise<SpaceInfoDTO> {
    if (!this.signer) {
      throw new Error('Signer is required to create a space.');
    }

    const createSpaceOptions: PUSH_SPACE.ChatCreateSpaceTypeV2 = {
      signer: this.signer,
      pgpPrivateKey: this.decryptedPgpPvtKey,
      spaceName: name,
      spaceDescription: options.description || null,
      listeners: options.participants.listeners,
      speakers: options.participants.speakers,
      spaceImage: options.image || null,
      isPublic: !options.private,
      rules: options.rules || null,
      config: {
        scheduleAt: options.schedule.start,
        scheduleEnd: options.schedule.end || null,
      },
      env: this.env,
    };
    return await PUSH_SPACE.createV2(createSpaceOptions);
  }

  async update(
    spaceId: string,
    options: SpaceUpdateOptions
  ): Promise<SpaceInfoDTO> {
    if (!this.signer) {
      throw new Error(PushAPI.ensureSignerMessage());
    }
    let group = null;

    try {
      group = await PUSH_CHAT.getGroupInfo({
        chatId: spaceId,
        env: this.env,
      });
      if (!group) {
        throw new Error('Space not found');
      }
    } catch (error) {
      throw new Error('Space not found');
    }

    const updateGroupProfileOptions: ChatUpdateGroupProfileType = {
      chatId: spaceId,
      groupName: options.name ? options.name : group.groupName,
      groupDescription: options.description
        ? options.description
        : group.groupDescription,
      groupImage: options.image ? options.image : group.groupImage,
      rules: options.rules ? options.rules : group.rules,
      account: this.account,
      pgpPrivateKey: this.decryptedPgpPvtKey,
      env: this.env,
    };
    const updateGroupConfigOptions = {
      chatId: spaceId,
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
    const groupDto = await updateGroupConfig(updateGroupConfigOptions);
    return groupInfoDtoToSpaceInfoDto(groupDto);
  }

  async info(spaceId: string): Promise<SpaceInfoDTO> {
    const groupDto = await PUSH_CHAT.getGroupInfo({
      chatId: spaceId,
      env: this.env,
    });
    return groupInfoDtoToSpaceInfoDto(groupDto);
  }

  participants = {
    list: async (
      chatId: string,
      options?: GetGroupParticipantsOptions
    ): Promise<{ members: SpaceMemberProfile[] }> => {
      const { page = 1, limit = 20 } = options ?? {};
      const getGroupMembersOptions: PUSH_CHAT.FetchChatGroupInfoType = {
        chatId,
        page,
        limit,
        env: this.env,
      };

      const chatMembers = await PUSH_CHAT.getGroupMembers(
        getGroupMembersOptions
      );
      const members: SpaceMemberProfile[] = chatMembers.map(
        (member: ChatMemberProfile): SpaceMemberProfile => {
          return {
            address: member.address,
            intent: member.intent,
            role:
              member.role.toUpperCase() === 'ADMIN' ? 'SPEAKER' : 'LISTENER',
            userInfo: member.userInfo,
          };
        }
      );
      return { members };
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
      accountId: string
    ): Promise<SpaceParticipantStatus> => {
      const status = await PUSH_CHAT.getGroupMemberStatus({
        chatId: chatId,
        did: accountId,
        env: this.env,
      });

      return {
        pending: status.isPending,
        role: status.isAdmin ? 'SPEAKER' : 'LISTENER',
        participant: status.isMember,
      };
    },
  };

  async permissions(spaceId: string): Promise<SpaceAccess> {
    const getGroupAccessOptions: PUSH_CHAT.GetGroupAccessType = {
      chatId: spaceId,
      did: this.account,
      env: this.env,
    };
    return await PUSH_CHAT.getGroupAccess(getGroupAccessOptions);
  }

  async add(
    spaceId: string,
    options: ManageSpaceOptions
  ): Promise<SpaceInfoDTO> {
    if (!this.signer) {
      throw new Error(PushAPI.ensureSignerMessage());
    }
    const { role, accounts } = options;

    const validRoles = ['SPEAKER', 'LISTENER'];
    if (!validRoles.includes(role)) {
      throw new Error('Invalid role provided.');
    }

    if (!accounts || accounts.length === 0) {
      throw new Error('accounts array cannot be empty!');
    }

    accounts.forEach((account) => {
      if (!isValidETHAddress(account)) {
        throw new Error(`Invalid account address: ${account}`);
      }
    });

    let response: GroupInfoDTO;
    if (role === 'SPEAKER') {
      response = await PUSH_CHAT.addAdmins({
        chatId: spaceId,
        admins: accounts,
        env: this.env,
        account: this.account,
        signer: this.signer,
        pgpPrivateKey: this.decryptedPgpPvtKey,
        overrideSecretKeyGeneration: false,
      });
    } else {
      response = await PUSH_CHAT.addMembers({
        chatId: spaceId,
        members: accounts,
        env: this.env,
        account: this.account,
        signer: this.signer,
        pgpPrivateKey: this.decryptedPgpPvtKey,
        overrideSecretKeyGeneration: false,
      });
    }
    return groupInfoDtoToSpaceInfoDto(response);
  }

  async remove(
    spaceId: string,
    options: RemoveFromSpaceOptions
  ): Promise<SpaceInfoDTO> {
    const { accounts } = options;

    if (!this.signer) {
      throw new Error(PushAPI.ensureSignerMessage());
    }

    if (!accounts || accounts.length === 0) {
      throw new Error('Accounts array cannot be empty!');
    }

    accounts.forEach((account) => {
      if (!isValidETHAddress(account)) {
        throw new Error(`Invalid account address: ${account}`);
      }
    });

    const adminsToRemove = [];
    const membersToRemove = [];

    for (const account of accounts) {
      const status = await PUSH_CHAT.getGroupMemberStatus({
        chatId: spaceId,
        did: account,
        env: this.env,
      });

      if (status.isAdmin) {
        adminsToRemove.push(account);
      } else if (status.isMember) {
        membersToRemove.push(account);
      }
    }
    if (adminsToRemove.length > 0) {
      await PUSH_CHAT.removeAdmins({
        chatId: spaceId,
        admins: adminsToRemove,
        env: this.env,
        account: this.account,
        signer: this.signer,
        pgpPrivateKey: this.decryptedPgpPvtKey,
        overrideSecretKeyGeneration: false,
      });
    }

    if (membersToRemove.length > 0) {
      await PUSH_CHAT.removeMembers({
        chatId: spaceId,
        members: membersToRemove,
        env: this.env,
        account: this.account,
        signer: this.signer,
        pgpPrivateKey: this.decryptedPgpPvtKey,
        overrideSecretKeyGeneration: false,
      });
    }
    return await this.info(spaceId);
  }

  async modify(
    spaceId: string,
    options: ManageSpaceOptions
  ): Promise<SpaceInfoDTO> {
    const { role, accounts } = options;
    if (!this.signer) {
      throw new Error(PushAPI.ensureSignerMessage());
    }
    const validRoles = ['SPEAKER', 'LISTENER'];
    if (!validRoles.includes(role)) {
      throw new Error('Invalid role provided.');
    }

    if (!accounts || accounts.length === 0) {
      throw new Error('accounts array cannot be empty!');
    }

    accounts.forEach((account) => {
      if (!isValidETHAddress(account)) {
        throw new Error(`Invalid account address: ${account}`);
      }
    });

    let newRole = null;

    if (role === 'SPEAKER') {
      newRole = 'ADMIN';
    } else {
      newRole = 'MEMBER';
    }
    const response = await PUSH_CHAT.modifyRoles({
      chatId: spaceId,
      newRole: newRole as 'ADMIN' | 'MEMBER',
      members: accounts,
      env: this.env,
      account: this.account,
      signer: this.signer,
      pgpPrivateKey: this.decryptedPgpPvtKey,
      overrideSecretKeyGeneration: false,
    });
    return groupInfoDtoToSpaceInfoDto(response);
  }

  async join(spaceId: string): Promise<SpaceInfoDTO> {
    if (!this.signer) {
      throw new Error(PushAPI.ensureSignerMessage());
    }
    const status = await PUSH_CHAT.getGroupMemberStatus({
      chatId: spaceId,
      did: this.account,
      env: this.env,
    });

    if (status.isPending) {
      await PUSH_CHAT.approve({
        senderAddress: spaceId,
        env: this.env,
        account: this.account,
        signer: this.signer,
        pgpPrivateKey: this.decryptedPgpPvtKey,
        overrideSecretKeyGeneration: false,
      });
    } else if (!status.isMember) {
      await PUSH_CHAT.addMembers({
        chatId: spaceId,
        members: [this.account],
        env: this.env,
        account: this.account,
        signer: this.signer,
        pgpPrivateKey: this.decryptedPgpPvtKey,
        overrideSecretKeyGeneration: false,
      });
    }
    return await this.info(spaceId);
  }

  async leave(spaceId: string): Promise<SpaceInfoDTO> {
    if (!this.signer) {
      throw new Error(PushAPI.ensureSignerMessage());
    }

    const status = await PUSH_CHAT.getGroupMemberStatus({
      chatId: spaceId,
      did: this.account,
      env: this.env,
    });

    let response: GroupInfoDTO;

    if (status.isAdmin) {
      response = await PUSH_CHAT.removeAdmins({
        chatId: spaceId,
        admins: [this.account],
        env: this.env,
        account: this.account,
        signer: this.signer,
        pgpPrivateKey: this.decryptedPgpPvtKey,
        overrideSecretKeyGeneration: false,
      });
    } else {
      response = await PUSH_CHAT.removeMembers({
        chatId: spaceId,
        members: [this.account],
        env: this.env,
        account: this.account,
        signer: this.signer,
        pgpPrivateKey: this.decryptedPgpPvtKey,
        overrideSecretKeyGeneration: false,
      });
    }
    return groupInfoDtoToSpaceInfoDto(response);
  }

  async search(
    term: string,
    options?: SpaceQueryOptions
  ): Promise<SpaceInfoDTO[]> {
    const { page = 1, limit = 20 } = options ?? {};
    const response = await PUSH_SPACE.search({
      searchTerm: term,
      pageNumber: page,
      pageSize: limit,
      env: this.env,
    });
    return response.map((space) => PUSH_CHAT.spaceDtoToSpaceInfoDto(space));
  }

  async trending(options?: SpaceQueryOptions): Promise<SpaceIFeeds[]> {
    const { page = 1, limit = 20 } = options ?? {};
    const response = await PUSH_SPACE.trending({
      page: page,
      limit: limit,
      env: this.env,
    });
    return response;
  }

  async list(
    type: SpaceListType,
    options?: {
      /**
       * @default 1
       */
      page?: number;
      limit?: number;
      overrideAccount?: string;
    }
  ): Promise<IFeeds[]> {
    const chatListType = mapSpaceListTypeToChatListType(type);
    return this.chatInstance.list(chatListType, options);
  }

  async accept(spaceId: string): Promise<string> {
    if (!this.signer) {
      throw new Error(PushAPI.ensureSignerMessage());
    }
    return this.chatInstance.accept(spaceId);
  }

  async reject(spaceId: string): Promise<void> {
    if (!this.signer) {
      throw new Error(PushAPI.ensureSignerMessage());
    }
    return this.chatInstance.reject(spaceId);
  }

  get chat() {
    return {
      send: async (
        recipient: string,
        options: Message
      ): Promise<MessageWithCID> => {
        return this.chatInstance.send(recipient, options);
      },
      decrypt: async (messages: IMessageIPFS[]) => {
        if (!this.signer) {
          throw new Error(PushAPI.ensureSignerMessage());
        }
        return await this.chatInstance.decrypt(messages);
      },
      latest: async (target: string) => {
        return await this.chatInstance.latest(target);
      },
      history: async (
        target: string,
        options?: { reference?: string | null; limit?: number }
      ) => {
        return await this.chatInstance.history(target, options);
      },
    };
  }
}
