import { SignerType, ProgressHookType } from '../types';
import { Profile } from './profile';
import { Encryption } from './encryption';
import { Channel } from '../pushNotification/channel';
import { Notification } from '../pushNotification/notification';
import Constants, {ENV} from "../constants";
import {PushAPIInitializeProps} from "./pushAPITypes";
import {getAccountAddress, getWallet} from "../chat/helpers/wallet";


export class PushNotifAPI {
  private signer?: SignerType;
  private env: ENV;
  private progressHook?: (progress: ProgressHookType) => void;
  private account: string;

  // Notification
  public channel!: Channel;
  public notification!: Notification;

  // error object to maintain errors and warnings
  public errors: { type: 'WARN' | 'ERROR'; message: string }[];

  private constructor(
    env: ENV,
    account: string,
    signer?: SignerType,
    progressHook?: (progress: ProgressHookType) => void,
    initializationErrors?: { type: 'WARN' | 'ERROR'; message: string }[]
  ) {
    this.signer = signer;
    this.env = env;
    this.account = account;
    this.progressHook = progressHook;
    // Instantiate the notification classes
    this.channel = new Channel(this.signer, this.env, this.account);
    this.notification = new Notification(this.signer, this.env, this.account);

    this.errors = initializationErrors || [];
  }
  // Overloaded initialize method signatures
  static async initialize(
    signer?: SignerType,
    options?: PushAPIInitializeProps
  ): Promise<PushNotifAPI>;
  static async initialize(options?: PushAPIInitializeProps): Promise<PushNotifAPI>;

  static async initialize(...args: any[]): Promise<PushNotifAPI> {
    try {
      let signer: SignerType | undefined;
      let options: PushAPIInitializeProps | undefined;

      if (
        args.length === 1 &&
        typeof args[0] === 'object' &&
        'account' in args[0] &&
        typeof args[0].account === 'string'
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

      if (!signer) {
        throw new Error("Either 'signer' or 'account' must be provided.");
      }

      const initializationErrors: { type: 'WARN' | 'ERROR'; message: string; }[] = [];

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

      // Initialize PushAPI instance
      const api = new PushNotifAPI(
        settings.env as ENV,
        derivedAccount,
        signer,
        settings.progressHook,
        initializationErrors
      );

      return api;
    } catch (error) {
      console.error('Error initializing PushAPI:', error);
      throw error; // or handle it more gracefully if desired
    }
  }

  static ensureSignerMessage(): string {
    return 'Operation not allowed in read-only mode. Signer is required.';
  }
}
