import Constants, { ENV } from '../constants';
import {
  GroupAccess,
  GroupDTO,
  IFeeds,
  IUser,
  MessageWithCID,
  SignerType,
} from '../types';
import {
  GroupUpdateOptions,
  ChatListType,
  GroupCreationOptions,
  ManageGroupOptions,
  PushAPIInitializeProps,
  SendMessageOptions,
} from './pushAPITypes';
import * as PUSH_USER from '../user';
import * as PUSH_CHAT from '../chat';
import { getAccountAddress, getWallet } from '../chat/helpers';
import {
  GetGroupAccessType,
  addAdmins,
  addMembers,
  createGroup,
  getGroup,
  getGroupAccess,
  removeAdmins,
  removeMembers,
  send,
} from '../chat';
import { isValidETHAddress } from '../helpers';
import {
  ChatUpdateGroupProfileType,
  updateGroupProfile,
} from '../chat/updateGroupProfile';

export class PushAPI {
  private signer: SignerType;
  private account: string;
  private decryptedPgpPvtKey: string;
  private env: ENV;

  private constructor(
    signer: SignerType,
    env: ENV,
    account: string,
    decryptedPgpPvtKey: string
  ) {
    this.signer = signer;
    this.env = env;
    this.account = account;
    this.decryptedPgpPvtKey = decryptedPgpPvtKey;
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
      });
    } else {
      const newUser = await PUSH_USER.create({
        env: settings.env,
        account: derivedAccount,
        signer,
        version: settings.version,
        origin: settings.origin,
      });
      decryptedPGPPrivateKey = newUser.decryptedPrivateKey as string;
    }

    // Initialize PushAPI instance
    return new PushAPI(
      signer,
      settings.env as ENV,
      derivedAccount,
      decryptedPGPPrivateKey
    );
  }

  profile = {
    update: async (
      name?: string,
      desc?: string,
      picture?: string
    ): Promise<IUser> => {
      return await PUSH_USER.profile.update({
        pgpPrivateKey: this.decryptedPgpPvtKey,
        account: this.account,
        profile: {
          name: name,
          desc: desc,
          picture: picture,
        },
        env: this.env,
      });
    },
  };

  chat = {
    list: async (
      type: `${ChatListType}`,
      options: {
        page?: number;
        limit?: number;
      }
    ): Promise<IFeeds[]> => {
      const listParams = {
        account: this.account,
        pgpPrivateKey: this.decryptedPgpPvtKey,
        page: options.page || 1,
        limit: options.limit || 10,
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

    latest: (): void => {
      console.log('Fetching latest chat...');
    },

    history: (): void => {
      console.log('Fetching chat history...');
    },

    send: async (
      to: string,
      options: SendMessageOptions
    ): Promise<MessageWithCID> => {
      const defaultMessageType = 'Text';
      const messageType = options.type || defaultMessageType;

      const sendParams = {
        message: {
          type: messageType,
          content: options.content,
        },
        receiverAddress: to,
        signer: this.signer,
        pgpPrivateKey: this.decryptedPgpPvtKey,
        env: this.env,
      };

      const response = await send(sendParams);
      return response;
    },

    /*permissions: (): void => {
      console.warn('Fetching chat permissions... Coming Soon');
    },

    info: (): void => {
      console.warn('Fetching chat info...  Coming Soon');
    },*/

    group: {
      create: async (
        name: string,
        options: GroupCreationOptions
      ): Promise<any> => {
        const groupParams = {
          groupName: name,
          groupDescription: options.description,
          members: options.members ? options.members : [],
          groupImage: options.image,
          admins: options.admins ? options.admins : [],
          rules: {
            groupAccess: options.rules?.entry,
            chatAccess: options.rules?.chat,
          },
          isPublic: !options.private,
          signer: this.signer,
          pgpPrivateKey: this.decryptedPgpPvtKey,
          env: this.env,
        };

        const response = await createGroup(groupParams);
        return response;
      },

      permissions: async (chatId: string): Promise<GroupAccess> => {
        if (!chatId || typeof chatId !== 'string') {
          throw new Error('Invalid chatId provided.');
        }

        const getGroupAccessOptions: GetGroupAccessType = {
          chatId,
          did: this.account!,
          env: this.env,
        };

        const response = await getGroupAccess(getGroupAccessOptions);
        return response;
      },

      info: async (chatId: string): Promise<GroupDTO> => {
        console.log('Fetching group info...');
        const group = await getGroup({
          chatId: chatId,
          env: this.env,
        });
        return group;
      },

      update: async (
        chatid: string,
        options: GroupUpdateOptions
      ): Promise<GroupDTO> => {
        if (!chatid || typeof chatid !== 'string') {
          throw new Error('Invalid chatid provided.');
        }
        const env = this.env;
        const account = this.account;
        const signer = this.signer;

        if (!options.name || typeof options.name !== 'string') {
          throw new Error('Invalid group name provided.');
        }

        const updateGroupProfileOptions: ChatUpdateGroupProfileType = {
          chatId: chatid,
          groupName: options.name,
          groupImage: options.image || null,
          groupDescription: options.description || null,
          scheduleAt: options.scheduleAt,
          scheduleEnd: options.scheduleEnd,
          status: options.status,
          meta: options.meta,
          rules: options.rules,
          account,
          signer,
          env,
        };

        const response = await updateGroupProfile(updateGroupProfileOptions);

        return response;
      },

      manage: async (
        action: 'ADD' | 'REMOVE',
        options: ManageGroupOptions
      ): Promise<GroupDTO> => {
        console.log('Managing/Adjusting chat group...');

        const { chatid, role, accounts } = options;

        if (!chatid || typeof chatid !== 'string') {
          throw new Error('Invalid chatid provided.');
        }

        const validRoles = ['ADMIN', 'MEMBER'];
        if (!role || !validRoles.includes(role.toUpperCase())) {
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

        const env = this.env;
        const account = this.account;
        const signer = this.signer;

        let response;

        switch (action) {
          case 'ADD':
            if (role === 'ADMIN') {
              response = await addAdmins({
                chatId: chatid,
                admins: accounts,
                env,
                account,
                signer: signer,
              });
            } else if (role === 'MEMBER') {
              response = await addMembers({
                chatId: chatid,
                members: accounts,
                env,
                account,
                signer: signer,
              });
            }
            break;

          case 'REMOVE':
            if (role === 'ADMIN') {
              response = await removeAdmins({
                chatId: chatid,
                admins: accounts,
                env,
                account,
                signer: signer,
              });
            } else if (role === 'MEMBER') {
              response = removeMembers({
                chatId: chatid,
                members: accounts,
                env,
                account,
                signer: signer,
              });
            }
            break;

          default:
            throw new Error('Invalid action provided.');
        }
        return response;
      },
    },
  };
}
