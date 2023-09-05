import Constants, { ENCRYPTION_TYPE, ENV, MessageType } from '../constants';
import {
  ChatSendOptionsType,
  GroupAccess,
  GroupDTO,
  IFeeds,
  MessageWithCID,
  SignerType,
  Message,
  ProgressHookType,
  ISendNotificationInputOptions,
} from '../types';
import {
  GroupUpdateOptions,
  ChatListType,
  GroupCreationOptions,
  ManageGroupOptions,
  PushAPIInitializeProps,
  FeedsOptions,
  SubscriptionOptions,
  ChannelInfoOptions,
  ChannelSearchOptions,
  SubscribeUnsubscribeOptions,
  AliasOptions,
} from './pushAPITypes';
import * as PUSH_USER from '../user';
import * as PUSH_CHAT from '../chat';
import * as PUSH_PAYLOAD from '../payloads';
import * as PUSH_CHANNEL from '../channels';
import * as PUSH_ALIAS from '../alias';
import { getAccountAddress, getWallet } from '../chat/helpers';
import {
  isValidETHAddress,
  getCAIPDetails,
  getCAIPWithChainId,
} from '../helpers';
import {
  ChatUpdateGroupProfileType,
  updateGroupProfile,
} from '../chat/updateGroupProfile';
export class PushAPI {
  private signer: SignerType;
  private account: string;
  private decryptedPgpPvtKey: string;
  private pgpPublicKey: string;

  private env: ENV;
  private progressHook?: (progress: ProgressHookType) => void;

  private constructor(
    signer: SignerType,
    env: ENV,
    account: string,
    decryptedPgpPvtKey: string,
    pgpPublicKey: string,
    progressHook?: (progress: ProgressHookType) => void
  ) {
    this.signer = signer;
    this.env = env;
    this.account = account;
    this.decryptedPgpPvtKey = decryptedPgpPvtKey;
    this.pgpPublicKey = pgpPublicKey;
    this.progressHook = progressHook;
  }

  static async initialize(
    signer: SignerType,
    options?: PushAPIInitializeProps
  ): Promise<PushAPI> {
    // Default options
    const defaultOptions: PushAPIInitializeProps = {
      env: ENV.STAGING,
      version: Constants.ENC_TYPE_V3,
      autoUpgrade: true,
      account: null,
    };

    // Settings object
    // Default options are overwritten by the options passed in the initialize method
    const settings = {
      ...defaultOptions,
      ...options,
    };

    // Get account
    // Derives account from signer if not provided
    const derivedAccount = await getAccountAddress(
      getWallet({
        account: settings.account as string | null,
        signer: signer,
      })
    );

    let decryptedPGPPrivateKey: string;
    let pgpPublicKey: string;

    /**
     * Decrypt PGP private key
     * If user exists, decrypts the PGP private key
     * If user does not exist, creates a new user and returns the decrypted PGP private key
     */
    const user = await PUSH_USER.get({
      account: derivedAccount,
      env: settings.env,
    });
    if (user && user.encryptedPrivateKey) {
      decryptedPGPPrivateKey = await PUSH_CHAT.decryptPGPKey({
        encryptedPGPPrivateKey: user.encryptedPrivateKey,
        signer: signer,
        toUpgrade: settings.autoUpgrade,
        additionalMeta: settings.versionMeta,
        progressHook: settings.progressHook,
        env: settings.env,
      });
      pgpPublicKey = user.publicKey;
    } else {
      const newUser = await PUSH_USER.create({
        env: settings.env,
        account: derivedAccount,
        signer,
        version: settings.version,
        additionalMeta: settings.versionMeta,
        origin: settings.origin,
        progressHook: settings.progressHook,
      });
      decryptedPGPPrivateKey = newUser.decryptedPrivateKey as string;
      pgpPublicKey = newUser.publicKey;
    }

    // Initialize PushAPI instance
    return new PushAPI(
      signer,
      settings.env as ENV,
      derivedAccount,
      decryptedPGPPrivateKey,
      pgpPublicKey,
      settings.progressHook
    );
  }

  info = async () => {
    return await PUSH_USER.get({
      account: this.account,
      env: this.env,
    });
  };

  profile = {
    info: async () => {
      const response = await PUSH_USER.get({
        account: this.account,
        env: this.env,
      });
      return response.profile;
    },

    update: async (options: {
      name?: string;
      desc?: string;
      picture?: string;
    }) => {
      const { name, desc, picture } = options;
      const response = await PUSH_USER.profile.update({
        pgpPrivateKey: this.decryptedPgpPvtKey,
        account: this.account,
        profile: {
          name: name,
          desc: desc,
          picture: picture,
        },
        env: this.env,
        progressHook: this.progressHook,
      });
      return response.profile;
    },
  };

