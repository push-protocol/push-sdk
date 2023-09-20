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
} from '../types';
import {
  GroupUpdateOptions,
  ChatListType,
  GroupCreationOptions,
  ManageGroupOptions,
  PushAPIInitializeProps,
} from './pushAPITypes';
import * as PUSH_USER from '../user';
import * as PUSH_CHAT from '../chat';
import { getAccountAddress, getWallet } from '../chat/helpers';
import { isValidETHAddress } from '../helpers';
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
}