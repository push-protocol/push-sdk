import Constants, { ENV } from '../constants';
import { IFeeds, IUser, MessageWithCID, ProgressHookType, SignerType } from '../types';
import { ChatListType, PushAPIInitializeProps, SendMessageOptions } from './pushAPITypes';
import { upgrade } from '../../lib/user/upgradeUser';
import { get } from '../../lib/user/getUser';
import { create } from '../../lib/user/createUser';
import { getAccountAddress, getWallet } from '../chat/helpers';
import { chats, decryptPGPKey, requests, send } from '../chat';
import { profileUpdate } from '../user/profile.updateUser';

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
    const settings = { ...defaultOptions, ...options };
    const account = await getAccountAddress(
      getWallet({ account: null, signer: signer })
    );
    const instance = new PushAPI(signer, settings.env!, account);

    if (!instance.account) {
      throw new Error('Account not initialized');
    }

    try {
      const user = await get({ account: instance.account, env: instance.env });
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
        env: this.env
      });

      return response;
    },
  };

  chat = {
    list: async (
      type: ChatListType,
      options: { page?: number; limit?: number }
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
      permissions: (): void => {
        console.log('Fetching group permissions...');
      },

      info: (): void => {
        console.log('Fetching group info...');
      },

      create: (): void => {
        console.log('Creating chat group...');
      },

      update: (): void => {
        console.log('Updating chat group...');
      },

      manage: (): void => {
        console.log('Managing/Adjusting chat group...');
      },
    }
  };
}