  chat = {
    list: async (
      type: `${ChatListType}`,
      options?: {
        /**
         * @default 1
         */
        page?: number;
        limit?: number;
      }
    ): Promise<IFeeds[]> => {
      const listParams = {
        account: this.account,
        pgpPrivateKey: this.decryptedPgpPvtKey,
        page: options?.page,
        limit: options?.limit,
        env: this.env,
        toDecrypt: true,
      };

      switch (type) {
        case ChatListType.CHATS:
          return await PUSH_CHAT.chats(listParams);
        case ChatListType.REQUESTS:
          return await PUSH_CHAT.requests(listParams);
        default:
          throw new Error('Invalid Chat List Type');
      }
    },

    latest: async (target: string) => {
      const { threadHash } = await PUSH_CHAT.conversationHash({
        conversationId: target,
        account: this.account,
        env: this.env,
      });
      if (!threadHash) return {};

      return await PUSH_CHAT.latest({
        threadhash: threadHash,
        toDecrypt: true,
        pgpPrivateKey: this.decryptedPgpPvtKey,
        account: this.account,
        env: this.env,
      });
    },

    history: async (
      target: string,
      options?: {
        reference?: string | null;
        limit?: number;
      }
    ) => {
      let reference: string;

      if (!options?.reference) {
        const { threadHash } = await PUSH_CHAT.conversationHash({
          conversationId: target,
          account: this.account,
          env: this.env,
        });
        reference = threadHash;
      } else {
        reference = options.reference;
      }

      if (!reference) return [];

      return await PUSH_CHAT.history({
        account: this.account,
        env: this.env,
        threadhash: reference,
        pgpPrivateKey: this.decryptedPgpPvtKey,
        toDecrypt: true,
        limit: options?.limit,
      });
    },

    send: async (target: string, options: Message): Promise<MessageWithCID> => {
      if (!options.type) {
        options.type = MessageType.TEXT;
      }
      const sendParams: ChatSendOptionsType = {
        message: options,
        to: target,
        signer: this.signer,
        pgpPrivateKey: this.decryptedPgpPvtKey,
        env: this.env,
      };
      return await PUSH_CHAT.send(sendParams);
    },

    accept: async (target: string): Promise<string> => {
      return await PUSH_CHAT.approve({
        senderAddress: target,
        env: this.env,
        account: this.account,
        signer: this.signer,
        pgpPrivateKey: this.decryptedPgpPvtKey,
      });
    },

    reject: async (target: string): Promise<string> => {
      return await PUSH_CHAT.approve({
        status: 'Reproved',
        senderAddress: target,
        env: this.env,
        account: this.account,
        signer: this.signer,
        pgpPrivateKey: this.decryptedPgpPvtKey,
      });
    },

    group: {
      create: async (name: string, options?: GroupCreationOptions) => {
        const groupParams: PUSH_CHAT.ChatCreateGroupType = {
          groupName: name,
          groupDescription: options?.description,
          members: options?.members ? options.members : [],
          groupImage: options?.image,
          admins: options?.admins ? options.admins : [],
          rules: {
            groupAccess: options?.rules?.entry,
            chatAccess: options?.rules?.chat,
          },
          isPublic: options?.private || false,
          signer: this.signer,
          pgpPrivateKey: this.decryptedPgpPvtKey,
          env: this.env,
        };

        return await PUSH_CHAT.createGroup(groupParams);
      },

      permissions: async (chatId: string): Promise<GroupAccess> => {
        const getGroupAccessOptions: PUSH_CHAT.GetGroupAccessType = {
          chatId,
          did: this.account,
          env: this.env,
        };
        return await PUSH_CHAT.getGroupAccess(getGroupAccessOptions);
      },

      info: async (chatId: string): Promise<GroupDTO> => {
        return await PUSH_CHAT.getGroup({
          chatId: chatId,
          env: this.env,
        });
      },

      update: async (
        chatId: string,
        options: GroupUpdateOptions
      ): Promise<GroupDTO> => {
        // Fetch Group Details
        const group = await PUSH_CHAT.getGroup({
          chatId: chatId,
          env: this.env,
        });
        if (!group) {
          throw new Error('Group not found');
        }

        const updateGroupProfileOptions: ChatUpdateGroupProfileType = {
          chatId: chatId,
          groupName: options.name ? options.name : group.groupName,
          groupImage: options.image ? options.image : group.groupImage,
          groupDescription: options.description
            ? options.description
            : group.groupDescription,
          scheduleAt: options.scheduleAt
            ? options.scheduleAt
            : group.scheduleAt,
          scheduleEnd: options.scheduleEnd
            ? options.scheduleEnd
            : group.scheduleEnd,
          status: options.status ? options.status : group.status,
          meta: options.meta ? options.meta : group.meta,
          rules: options.rules ? options.rules : group.rules,
          account: this.account,
          pgpPrivateKey: this.decryptedPgpPvtKey,
          env: this.env,
        };
        return await updateGroupProfile(updateGroupProfileOptions);
      },

      add: async (chatId: string, options: ManageGroupOptions) => {
        const { role, accounts } = options;

        const validRoles = ['ADMIN', 'MEMBER'];
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

        if (role === 'ADMIN') {
          return await PUSH_CHAT.addAdmins({
            chatId: chatId,
            admins: accounts,
            env: this.env,
            account: this.account,
            signer: this.signer,
            pgpPrivateKey: this.decryptedPgpPvtKey,
          });
        } else {
          return await PUSH_CHAT.addMembers({
            chatId: chatId,
            members: accounts,
            env: this.env,
            account: this.account,
            signer: this.signer,
            pgpPrivateKey: this.decryptedPgpPvtKey,
          });
        }
      },

      remove: async (chatId: string, options: ManageGroupOptions) => {
        const { role, accounts } = options;

        const validRoles = ['ADMIN', 'MEMBER'];
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

        if (role === 'ADMIN') {
          return await PUSH_CHAT.removeAdmins({
            chatId: chatId,
            admins: accounts,
            env: this.env,
            account: this.account,
            signer: this.signer,
            pgpPrivateKey: this.decryptedPgpPvtKey,
          });
        } else {
          return await PUSH_CHAT.removeMembers({
            chatId: chatId,
            members: accounts,
            env: this.env,
            account: this.account,
            signer: this.signer,
            pgpPrivateKey: this.decryptedPgpPvtKey,
          });
        }
      },

      join: async (target: string): Promise<GroupDTO> => {
        return await PUSH_CHAT.addMembers({
          chatId: target,
          members: [this.account],
          env: this.env,
          account: this.account,
          signer: this.signer,
          pgpPrivateKey: this.decryptedPgpPvtKey,
        });
      },

      leave: async (target: string): Promise<GroupDTO> => {
        return await PUSH_CHAT.removeMembers({
          chatId: target,
          members: [this.account],
          env: this.env,
          account: this.account,
          signer: this.signer,
          pgpPrivateKey: this.decryptedPgpPvtKey,
        });
      },
    },
  };

