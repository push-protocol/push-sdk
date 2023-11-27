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
  private signer?: SignerType;
  private readMode: boolean;
  private account: string;
  private decryptedPgpPvtKey?: string;
  private pgpPublicKey?: string;
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
    env: ENV,
    account: string,
    readMode: boolean,
    decryptedPgpPvtKey?: string,
    pgpPublicKey?: string,
    signer?: SignerType,
    progressHook?: (progress: ProgressHookType) => void
  ) {
    this.signer = signer;
    this.readMode = readMode;
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
      this.env,
      this.decryptedPgpPvtKey,
      this.signer,
      this.progressHook
    );
    this.profile = new Profile(
      this.account,
      this.env,
      this.decryptedPgpPvtKey,
      this.progressHook
    );
    this.encryption = new Encryption(
      this.account,
      this.env,
      this.decryptedPgpPvtKey,
      this.pgpPublicKey,
      this.signer,
      this.progressHook
    );
    this.user = new User(this.account, this.env);
  }
  // Overloaded initialize method signatures
  static async initialize(
    signer?: SignerType,
    options?: PushAPIInitializeProps
  ): Promise<PushAPI>;
  static async initialize(options?: PushAPIInitializeProps): Promise<PushAPI>;

  static async initialize(...args: any[]): Promise<PushAPI> {
    try {
      let signer: SignerType | undefined;
      let options: PushAPIInitializeProps | undefined;

      if (
        args.length === 1 &&
        typeof args[0] === 'object' &&
        'account' in args[0]
      ) {
        // Single options object provided
        options = args[0];
      } else if (args.length === 1) {
        // Only signer provided
        [signer] = args;
      } else if (args.length === 2) {
        // Separate signer and options arguments provided
        [signer, options] = args;
      } else {
        // Handle other cases or throw an error
        throw new Error('Invalid arguments provided to initialize method.');
      }

      if (!signer && !options?.account) {
        throw new Error("Either 'signer' or 'account' must be provided.");
      }

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

      const readMode = !signer;

      // Get account
      // Derives account from signer if not provided

      let derivedAccount;
      if (signer) {
        derivedAccount = await getAccountAddress(
          getWallet({
            account: settings.account as string | null,
            signer: signer,
          })
        );
      } else {
        derivedAccount = options?.account;
      }

      if (!derivedAccount) {
        throw new Error('Account could not be derived.');
      }

      let decryptedPGPPrivateKey;
      let pgpPublicKey;

      /**
       * Decrypt PGP private key
       * If user exists, decrypts the PGP private key
       * If user does not exist, creates a new user and returns the decrypted PGP private key
       */
      const user = await PUSH_USER.get({
        account: derivedAccount,
        env: settings.env,
      });

      if (!readMode) {
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
      }

      // Initialize PushAPI instance
      const api = new PushAPI(
        settings.env as ENV,
        derivedAccount,
        readMode,
        decryptedPGPPrivateKey,
        pgpPublicKey,
        signer,
        settings.progressHook
      );

      return api;
    } catch (error) {
      console.error('Error initializing PushAPI:', error);
      throw error; // or handle it more gracefully if desired
    }
  }

  async initStream(
    listen: STREAM[],
    options?: PushStreamInitializeProps
  ): Promise<PushStream> {
    if (this.stream) {
      throw new Error('Stream is already initialized.');
    }

    this.stream = await PushStream.initialize(
      this.account,
      listen,
      this.env,
      this.decryptedPgpPvtKey,
      this.progressHook,
      this.signer,
      options
    );

    return this.stream;
  }

  async info() {
    return await PUSH_USER.get({
      account: this.account,
      env: this.env,
    });
  }

  static ensureSignerMessage(): string {
    return 'Operation not allowed in read-only mode. Signer is required.';
  }
}
