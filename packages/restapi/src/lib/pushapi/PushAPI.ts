import Constants, { ENV } from '../constants';
import { SignerType, ProgressHookType } from '../types';
import { PushAPIInitializeProps } from './pushAPITypes';
import * as PUSH_USER from '../user';
import * as PUSH_CHAT from '../chat';
import { getAccountAddress, getWallet } from '../chat/helpers';
import { Chat } from './chat';
import { Profile } from './profile';
import { Encryption } from './encryption';
import { User } from './user';
import { PushStream } from '../pushstream/PushStream';
import { Channel } from '../pushNotification/channel';
import { Notification } from '../pushNotification/notification';
import {
  PushStreamInitializeProps,
  STREAM,
} from '../pushstream/pushStreamTypes';

export class PushAPI {
  private signer: SignerType;
  private account: string;
  private decryptedPgpPvtKey: string;
  private pgpPublicKey: string;
  private env: ENV;
  private progressHook?: (progress: ProgressHookType) => void;

  public chat: Chat; // Public instances to be accessed from outside the class
  public profile: Profile;
  public encryption: Encryption;
  private user: User;
  public stream!: PushStream;
  // Notification
  public channel!: Channel;
  public notification!: Notification;

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
    // Instantiate the notification classes
    this.channel = new Channel(this.signer, this.env, this.account);
    this.notification = new Notification(this.signer, this.env, this.account);
    // Initialize the instances of the four classes
    this.chat = new Chat(
      this.account,
      this.decryptedPgpPvtKey,
      this.env,
      this.signer,
      this.progressHook
    );
    this.profile = new Profile(
      this.account,
      this.decryptedPgpPvtKey,
      this.env,
      this.progressHook
    );
    this.encryption = new Encryption(
      this.account,
      this.decryptedPgpPvtKey,
      this.pgpPublicKey,
      this.env,
      this.signer,
      this.progressHook
    );
    this.user = new User(this.account, this.env);
  }

  static async initialize(
    signer: SignerType,
    options?: PushAPIInitializeProps
  ): Promise<PushAPI> {
    try {
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
        version: options?.version || defaultOptions.version,
        versionMeta: options?.versionMeta || defaultOptions.versionMeta,
        autoUpgrade:
          options?.autoUpgrade !== undefined
            ? options?.autoUpgrade
            : defaultOptions.autoUpgrade,
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
      const api = new PushAPI(
        signer,
        settings.env as ENV,
        derivedAccount,
        decryptedPGPPrivateKey,
        pgpPublicKey,
        settings.progressHook
      );

      return api;
    } catch (error) {
      console.error('Error initializing PushAPI:', error);
      throw error; // or handle it more gracefully if desired
    }
  }

  async initStream(
    options: PushStreamInitializeProps,
    account?: string
  ): Promise<PushStream> {
    if (this.stream) {
      throw new Error('Stream is already initialized.');
    }

    if (!options.listen || options.listen.length === 0) {
      throw new Error(
        'The listen property must have at least one STREAM type.'
      );
    }

    // Default stream options
    const defaultStreamOptions: PushStreamInitializeProps = {
      listen: options.listen,
      env: this.env,
      raw: false,
      connection: {
        auto: true,
        retries: 3,
      },
    };

    // Merge provided options with defaults
    const streamOptions = {
      ...defaultStreamOptions,
      ...options,
    };

    // Use the passed account if present, otherwise use this.account
    const accountToUse = account || this.account;

    // Use the static initialize method to create and possibly initialize the stream
    this.stream = await PushStream.initialize(
      accountToUse,
      this.decryptedPgpPvtKey,
      this.signer,
      this.progressHook,
      streamOptions
    );

    return this.stream;
  }

  async info() {
    return await PUSH_USER.get({
      account: this.account,
      env: this.env,
    });
  }
}
