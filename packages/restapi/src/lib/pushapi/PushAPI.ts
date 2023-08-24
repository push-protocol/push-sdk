import Constants, { ENV } from '../constants';
import { GroupAccess, GroupDTO, IFeeds, IUser, MessageWithCID, SignerType } from '../types';
import {
  GroupUpdateOptions,
  ChatListType,
  GroupCreationOptions,
  ManageGroupOptions,
  PushAPIInitializeProps,
  SendMessageOptions,
} from './pushAPITypes';
import { upgrade } from '../../lib/user/upgradeUser';
import { get } from '../../lib/user/getUser';
import { create } from '../../lib/user/createUser';
import { getAccountAddress, getWallet } from '../chat/helpers';
import {
  GetGroupAccessType,
  addAdmins,
  addMembers,
  chats,
  createGroup,
  decryptPGPKey,
  getGroupAccess,
  removeAdmins,
  removeMembers,
  requests,
  send,
} from '../chat';
import { profileUpdate } from '../user/profile.updateUser';
import { isValidETHAddress } from '../helpers';
import {
  ChatUpdateGroupProfileType,
  updateGroupProfile,
} from '../chat/updateGroupProfile';

export class PushAPI {
  private signer: SignerType;
  private account?: string;
  private decryptedPgpPvtKey?: string;
  private env: ENV;

  private constructor(signer: SignerType, env: ENV, account: string) {
    this.signer = signer;
    this.env = env;
    this.account = account;
  }

  static async initialize(
    signer: SignerType,
    options: PushAPIInitializeProps
  ): Promise<PushAPI> {
    console.log('Initializing PushAPI...');

    const defaultOptions: PushAPIInitializeProps = {
      env: ENV.STAGING,
      version: Constants.ENC_TYPE_V3,
      autoUpgrade: true,
    };

    // Settings object which has the default values overridden by any passed options
    const settings = {
      ...defaultOptions,
      ...options,
    };
    const account = await getAccountAddress(
      getWallet({
        account: null,
        signer: signer,
      })
    );
    const instance = new PushAPI(signer, settings.env!, account);

    if (!instance.account) {
      throw new Error('Account not initialized');
    }

    try {
      const user = await get({
        account: instance.account,
        env: instance.env,
      });
      instance.decryptedPgpPvtKey = await decryptPGPKey({
        encryptedPGPPrivateKey: user.encryptedPrivateKey,
        signer: signer,
      });
    } catch (error) {
      console.log('User not found, creating a new one...');
      const newUser = await create({
        env: settings.env,
        account: instance.account,
        signer,
        version: settings.version,
        origin: options.origin,
      });

      instance.decryptedPgpPvtKey = newUser.decryptedPrivateKey;
    }

    if (settings.autoUpgrade) {
      await upgrade({
        env: settings.env,
        account: instance.account,
        signer: instance.signer,
      });
    }
    return instance;
  }

  profile = {
    update: async (
      name?: string,
      desc?: string,
      picture?: string
    ): Promise<IUser> => {
      const response = await profileUpdate({
        pgpPrivateKey: this.decryptedPgpPvtKey!,
        account: this.account!,
        profile: {
          name: name,
          desc: desc,
          picture: picture,
        },
        env: this.env,
      });

      return response;
    },
  };

  chat = {
    list: async (
      type: ChatListType,
      options: {
        page?: number;
        limit?: number;
      }
    ): Promise<IFeeds[]> => {
      const commonParams = {
        account: this.account!,
        pgpPrivateKey: this.decryptedPgpPvtKey,
        page: options.page || 1,
        limit: options.limit || 10,
        env: this.env,
        toDecrypt: true,
      };

      let response;

      if (type === 'CHATS') {
        response = await chats(commonParams);
      } else if (type === 'REQUESTS') {
        response = await requests(commonParams);
      } else {
        throw new Error('Invalid chat list type');
      }

      return response;
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

    permissions: (): void => {
      console.log('Fetching chat permissions...');
    },

    info: (): void => {
      console.log('Fetching chat info...');
    },

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

      info: (): void => {
        console.log('Fetching group info...');
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
      ): Promise<any> => {
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