  encryption = {
    info: async () => {
      const userInfo = await this.info();
      const decryptedPassword = await PUSH_USER.decryptAuth({
        account: this.account,
        env: this.env,
        signer: this.signer,
        progressHook: this.progressHook,
        additionalMeta: {
          NFTPGP_V1: {
            encryptedPassword: JSON.stringify(
              JSON.parse(userInfo.encryptedPrivateKey).encryptedPassword
            ),
          },
        },
      });

      return {
        decryptedPgpPrivateKey: this.decryptedPgpPvtKey,
        pgpPublicKey: this.pgpPublicKey,
        ...(decryptedPassword !== undefined && decryptedPassword !== null
          ? { decryptedPassword: decryptedPassword }
          : {}),
      };
    },

    update: async (
      updatedEncryptionType: ENCRYPTION_TYPE,
      options?: {
        versionMeta?: {
          NFTPGP_V1?: { password: string };
        };
      }
    ) => {
      return await PUSH_USER.auth.update({
        account: this.account,
        pgpEncryptionVersion: updatedEncryptionType,
        additionalMeta: options?.versionMeta,
        progressHook: this.progressHook,
        signer: this.signer,
        env: this.env,
        pgpPrivateKey: this.decryptedPgpPvtKey,
        pgpPublicKey: this.pgpPublicKey,
      });
    },
  };

  user = {
    /**
     * @description - Fetches feeds and spam feeds for a specific user
     * @param {string} [options.user] - user address, defaults to address from signer
     * @param {number} [options.page] -  page number. default is set to Constants.PAGINATION.INITIAL_PAGE
     * @param {number} [options.limit] - number of feeds per page. default is set to Constants.PAGINATION.LIMIT
     * @param {boolean} [options.spam] - indicates if its a spam or not. default to non-spam feeds
     * @param {boolean} [options.raw] - indicates if the response should be raw or formatted. defaults is set to false
     * @returns feeds for a specific address
     */
    feeds: async (options: FeedsOptions) => {
      const {
        user = this.account,
        page = Constants.PAGINATION.INITIAL_PAGE,
        limit = Constants.PAGINATION.LIMIT,
        spam = false,
        raw = false,
      } = options || {};

      return await PUSH_USER.getFeeds({
        user: user,
        page: page,
        limit: limit,
        spam: spam,
        raw: raw,
        env: this.env,
      });
    },

    /**
     * @description - fetches all the channels a user is subscribed to
     * @param {string} [options.user] -  user address, defaults to address from signer
     * @returns the channels to which the user is subscribed
     */
    subscriptions: async (options: SubscriptionOptions) => {
      const { user = this.account } = options || {};
      return await PUSH_USER.getSubscriptions({
        user: user,
        env: this.env,
      });
    },
  };

