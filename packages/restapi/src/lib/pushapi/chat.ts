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
import { User } from './user';
import { updateGroupConfig } from '../chat/updateGroupConfig';
import { PushAPI } from './PushAPI';
import { ChatInfoResponse } from '../chat';
import {
  ChatAcceptResponseV2,
  ChatMemberProfileV2,
  ChatRejectionResponseV2,
  ChatMessagesListResponseV2,
  ChatMessageResponseV2,
  GroupResponseV2,
  ISendMessageResponseV2,
  UserBlockedResponseV2,
  UserUnblockedResponseV2,
  GroupAccessResponseV2,
  GroupRejectResponseV2,
  GroupJoinResponseV2,
  GroupLeaveResponseV2,
  GroupAddResponseV2,
  GroupRemoveResponseV2,
  GroupModifyResponseV2,
} from '../interfaces/ichat';
import {
  handleChatListVersion2Response,
  transformToChatMessage,
  transformToGroupV2Response,
  transformToGroupAccessV2,
  transformToGroupParticipantsV2,
} from '../helpers/transformers';
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

    const block = async (users: Array<string>): Promise<IUser> => {
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

      return response;
    };

    const blockV2 = async (
      users: Array<string>,
      options?: {
        raw?: boolean;
      }
    ): Promise<UserBlockedResponseV2> => {
      const response = await block(users);

      const raw = options?.raw || false;
      const result: UserBlockedResponseV2 = { blocked: true };

      if (raw) {
        result.raw = {
          actionVerificationProof: response.config?.configVerificationProof,
        };
      }
      return result;
    };

    block.v2 = blockV2;
    this.block = block;

    const unblock = async (users: Array<string>): Promise<IUser> => {
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
          return !userDIDs.includes(blockedUser.toLowerCase());
        }
      );

      const response = await PUSH_USER.config.update({
        pgpPrivateKey: this.decryptedPgpPvtKey,
        account: this.account,
        config: {
          blockedUsersList: user.profile.blockedUsersList,
        },
        env: this.env,
        progressHook: this.progressHook,
      });

      return response;
    };

    const unblockV2 = async (
      users: Array<string>,
      options?: {
        raw?: boolean;
      }
    ): Promise<UserUnblockedResponseV2> => {
      const response = await unblock(users);

      const raw = options?.raw || false;
      const result: UserUnblockedResponseV2 = { unblocked: true };

      if (raw) {
        result.raw = {
          actionVerificationProof: response.config?.configVerificationProof,
        };
      }
      return result;
    };

    unblock.v2 = unblockV2;
    this.unblock = unblock;

    const reject = async (target: string): Promise<any> => {
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

      return response;
    };

    const rejectV2 = async (
      target: string,
      options?: {
        raw?: boolean;
      }
    ): Promise<ChatRejectionResponseV2> => {
      const response = await reject(target);

      const raw = options?.raw || false;
      const result: ChatRejectionResponseV2 = { rejected: true };

      if (raw) {
        result.raw = {
          actionVerificationProof: response.verificationProof || null,
        };
      }
      return result;
    };

    reject.v2 = rejectV2;
    this.reject = reject;

    const accept = async (target: string): Promise<string> => {
      if (!this.decryptedPgpPvtKey) {
        throw new Error(PushAPI.ensureSignerMessage());
      }

      const response = await PUSH_CHAT.approve({
        senderAddress: target,
        env: this.env,
        account: this.account,
        signer: this.signer,
        pgpPrivateKey: this.decryptedPgpPvtKey,
        overrideSecretKeyGeneration: !this.scalabilityV2Feature,
      });

      return `${response.fromDID}+${response.toDID}`;
    };

    const acceptV2 = async (
      target: string,
      options?: {
        raw?: boolean;
      }
    ): Promise<ChatAcceptResponseV2> => {
      if (!this.decryptedPgpPvtKey) {
        throw new Error(PushAPI.ensureSignerMessage());
      }

      const response = await PUSH_CHAT.approve({
        senderAddress: target,
        env: this.env,
        account: this.account,
        signer: this.signer,
        pgpPrivateKey: this.decryptedPgpPvtKey,
        overrideSecretKeyGeneration: !this.scalabilityV2Feature,
      });

      const raw = options?.raw || false;
      const result: ChatAcceptResponseV2 = { accepted: true };

      if (raw) {
        result.raw = {
          actionVerificationProof: response.verificationProof || null,
        };
      }
      return result;
    };

    accept.v2 = acceptV2;
    this.accept = accept;

    const send = async (
      recipient: string,
      options: Message
    ): Promise<MessageWithCID> => {
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

      return response;
    };

    const sendV2 = async (
      recipient: string,
      options: Message & { raw?: boolean }
    ): Promise<ISendMessageResponseV2> => {
      const raw = options.raw || false;
      const { raw: _, ...sendOptions } = options;
      const response = await send(recipient, sendOptions);
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
    };

    send.v2 = sendV2;
    this.send = send;

    const list = async (
      type: `${ChatListType}`,
      options?: {
        page?: number;
        limit?: number;
        overrideAccount?: string;
      }
    ): Promise<IFeeds[]> => {
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

      return response as IFeeds[];
    };

    const listV2 = async (
      type: `${ChatListType}`,
      options?: {
        page?: number;
        limit?: number;
        overrideAccount?: string;
        raw?: boolean;
      }
    ): Promise<ChatMessagesListResponseV2> => {
      const raw = options?.raw || false;

      const response = await list(type, options);

      return handleChatListVersion2Response(
        response,
        type,
        raw,
        !!this.decryptedPgpPvtKey
      );
    };

    list.v2 = listV2;
    this.list = list;

    const latest = async (target: string): Promise<IMessageIPFS[]> => {
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

      const listType = intent ? 'CHATS' : 'REQUESTS';

      return latestMessages.map((message) => ({ ...message, listType }));
    };

    const latestV2 = async (
      target: string,
      options?: {
        raw?: boolean;
      }
    ): Promise<ChatMessageResponseV2> => {
      const { threadHash, intent } = await PUSH_CHAT.conversationHash({
        conversationId: target,
        account: this.account,
        env: this.env,
      });

      if (!threadHash) {
        return {} as ChatMessageResponseV2;
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
      const listType = intent ? 'CHATS' : 'REQUESTS';

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
        return {} as ChatMessageResponseV2;
      }
    };

    latest.v2 = latestV2;
    this.latest = latest;

    const history = async (
      target: string,
      options?: {
        reference?: string | null;
        limit?: number;
      }
    ): Promise<IMessageIPFS[]> => {
      let reference: string;
      const { threadHash, intent } = await PUSH_CHAT.conversationHash({
        conversationId: target,
        account: this.account,
        env: this.env,
      });
      reference = options?.reference || threadHash;

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

      return historyMessages.map((message: any) => ({ ...message, listType }));
    };

    const historyV2 = async (
      target: string,
      options?: {
        raw?: boolean;
        reference?: string | null;
        limit?: number;
      }
    ): Promise<ChatMessageResponseV2[]> => {
      const raw = options?.raw || false;

      let reference: string;
      const { threadHash, intent } = await PUSH_CHAT.conversationHash({
        conversationId: target,
        account: this.account,
        env: this.env,
      });
      reference = options?.reference || threadHash;

      if (!reference) return [];

      const toDecrypt = !!this.decryptedPgpPvtKey;

      let historyMessages = await PUSH_CHAT.history({
        account: this.account,
        env: this.env,
        threadhash: reference,
        pgpPrivateKey: this.decryptedPgpPvtKey,
        toDecrypt: toDecrypt, // Set to false if signer is undefined or null,
        limit: options?.limit,
      });
      const listType = intent ? 'CHATS' : 'REQUESTS';

      historyMessages = historyMessages.map((message: any) => ({
        ...message,
        listType,
      }));

      const chatInfo: ChatInfoResponse = await PUSH_CHAT.getChatInfo({
        recipient: target,
        account: this.account,
        env: this.env,
      });

      return historyMessages.map((message) =>
        transformToChatMessage(message, chatInfo, listType, raw, toDecrypt)
      );
    };

    history.v2 = historyV2;
    this.history = history;

    const decrypt = async (
      messagePayloads: IMessageIPFS[]
    ): Promise<IMessageIPFS[]> => {
      if (!this.decryptedPgpPvtKey) {
        throw new Error(PushAPI.ensureSignerMessage());
      }
      let connectedUser = await this.userInstance.info();

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

      return historyMessages.map((message: any) => ({
        ...message,
        listType,
      }));
    };

    const decryptV2 = async (
      messagePayloads: IMessageIPFS[],
      options?: {
        raw?: boolean;
      }
    ): Promise<ChatMessageResponseV2[]> => {
      const raw = options?.raw || false;

      if (!this.decryptedPgpPvtKey) {
        throw new Error(PushAPI.ensureSignerMessage());
      }
      let connectedUser = await this.userInstance.info();
      let historyMessages = await PUSH_CHAT.decryptConversation({
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

      historyMessages = historyMessages.map((message: any) => ({
        ...message,
        listType,
      }));

      const chatInfo: ChatInfoResponse = await PUSH_CHAT.getChatInfo({
        recipient: target,
        account: this.account,
        env: this.env,
      });

      const toDecrypt = !!this.decryptedPgpPvtKey;

      return historyMessages.map((message) =>
        transformToChatMessage(message, chatInfo, listType, raw, toDecrypt)
      );
    };

    decrypt.v2 = decryptV2;
    this.decrypt = decrypt;

    const message = async (
      target: string,
      options?: {
        reference?: string | null;
      }
    ): Promise<IMessageIPFS> => {
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

      const historyMessages = await this.history(target, {
        reference,
        limit: 1,
      });
      const listType = intent ? 'CHATS' : 'REQUESTS';

      if (historyMessages.length === 0) {
        throw new Error('Invalid reference');
      }

      const message: IMessageIPFS = historyMessages[0] as IMessageIPFS;
      return { ...message, listType } as IMessageIPFS;
    };

    const messageV2 = async (
      target: string,
      options?: {
        raw?: boolean;
        reference?: string | null;
      }
    ): Promise<ChatMessageResponseV2> => {
      const raw = options?.raw || false;

      const reference: string | null = options?.reference || null;

      const conversationData = await PUSH_CHAT.conversationHash({
        conversationId: target,
        account: this.account,
        env: this.env,
      });
      const threadHash = reference || conversationData.threadHash;
      const intent = conversationData.intent;

      if (!threadHash) {
        throw new Error('Invalid reference');
      }

      const historyMessages = await this.history(target, {
        reference: threadHash,
        limit: 1,
      });
      const listType = intent ? 'CHATS' : 'REQUESTS';

      if (historyMessages.length === 0) {
        throw new Error('Invalid reference');
      }

      const chatInfo: ChatInfoResponse = await PUSH_CHAT.getChatInfo({
        recipient: target,
        account: this.account,
        env: this.env,
      });

      const toDecrypt = !!this.decryptedPgpPvtKey;

      return transformToChatMessage(
        historyMessages[0] as IMessageIPFS,
        chatInfo,
        listType,
        raw,
        toDecrypt
      );
    };

    message.v2 = messageV2;
    this.message = message;

    const createGroup = async (
      name: string,
      options?: GroupCreationOptions
    ): Promise<GroupInfoDTO | GroupDTO> => {
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

      if (!this.scalabilityV2Feature) {
        response = await PUSH_CHAT.getGroup({
          chatId: response.chatId,
          env: this.env,
        });
      }

      return response;
    };

    const createGroupV2 = async (
      name: string,
      options?: GroupCreationOptions & { raw?: boolean }
    ): Promise<GroupResponseV2> => {
      const raw = options?.raw || false;

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

      if (!this.scalabilityV2Feature) {
        response = await PUSH_CHAT.getGroup({
          chatId: response.chatId,
          env: this.env,
        });
      }

      return transformToGroupV2Response(response, raw);
    };

    (createGroup as any).v2 = createGroupV2;

    const updateGroup = async (
      chatId: string,
      options: GroupUpdateOptions
    ): Promise<GroupInfoDTO | GroupDTO> => {
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

      if (!this.scalabilityV2Feature) {
        response = await PUSH_CHAT.getGroup({
          chatId: response.chatId,
          env: this.env,
        });
      }

      return response;
    };

    const updateGroupV2 = async (
      chatId: string,
      options: GroupUpdateOptions & { raw?: boolean }
    ): Promise<GroupResponseV2> => {
      const raw = options?.raw || false;

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

      if (!this.scalabilityV2Feature) {
        response = await PUSH_CHAT.getGroup({
          chatId: response.chatId,
          env: this.env,
        });
      }

      return transformToGroupV2Response(response, raw);
    };

    (updateGroup as any).v2 = updateGroupV2;

    const groupInfo = async (
      chatId: string,
      options?: { raw?: boolean }
    ): Promise<GroupDTO | GroupInfoDTO> => {
      let response: GroupDTO | GroupInfoDTO = this.scalabilityV2Feature
        ? await PUSH_CHAT.getGroupInfo({
            chatId: chatId,
            env: this.env,
          })
        : await PUSH_CHAT.getGroup({
            chatId: chatId,
            env: this.env,
          });
      return response;
    };

    const groupInfoV2 = async (
      chatId: string,
      options?: { raw?: boolean }
    ): Promise<GroupResponseV2> => {
      const raw = options?.raw || false;

      let response: GroupDTO | GroupInfoDTO = this.scalabilityV2Feature
        ? await PUSH_CHAT.getGroupInfo({
            chatId: chatId,
            env: this.env,
          })
        : await PUSH_CHAT.getGroup({
            chatId: chatId,
            env: this.env,
          });

      return transformToGroupV2Response(response, raw);
    };
    (groupInfo as any).v2 = groupInfoV2;

    const groupPermissions = async (chatId: string): Promise<GroupAccess> => {
      const getGroupAccessOptions: PUSH_CHAT.GetGroupAccessType = {
        chatId,
        did: this.account,
        env: this.env,
      };
      const access = await PUSH_CHAT.getGroupAccess(getGroupAccessOptions);
      return access;
    };

    const groupPermissionsV2 = async (
      chatId: string,
      options?: { raw?: boolean }
    ): Promise<GroupAccessResponseV2> => {
      const raw = options?.raw || false;

      const getGroupAccessOptions: PUSH_CHAT.GetGroupAccessType = {
        chatId,
        did: this.account,
        env: this.env,
      };
      const access = await PUSH_CHAT.getGroupAccess(getGroupAccessOptions);

      return await transformToGroupAccessV2(access, chatId, this.env, raw);
    };

    (groupPermissions as any).v2 = groupPermissionsV2;

    const addToGroup = async (
      chatId: string,
      options: ManageGroupOptions
    ): Promise<GroupInfoDTO | GroupDTO> => {
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
      return response;
    };

    const addToGroupV2 = async (
      chatId: string,
      options: ManageGroupOptions & { raw?: boolean }
    ): Promise<GroupAddResponseV2> => {
      const raw = options?.raw || false;

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

      const result: GroupAddResponseV2 = { added: true };
      if (raw) {
        result.raw = {
          actionVerificationProof: response.deltaVerificationProof,
        };
      }
      return result;
    };

    (addToGroup as any).v2 = addToGroupV2;

    const removeFromGroup = async (
      chatId: string,
      options: RemoveFromGroupOptions
    ): Promise<GroupInfoDTO | GroupDTO> => {
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
      }
      return await this.group.info(chatId);
    };

    const removeFromGroupV2 = async (
      chatId: string,
      options: RemoveFromGroupOptions & { raw?: boolean }
    ): Promise<GroupRemoveResponseV2> => {
      const raw = options?.raw || false;
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

      const result: GroupRemoveResponseV2 = { removed: true };
      if (raw && response) {
        result.raw = {
          actionVerificationProof: deltaVerificationProof,
        };
      }
      return result;
    };

    (removeFromGroup as any).v2 = removeFromGroupV2;

    const modifyGroup = async (
      chatId: string,
      options: ManageGroupOptions
    ): Promise<void> => {
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
    };

    const modifyGroupV2 = async (
      chatId: string,
      options: ManageGroupOptions & { raw?: boolean }
    ): Promise<GroupModifyResponseV2> => {
      const raw = options?.raw || false;
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

      const response = await PUSH_CHAT.modifyRoles({
        chatId: chatId,
        newRole: role,
        members: accounts,
        env: this.env,
        account: this.account,
        signer: this.signer,
        pgpPrivateKey: this.decryptedPgpPvtKey,
        overrideSecretKeyGeneration: !this.scalabilityV2Feature,
      });

      const result: GroupModifyResponseV2 = { modified: true };
      if (raw && response) {
        result.raw = {
          actionVerificationProof: response.deltaVerificationProof,
        };
      }
      return result;
    };

    (modifyGroup as any).v2 = modifyGroupV2;

    const joinGroup = async (
      target: string
    ): Promise<GroupInfoDTO | GroupDTO> => {
      if (!this.decryptedPgpPvtKey) {
        throw new Error(PushAPI.ensureSignerMessage());
      }
      const status = await PUSH_CHAT.getGroupMemberStatus({
        chatId: target,
        did: this.account,
        env: this.env,
      });

      if (status.isPending) {
        const response = await PUSH_CHAT.approve({
          senderAddress: target,
          env: this.env,
          account: this.account,
          signer: this.signer,
          pgpPrivateKey: this.decryptedPgpPvtKey,
          overrideSecretKeyGeneration: !this.scalabilityV2Feature,
        });
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
      }
      return await this.group.info(target);
    };

    const joinGroupV2 = async (
      target: string,
      options?: { raw?: boolean }
    ): Promise<GroupJoinResponseV2> => {
      const raw = options?.raw || false;
      if (!this.decryptedPgpPvtKey) {
        throw new Error(PushAPI.ensureSignerMessage());
      }
      const status = await PUSH_CHAT.getGroupMemberStatus({
        chatId: target,
        did: this.account,
        env: this.env,
      });

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

        const result: GroupJoinResponseV2 = { joined: true };
        if (raw) {
          result.raw = {
            actionVerificationProof: response.verificationProof || null,
          };
        }
        return result;
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

      const result: GroupJoinResponseV2 = { joined: true };
      if (raw) {
        result.raw = {
          actionVerificationProof: deltaVerificationProof,
        };
      }
      return result;
    };

    (joinGroup as any).v2 = joinGroupV2;

    const leaveGroup = async (
      target: string
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

      if (this.scalabilityV2Feature) {
        return response;
      } else {
        return await PUSH_CHAT.getGroup({
          chatId: response.chatId,
          env: this.env,
        });
      }
    };

    const leaveGroupV2 = async (
      target: string,
      options?: { raw?: boolean }
    ): Promise<GroupLeaveResponseV2> => {
      const raw = options?.raw || false;
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

      const result: GroupLeaveResponseV2 = { left: true };
      if (raw) {
        result.raw = {
          actionVerificationProof: response.deltaVerificationProof,
        };
      }
      return result;
    };

    (leaveGroup as any).v2 = leaveGroupV2;

    const rejectGroup = async (target: string): Promise<void> => {
      if (!this.decryptedPgpPvtKey) {
        throw new Error(PushAPI.ensureSignerMessage());
      }
      await PUSH_CHAT.reject({
        senderAddress: target,
        env: this.env,
        account: this.account,
        signer: this.signer,
        pgpPrivateKey: this.decryptedPgpPvtKey,
      });
    };

    // Define the rejectV2 method
    const rejectGroupV2 = async (
      target: string,
      options?: { raw?: boolean }
    ): Promise<GroupRejectResponseV2> => {
      const raw = options?.raw || false;
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

      const result: GroupRejectResponseV2 = { rejected: true };
      if (raw) {
        result.raw = {
          actionVerificationProof: response.verificationProof || null,
        };
      }
      return result;
    };

    // Attach the v2 method to reject
    (rejectGroup as any).v2 = rejectGroupV2;

    const groupParticipantList = async (
      chatId: string,
      options?: GetGroupParticipantsOptions
    ): Promise<{ members: ChatMemberProfile[] }> => {
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
      return { members };
    };

    // Define the listV2 method
    const groupParticipantListV2 = async (
      chatId: string,
      options?: GetGroupParticipantsOptions & { raw?: boolean }
    ): Promise<{ members: ChatMemberProfileV2[] }> => {
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

      const group = await PUSH_CHAT.getGroupInfo({
        chatId: chatId,
        env: this.env,
      });
      return await transformToGroupParticipantsV2(members, raw, group);
    };

    // Attach the v2 method to list
    (groupParticipantList as any).v2 = groupParticipantListV2;

    // Define the count method
    const groupParticipantCount = async (
      chatId: string
    ): Promise<GroupParticipantCounts> => {
      const count = await PUSH_CHAT.getGroupMemberCount({
        chatId,
        env: this.env,
      });
      return {
        participants: count.overallCount - count.pendingCount,
        pending: count.pendingCount,
      };
    };

    // Attach the v2 method to count
    (groupParticipantCount as any).v2 = groupParticipantCount;

    // Define the status method
    const groupParticipantStatus = async (
      chatId: string,
      options?: { overrideAccount?: string }
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
    };

    // Attach the v2 method to status
    (groupParticipantStatus as any).v2 = groupParticipantStatus;

    this.group = {
      create: createGroup as any,
      update: updateGroup as any,
      info: groupInfo as any,
      permissions: groupPermissions as any,
      add: addToGroup as any,
      remove: removeFromGroup as any,
      modify: modifyGroup as any,
      join: joinGroup as any,
      leave: leaveGroup as any,
      reject: rejectGroup as any,
      participants: {
        list: groupParticipantList as any,
        count: groupParticipantCount as any,
        status: groupParticipantStatus as any,
      },
    };
  }

  list!: {
    (
      type: `${ChatListType}`,
      options?: {
        page?: number;
        limit?: number;
        overrideAccount?: string;
      }
    ): Promise<IFeeds[]>;
    v2(
      type: `${ChatListType}`,
      options?: {
        page?: number;
        limit?: number;
        overrideAccount?: string;
        raw?: boolean;
      }
    ): Promise<ChatMessagesListResponseV2>;
  };

  latest!: {
    (
      target: string,
      options?: {
        raw?: boolean;
      }
    ): Promise<IMessageIPFS[]>;
    v2(
      target: string,
      options?: {
        raw?: boolean;
      }
    ): Promise<ChatMessageResponseV2>;
  };

  history!: {
    (
      target: string,
      options?: {
        reference?: string | null;
        limit?: number;
      }
    ): Promise<IMessageIPFS[]>;
    v2(
      target: string,
      options?: {
        raw?: boolean;
        reference?: string | null;
        limit?: number;
      }
    ): Promise<ChatMessageResponseV2[]>;
  };

  decrypt!: {
    (messagePayloads: IMessageIPFS[]): Promise<IMessageIPFS[]>;
    v2(
      messagePayloads: IMessageIPFS[],
      options?: {
        raw?: boolean;
      }
    ): Promise<ChatMessageResponseV2[]>;
  };

  message!: {
    (
      target: string,
      options?: {
        reference?: string | null;
      }
    ): Promise<IMessageIPFS>;
    v2(
      target: string,
      options?: {
        raw?: boolean;
        reference?: string | null;
      }
    ): Promise<ChatMessageResponseV2>;
  };

  send!: {
    (recipient: string, options: Message): Promise<MessageWithCID>;
    v2(
      recipient: string,
      options: Message & { raw?: boolean }
    ): Promise<ISendMessageResponseV2>;
  };

  reject!: {
    (
      target: string,
      options?: {
        raw?: boolean;
      }
    ): Promise<void>;
    v2(
      target: string,
      options?: {
        raw?: boolean;
      }
    ): Promise<ChatRejectionResponseV2>;
  };

  block!: {
    (
      users: Array<string>,
      options?: {
        raw?: boolean;
      }
    ): Promise<IUser>;
    v2(
      users: Array<string>,
      options?: {
        raw?: boolean;
      }
    ): Promise<UserBlockedResponseV2>;
  };

  unblock!: {
    (
      users: Array<string>,
      options?: {
        raw?: boolean;
      }
    ): Promise<IUser>;
    v2(
      users: Array<string>,
      options?: {
        raw?: boolean;
      }
    ): Promise<UserUnblockedResponseV2>;
  };

  accept!: {
    (
      target: string,
      options?: {
        raw?: boolean;
      }
    ): Promise<string>;
    v2(
      target: string,
      options?: {
        raw?: boolean;
      }
    ): Promise<ChatAcceptResponseV2>;
  };

  group!: {
    create: {
      (name: string, options?: GroupCreationOptions): Promise<
        GroupInfoDTO | GroupDTO
      >;
      v2(
        name: string,
        options?: GroupCreationOptions & { raw?: boolean }
      ): Promise<GroupResponseV2>;
    };
    update: {
      (chatId: string, options: GroupUpdateOptions): Promise<
        GroupInfoDTO | GroupDTO
      >;
      v2(
        chatId: string,
        options: GroupUpdateOptions & { raw?: boolean }
      ): Promise<GroupResponseV2>;
    };
    info: {
      (chatId: string, options?: { raw?: boolean }): Promise<
        GroupDTO | GroupInfoDTO
      >;
      v2(chatId: string, options?: { raw?: boolean }): Promise<GroupResponseV2>;
    };
    permissions: {
      (chatId: string): Promise<GroupAccess>;
      v2(
        chatId: string,
        options?: { raw?: boolean }
      ): Promise<GroupAccessResponseV2>;
    };
    add: {
      (chatId: string, options: ManageGroupOptions): Promise<
        GroupInfoDTO | GroupDTO
      >;
      v2(
        chatId: string,
        options: ManageGroupOptions & { raw?: boolean }
      ): Promise<GroupAddResponseV2>;
    };
    remove: {
      (chatId: string, options: RemoveFromGroupOptions): Promise<
        GroupInfoDTO | GroupDTO
      >;
      v2(
        chatId: string,
        options: RemoveFromGroupOptions & { raw?: boolean }
      ): Promise<GroupRemoveResponseV2>;
    };
    modify: {
      (chatId: string, options: ManageGroupOptions): Promise<void>;
      v2(
        chatId: string,
        options: ManageGroupOptions & { raw?: boolean }
      ): Promise<GroupModifyResponseV2>;
    };
    join: {
      (target: string): Promise<GroupInfoDTO | GroupDTO>;
      v2(
        target: string,
        options?: { raw?: boolean }
      ): Promise<GroupJoinResponseV2>;
    };
    leave: {
      (target: string): Promise<GroupInfoDTO | GroupDTO>;
      v2(
        target: string,
        options?: { raw?: boolean }
      ): Promise<GroupLeaveResponseV2>;
    };
    reject: {
      (target: string): Promise<void>;
      v2(
        target: string,
        options?: { raw?: boolean }
      ): Promise<GroupRejectResponseV2>;
    };
    participants: {
      list: {
        (chatId: string, options?: GetGroupParticipantsOptions): Promise<{
          members: ChatMemberProfile[];
        }>;
        v2(
          chatId: string,
          options?: GetGroupParticipantsOptions & { raw?: boolean }
        ): Promise<{ members: ChatMemberProfileV2[] }>;
      };
      count: {
        (chatId: string): Promise<GroupParticipantCounts>;
        v2(chatId: string): Promise<GroupParticipantCounts>;
      };
      status: {
        (
          chatId: string,
          options?: { overrideAccount?: string }
        ): Promise<ParticipantStatus>;
        v2(
          chatId: string,
          options?: { overrideAccount?: string }
        ): Promise<ParticipantStatus>;
      };
    };
  };

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
}