  channels = {
    /**
     * @description - returns information about a channel
     * @param {string} [options.channel] - channel address, defaults to eth caip address
     * @returns information about the channel if it exists
     */
    info: async (options: ChannelInfoOptions) => {
      const { channel = this.account } = options || {};
      return await PUSH_CHANNEL.getChannel({
        channel: channel as string,
        env: this.env,
      });
    },

    /**
     * @description - returns relevant information as per the query that was passed
     * @param {string} options.query - search query
     * @param {number} [options.page] -  page number. default is set to Constants.PAGINATION.INITIAL_PAGE
     * @param {number} [options.limit] - number of feeds per page. default is set to Constants.PAGINATION.LIMIT
     * @returns Array of results relevant to the serach query
     */
    search: async (options: ChannelSearchOptions) => {
      const {
        query,
        page = Constants.PAGINATION.INITIAL_PAGE,
        limit = Constants.PAGINATION.LIMIT,
      } = options || {};
      return await PUSH_CHANNEL.search({
        query: query,
        page: page,
        limit: limit,
        env: this.env,
      });
    },

    /**
     * Subscribes a user to a channel
     * @param {string} options.channelAddress - channel address in caip format
     * @param {string} [options.verifyingContractAddress] - verifying contract address
     * @param {function} [options.onSuccess] - callback function when a user successfully subscribes to a channel
     * @param {function} [options.onError] - callback function incase a user was not able to subscribe to a channel
     * @returns Status object
     */
    subscribe: async (options: SubscribeUnsubscribeOptions) => {
      const { channelAddress, verifyingContractAddress, onSuccess, onError } =
        options || {};
      const caipDetail = getCAIPDetails(channelAddress);
      const userAddressInCaip = getCAIPWithChainId(
        this.account,
        parseInt(caipDetail?.networkId as string)
      );
      return await PUSH_CHANNEL.subscribe({
        signer: this.signer,
        channelAddress: channelAddress,
        userAddress: userAddressInCaip,
        verifyingContractAddress: verifyingContractAddress,
        env: this.env,
        onSuccess: onSuccess,
        onError: onError,
      });
    },
    /**
     * Unsubscribes a user to a channel
     * @param {string} options.channelAddress - channel address in caip format
     * @param {string} [options.verifyingContractAddress] - verifying contract address
     * @param {function} [options.onSuccess] - callback function when a user successfully unsubscribes to a channel
     * @param {function} [options.onError] - callback function incase a user was not able to unsubscribe to a channel
     * @returns 
     */
    unsubscribe: async (options: SubscribeUnsubscribeOptions) => {
      const { channelAddress, verifyingContractAddress, onSuccess, onError } =
        options || {};
      const caipDetail = getCAIPDetails(channelAddress);
      const userAddressInCaip = getCAIPWithChainId(
        this.account,
        parseInt(caipDetail?.networkId as string)
      );
      return await PUSH_CHANNEL.unsubscribe({
        signer: this.signer,
        channelAddress: channelAddress,
        userAddress: userAddressInCaip,
        verifyingContractAddress: verifyingContractAddress,
        env: this.env,
        onSuccess: onSuccess,
        onError: onError,
      });
    },
    /**
     * @description - Get subscribers of a channell
     * @param {string} [options.channel] - channel in caip. defaults to account from signer with eth caip 
     * @returns array of subscribers
     */
    _subscribers: async (options: ChannelInfoOptions) => {
      const { channel = this.account } = options || {};
      return await PUSH_CHANNEL._getSubscribers({
        channel: channel,
        env: this.env,
      });
    },

    /**
     * @description - Get delegates of a channell
     * @param {string} [options.channel] - channel in caip. defaults to account from signer with eth caip 
     * @returns array of subscribers
     */
    delegates: async (options: ChannelInfoOptions) => {
      const { channel = this.account } = options || {};
      return await PUSH_CHANNEL.getDelegates({
        channel: channel,
        env: this.env,
      });
    },
  };

  payloads = {
    /**
     * @description - sends notification
     * @param {ISendNotificationInputOptions} options parameters related to payload
     * @returns 
     */
    send: async (
      options: Omit<ISendNotificationInputOptions, 'signer' | 'env'>
    ) => {
      return await PUSH_PAYLOAD.sendNotification({
        ...options,
        signer: this.signer,
        env: this.env,
      });
    },
  };

  alias = {
    /**
     * @description - fetches alias information
     * @param {AliasOptions} options - options related to alias
     * @returns Alias details
     */
    info: async (options: AliasOptions) => {
      return await PUSH_ALIAS.getAliasInfo({ ...options, env: this.env });
    },
  };
}
