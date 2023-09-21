import Constants, { ENV } from '../constants';
import {
  SignerType,
  ISendNotificationInputOptions,
  ProgressHookType,
  ProgressHookTypeFunction,
  ethersV5SignerType,
} from '../types';
import {
  ChannelInfoOptions,
  SubscribeUnsubscribeOptionsV2,
  SubscriptionOptionsV2,
  AliasOptions,
  FeedType,
  FeedsOptionsV2,
  ChannelSearchOptionsV2,
  NotificationOptions,
  CreateChannelOptions,
  NotificationSettings,
} from './pushAPITypes';
import CONFIG, * as config from '../config';
import * as PUSH_USER from '../user';
import * as PUSH_PAYLOAD from '../payloads';
import * as PUSH_CHANNEL from '../channels';
import * as PUSH_ALIAS from '../alias';
import { getAccountAddress } from '../chat/helpers';
import {
  getCAIPDetails,
  getCAIPWithChainId,
  validateCAIP,
  getFallbackETHCAIPAddress,
} from '../helpers';
import PROGRESSHOOK from '../progressHook';
import { IDENTITY_TYPE, NOTIFICATION_TYPE } from '../payloads/constants';
import { ethers, Contract, ContractInterface, Signer } from 'ethers';
import axios from 'axios';
import { mainnet, goerli } from 'viem/chains';
import { createPublicClient, http, getContract } from 'viem';

// ERROR CONSTANTS
const ERROR_ACCOUNT_NEEDED = 'Account is required';
const ERROR_SIGNER_NEEDED = 'Signer object is required';
const ERROR_CHANNEL_NEEDED = 'Channel is needed';
const ERROR_INVALID_CAIP = 'Invalid CAIP format';

const BROADCAST_TYPE = '*';
const LENGTH_UPPER_LIMIT = 125;
const LENGTH_LOWER_LIMTI = 1;
const SETTING_DELIMITER = '-';
const SETTING_SEPARATOR = '+';

export const FEED_MAP = {
  INBOX: false,
  SPAM: true,
};
export class PushNotifications {
  private signer: SignerType | undefined;
  private account: string | undefined;
  private env: ENV | undefined;
  private guestMode: boolean;
  private coreContract: Contract | undefined;

  constructor(
    signer?: SignerType,
    env?: ENV,
    account?: string,
    coreContract?: Contract
  ) {
    this.signer = signer;
    this.env = env;
    this.guestMode = !!(account && signer);
    this.account = account;
    this.coreContract = coreContract;
  }
  static async initialize(
    signer?: SignerType,
    env?: ENV
  ): Promise<PushNotifications> {
    if (!env) {
      env = ENV.STAGING;
    }
    // Derives account from signer if not provided
    let derivedAccount;
    let coreContract;
    if (signer) {
      derivedAccount = await getAccountAddress({
        account: null,
        signer: signer,
      });
      // provider is presenet then initiate the contract
      if (signer.provider) {
        coreContract = new ethers.Contract(
          config.CORE_CONFIG[env].EPNS_CORE_CONTRACT,
          config.ABIS.CORE,
          signer as unknown as Signer
        );
      }
    }

    // Initialize PushNotifications instance
    return new PushNotifications(
      signer,
      env as ENV,
      derivedAccount,
      coreContract
    );
  }

  // check if addresses is supplied either by user or derived from signer object or if its guest mode
  private checkUserAddressExists(user?: string) {
    if (!user && !this.account && !this.guestMode)
      throw new Error(ERROR_ACCOUNT_NEEDED);
    return true;
  }

  // checks if the signer object is supplied
  private checkSignerObjectExists() {
    if (!this.signer) throw new Error(ERROR_SIGNER_NEEDED);
    return true;
  }

  // get type of notification from recipient
  private getNotificationType(
    recipient: string[],
    channel: string
  ): { recipient: string[] | string; type: number } {
    if (recipient.length == 1) {
      if (recipient[0] == BROADCAST_TYPE) {
        return { recipient: channel, type: NOTIFICATION_TYPE['BROADCAST'] };
      } else {
        return {
          recipient: recipient[0],
          type: NOTIFICATION_TYPE['TARGETTED'],
        };
      }
    }
    return { recipient, type: NOTIFICATION_TYPE['SUBSET'] };
  }

  // get identity type for lowlevel call
  private generateNotificationLowLevelPayload({
    signer,
    env,
    recipients,
    options,
    channel,
  }: {
    signer: SignerType;
    env: ENV;
    recipients: string[];
    options: NotificationOptions;
    channel?: string;
  }): ISendNotificationInputOptions {
    if (!channel) {
      channel = `${this.account}`;
    }
    const notificationType = this.getNotificationType(recipients, channel);
    const identityType = IDENTITY_TYPE.DIRECT_PAYLOAD;
    const notificationPayload: ISendNotificationInputOptions = {
      signer: signer,
      channel: channel,
      type: notificationType.type,
      identityType: identityType,
      notification: options.notification,
      payload: {
        title: options.payload?.title ?? options.notification.title,
        body: options.payload?.body ?? options.notification.body,
        cta: options.payload?.cta ?? '',
        img: options.payload?.embed ?? '',
        hidden: options.config?.hidden,
        etime: options.config?.expiry,
        silent: options.config?.silent,
        additionalMeta: options.payload?.meta,
      },
      recipients: notificationType.recipient,
      graph: options.advanced?.graph,
      ipfsHash: options.advanced?.ipfs,
      env: env,
      chatId: options.advanced?.chatid,
      pgpPrivateKey: options.advanced?.pgpPrivateKey,
    };

    return notificationPayload;
  }

  // check if the fields are empty
  private isEmpty(field: string) {
    if (field.trim().length == 0) {
      return true;
    }

    return false;
  }

  // check if the length is valid
  private isValidLength(
    data: string,
    upperLen: number = LENGTH_UPPER_LIMIT,
    lowerLen: number = LENGTH_LOWER_LIMTI
  ): boolean {
    return data.length >= lowerLen && data.length <= upperLen!;
  }

  // check if url is valid
  private isValidUrl(urlString: string): boolean {
    const urlPattern = new RegExp(
      '^((?:https|http):\\/\\/)' + // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ); // validate fragment locator
    return !!urlPattern.test(urlString);
  }

  // check all the fields of channel
  private verifyEmptyChannelParameters(options: CreateChannelOptions): boolean {
    if (this.isEmpty(options.name)) {
      throw new Error('Channel name cannot be empty');
    } else if (this.isEmpty(options.description)) {
      throw new Error('Channel description cannot be empty');
    } else if (this.isEmpty(options.icon)) {
      throw new Error('Channel icon cannot be empty');
    } else if (this.isEmpty(options.url)) {
      throw new Error('Channel url cannot ne empty');
    } else {
      return true;
    }
  }

  // check for valid length and url
  private validateParameterLength(options: CreateChannelOptions): boolean {
    if (!this.isValidLength(options.name)) {
      throw new Error(
        `Channel name should not exceed ${LENGTH_UPPER_LIMIT} characters`
      );
    } else if (!this.isValidLength(options.description)) {
      throw new Error(
        `Channel description should not exceed ${LENGTH_UPPER_LIMIT} characters`
      );
    } else if (
      !this.isValidLength(options.url) ||
      !this.isValidUrl(options.url)
    ) {
      throw new Error(
        `Channel url either excees ${LENGTH_UPPER_LIMIT} characters or is not a valid url`
      );
    } else {
      return true;
    }
  }

  private validateChannelParameters(options: CreateChannelOptions): boolean {
    return (
      this.verifyEmptyChannelParameters(options) &&
      this.validateParameterLength(options)
    );
  }

  // create contract instance
  private createContractInstance(
    contractAddress: string | `0x${string}`,
    contractABI: ethers.ContractInterface
  ) {
    this.checkSignerObjectExists();
    if (!this.signer?.provider) {
      throw new Error('Provider is required');
    }
    if (
      !('_signTypedData' in this.signer) &&
      !('signTypedData' in this.signer)
    ) {
      throw new Error('Unsupported signer type');
    } else if ('_signTypedData' in this.signer) {
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        this.signer as unknown as Signer
      );
      return contract;
    } else {
      throw new Error('viem support coming soon');
    }
    // else if ('signTypedData' in this.signer) {
    //   const client = createPublicClient({
    //     chain: mainnet,
    //     transport: http()
    //   })
    //   const contract = getContract({
    //     abi: contractABI ,
    //     address: contractAddress as `0x${string}`,
    //     publicClient: client
    //   })
    // } else{
    //   throw new Error("Unsupported signer type")
    // }
  }

  private async uploadToIPFSViaPushNode(data: string): Promise<string> {
    try {
      const response = await axios.post(
        `${config.CORE_CONFIG[this.env!].API_BASE_URL}/v1/ipfs/upload`,
        { data }
      );
      return response.data.cid as string;
    } catch (error) {
      throw new Error('Something went wrong while uploading data to IPFS');
    }
  }

  private getTimeBound(timeStamp?: number) {
    // for now returns 0 for non-time bound. Later it can be modified to handle time bound channels
    return 0;
  }

  private getMinimalSetting(configuration: NotificationSettings): {
    setting: string;
    description: string;
  } {
    let notificationSetting = '';
    let notificationSettingDescription = '';
    for (let i = 0; i < configuration.length; i++) {
      const ele = configuration[i];
      if (ele.type == 0) {
        notificationSetting =
          notificationSetting +
          SETTING_SEPARATOR +
          ele.type +
          SETTING_DELIMITER +
          ele.default;
        notificationSettingDescription =
          notificationSettingDescription + ele.description;
      }
      if (ele.type == 1) {
        if (ele.data) {
          notificationSetting =
            notificationSetting +
            SETTING_SEPARATOR +
            ele.type +
            SETTING_DELIMITER +
            ele.default +
            SETTING_DELIMITER +
            ele.data.lower +
            SETTING_DELIMITER +
            ele.data.upper;

          notificationSettingDescription =
            notificationSettingDescription + ele.description;
        }
      }
    }
    return {
      setting: notificationSetting.replace(/^\+/, ''),
      description: notificationSettingDescription,
    };
  }
  notification = {
    /**
     * @description - Fetches feeds and spam feeds for a specific user
     * @param {enums} spam - indicates if its a spam or not. `INBOX` for non-spam and `SPAM` for spam. default `INBOX`
     * @param {string} [options.user] - user address, defaults to address from signer
     * @param {number} [options.page] -  page number. default is set to Constants.PAGINATION.INITIAL_PAGE
     * @param {number} [options.limit] - number of feeds per page. default is set to Constants.PAGINATION.LIMIT
     * @param {boolean} [options.raw] - indicates if the response should be raw or formatted. defaults is set to false
     * @returns feeds for a specific address
     */
    list: async (
      spam: `${FeedType}` = FeedType.INBOX,
      options?: FeedsOptionsV2
    ) => {
      const {
        account = this.account,
        page = Constants.PAGINATION.INITIAL_PAGE,
        limit = Constants.PAGINATION.LIMIT,
        channels = [],
        raw = false,
      } = options || {};
      try {
        // guest mode and valid address check
        this.checkUserAddressExists(account!);
        if (channels.length == 0) {
          // else return the response
          return await PUSH_USER.getFeeds({
            user: account!,
            page: page,
            limit: limit,
            spam: FEED_MAP[spam],
            raw: raw,
            env: this.env,
          });
        } else {
          return await PUSH_USER.getFeedsPerChannel({
            user: account!,
            page: page,
            limit: limit,
            spam: FEED_MAP[spam],
            raw: raw,
            env: this.env,
            channels: channels,
          });
        }
      } catch (error) {
        throw new Error(
          `Push SDK Error: API : notifcaiton::list : ${(error)}`
        );
      }
    },

    subscriptions: async (options?: SubscriptionOptionsV2) => {
      try {
        const {
          account = this.account,
          // TODO: to be used once pagination is implemeted at API level
          page = Constants.PAGINATION.INITIAL_PAGE,
          limit = Constants.PAGINATION.LIMIT,
        } = options || {};
        this.checkUserAddressExists(account!);
        return await PUSH_USER.getSubscriptions({
          user: account!,
          env: this.env,
        });
      } catch (error) {
        throw new Error(
          `Push SDK Error: API : notifcaiton::subscriptions : ${(
            error
          )}`
        );
      }
    },
    /**
     * Subscribes a user to a channel
     * @param {string} channel - channel address in caip format
     * @param {function} [options.onSuccess] - callback function when a user successfully subscribes to a channel
     * @param {function} [options.onError] - callback function incase a user was not able to subscribe to a channel
     * @returns Subscribe status object
     */
    subscribe: async (
      channel: string,
      options?: SubscribeUnsubscribeOptionsV2
    ) => {
      try {
        const { onSuccess, onError } = options || {};
        // Vaidatiions
        // validates if signer object is present
        this.checkSignerObjectExists();
        // validates if the user address exists
        this.checkUserAddressExists();
        // validates if channel exists
        if (!channel && channel != '') {
          throw new Error(ERROR_CHANNEL_NEEDED);
        }
        // validates if caip is correct
        if (!validateCAIP(channel)) {
          throw new Error(ERROR_INVALID_CAIP);
        }
        // get channel caip
        const caipDetail = getCAIPDetails(channel);
        // based on the caip, construct the user caip
        const userAddressInCaip = getCAIPWithChainId(
          this.account!,
          parseInt(caipDetail?.networkId as string)
        );
        return await PUSH_CHANNEL.subscribe({
          signer: this.signer!,
          channelAddress: channel,
          userAddress: userAddressInCaip,
          env: this.env,
          onSuccess: onSuccess,
          onError: onError,
        });
      } catch (error) {
        throw new Error(
          `Push SDK Error: API : notifcaiton::subscribe : ${(
            error
          )}`
        );
      }
    },

    /**
     * Unsubscribes a user to a channel
     * @param {string} channel - channel address in caip format
     * @param {function} [options.onSuccess] - callback function when a user successfully unsubscribes to a channel
     * @param {function} [options.onError] - callback function incase a user was not able to unsubscribe to a channel
     * @returns Unsubscribe status object
     */
    unsubscribe: async (
      channel: string,
      options?: SubscribeUnsubscribeOptionsV2
    ) => {
      try {
        const { onSuccess, onError } = options || {};
        // Vaidatiions
        // validates if the user address exists
        this.checkUserAddressExists();
        // validates if signer object is present
        this.checkSignerObjectExists();
        // validates if channel exists
        if (!channel && channel != '') {
          return new Error(ERROR_CHANNEL_NEEDED);
        }
        // validates if caip is correct
        if (!validateCAIP(channel)) {
          return new Error(ERROR_INVALID_CAIP);
        }
        const caipDetail = getCAIPDetails(channel);
        const userAddressInCaip = getCAIPWithChainId(
          this.account!,
          parseInt(caipDetail?.networkId as string)
        );
        return await PUSH_CHANNEL.unsubscribe({
          signer: this.signer!,
          channelAddress: channel,
          userAddress: userAddressInCaip,
          env: this.env,
          onSuccess: onSuccess,
          onError: onError,
        });
      } catch (error) {
        throw new Error(
          `Push SDK Error: API : notifcaiton::unsubscribe : ${(
            error
          )}`
        );
      }
    },
  };

  channel = {
    /**
     * @description - returns information about a channel
     * @param {string} [options.channel] - channel address in caip, defaults to eth caip address
     * @returns information about the channel if it exists
     */
    info: async (channel?: string) => {
      try {
        this.checkUserAddressExists(channel);
        channel =
          channel ?? getFallbackETHCAIPAddress(this.env!, this.account!);
        return await PUSH_CHANNEL.getChannel({
          channel: channel as string,
          env: this.env,
        });
      } catch (error) {
        throw new Error(
          `Push SDK Error: API : channel::info : ${(error)}`
        );
      }
    },

    /**
     * @description - returns relevant information as per the query that was passed
     * @param {string} query - search query
     * @param {number} [options.page] -  page number. default is set to Constants.PAGINATION.INITIAL_PAGE
     * @param {number} [options.limit] - number of feeds per page. default is set to Constants.PAGINATION.LIMIT
     * @returns Array of results relevant to the serach query
     */
    search: async (query: string, options?: ChannelSearchOptionsV2) => {
      try {
        const {
          page = Constants.PAGINATION.INITIAL_PAGE,
          limit = Constants.PAGINATION.LIMIT,
        } = options || {};
        return await PUSH_CHANNEL.search({
          query: query,
          page: page,
          limit: limit,
          env: this.env,
        });
      } catch (error) {
        throw new Error(
          `Push SDK Error: API : channel::search : ${(error)}`
        );
      }
    },
    /**
     * @description - Get subscribers of a channell
     * @param {string} [options.channel] - channel in caip. defaults to account from signer with eth caip
     * @returns array of subscribers
     */
    subscribers: async (options?: ChannelInfoOptions) => {
      try {
        const { channel } = options || {};
        this.checkUserAddressExists(channel);
        if (!validateCAIP(channel!)) {
          throw new Error('Invalid CAIP');
        }
        return await PUSH_CHANNEL._getSubscribers({
          channel: channel!,
          env: this.env,
        });
      } catch (error) {
        throw new Error(
          `Push SDK Error: API : channel::subscribers : ${(
            error
          )}`
        );
      }
    },
    /**
     *
     * @param {string[]} recipients - Array of recipients. `['0x1'] -> TARGET`, `['0x1, 0x2'] -> SUBSET`, `['*'] -> BROADCAST`
     * @param {object} options - Notification options
     * @returns
     */
    send: async (recipients: string[], options: NotificationOptions) => {
      try {
        this.checkSignerObjectExists();
        const lowLevelPayload = this.generateNotificationLowLevelPayload({
          signer: this.signer!,
          env: this.env!,
          recipients: recipients,
          options: options,
          channel: options.channel ?? this.account,
        });
        return await PUSH_PAYLOAD.sendNotification(lowLevelPayload);
      } catch (error) {
        throw new Error(
          `Push SDK Error: API : channel::send : ${(error)}`
        );
      }
    },

    create: async (options: CreateChannelOptions) => {
      const {
        name,
        description,
        url,
        icon,
        alias = null,
        progressHook,
      } = options || {};
      try {
        // create push token instance
        let aliasInfo;
        this.checkSignerObjectExists();
        if (!this.signer || !this.signer?.provider) {
          throw new Error('Provider is required');
        }
        // validate all the parameters and length
        this.validateChannelParameters(options);
        // check for PUSH balance
        const pushTokenContract = await this.createContractInstance(
          config.TOKEN[this.env!],
          config.ABIS.TOKEN
        );
        const balance = await pushTokenContract!['balanceOf'](this.account);
        const fees = ethers.utils.parseUnits(
          config.MIN_TOKEN_BALANCE[this.env!].toString(),
          18
        );
        if (fees.gte(balance)) {
          throw new Error('Insufficient PUSH balance');
        }
        // if alias is passed, check for the caip
        if (alias) {
          if (!validateCAIP(alias)) {
            throw new Error('Invalid alias CAIP');
          }
          const aliasDetails = getCAIPDetails(alias);
          aliasInfo = {
            [`${aliasDetails?.blockchain}:${aliasDetails?.networkId}`]:
              aliasDetails?.address,
          };
        }
        // construct channel identity
        progressHook?.(PROGRESSHOOK['PUSH-CREATE-01'] as ProgressHookType);
        const input = {
          name: name,
          info: description,
          url: url,
          icon: icon,
          aliasDetails: aliasInfo ?? {},
        };
        const cid = await this.uploadToIPFSViaPushNode(JSON.stringify(input));
        // approve the tokens to core contract
        progressHook?.(PROGRESSHOOK['PUSH-CREATE-02'] as ProgressHookType);
        const approvalTrxPromise = pushTokenContract!['approve'](
          config.CORE_CONFIG[this.env!].EPNS_CORE_CONTRACT,
          fees
        );
        const approvalTrx = await approvalTrxPromise;
        await this.signer.provider.waitForTransaction(approvalTrx.hash);
        // generate the contract parameters
        const channelType = config.CHANNEL_TYPE['GENERAL'];
        const identity = '1+' + cid;
        const identityBytes = ethers.utils.toUtf8Bytes(identity);
        // call contract
        progressHook?.(PROGRESSHOOK['PUSH-CREATE-03'] as ProgressHookType);
        const createChannelPromise = this.coreContract![
          'createChannelWithPUSH'
        ](channelType, identityBytes, fees, this.getTimeBound(), {
          gasLimit: 1000000,
        });
        const createChannelTrx = await createChannelPromise;
        const createChannelTrxStatus =
          await this.signer.provider.waitForTransaction(createChannelTrx.hash);
        if (createChannelTrxStatus.status == 0) {
          throw new Error('Something Went wrong while creating your channel');
        } else {
          progressHook?.(PROGRESSHOOK['PUSH-CREATE-04'] as ProgressHookType);
          return { transactionHash: createChannelTrx.hash };
        }
      } catch (error) {
        const errorProgressHook = PROGRESSHOOK[
          'PUSH-ERROR-02'
        ] as ProgressHookTypeFunction;
        progressHook?.(errorProgressHook('Create Channel', error));
        throw new Error(
          `Push SDK Error: Contract : createChannelWithPUSH : ${(
            error
          )}`
        );
      }
    },

    update: async (options: CreateChannelOptions) => {
      const {
        name,
        description,
        url,
        icon,
        alias = null,
        progressHook,
      } = options || {};
      try {
        // create push token instance
        let aliasInfo;
        this.checkSignerObjectExists();
        if (!this.signer || !this.signer.provider) {
          throw new Error('Provider is required');
        }
        // validate all the parameters and length
        this.validateChannelParameters(options);
        // check for PUSH balance
        const pushTokenContract = await this.createContractInstance(
          config.TOKEN[this.env!],
          config.ABIS.TOKEN
        );
        const balance = await pushTokenContract!['balanceOf'](this.account);
        const fees = ethers.utils.parseUnits(
          config.MIN_TOKEN_BALANCE[this.env!].toString(),
          18
        );
        if (fees.gt(balance)) {
          throw new Error('Insufficient PUSH balance');
        }
        // if alias is passed, check for the caip
        if (alias) {
          if (!validateCAIP(alias)) {
            throw new Error('Invalid alias CAIP');
          }
          const aliasDetails = getCAIPDetails(alias);
          aliasInfo = {
            [`${aliasDetails?.blockchain}:${aliasDetails?.networkId}`]:
              aliasDetails?.address,
          };
        }
        // construct channel identity
        progressHook?.(PROGRESSHOOK['PUSH-UPDATE-01'] as ProgressHookType);
        const input = {
          name: name,
          info: description,
          url: url,
          icon: icon,
          aliasDetails: aliasInfo ?? {},
        };
        const cid = await this.uploadToIPFSViaPushNode(JSON.stringify(input));
        // approve the tokens to core contract
        progressHook?.(PROGRESSHOOK['PUSH-UPDATE-02'] as ProgressHookType);
        const approvalTrxPromise = pushTokenContract!['approve'](
          config.CORE_CONFIG[this.env!].EPNS_CORE_CONTRACT,
          fees
        );
        const approvalTrx = await approvalTrxPromise;
        await this.signer.provider.waitForTransaction(approvalTrx.hash);
        // generate the contract parameters
        const identity = '1+' + cid;
        const identityBytes = ethers.utils.toUtf8Bytes(identity);
        // call contract
        progressHook?.(PROGRESSHOOK['PUSH-UPDATE-03'] as ProgressHookType);
        const updateChannelPromise = this.coreContract!['updateChannelMeta'](
          this.account,
          identityBytes,
          fees,
          {
            gasLimit: 1000000,
          }
        );
        const updateChannelTrx = await updateChannelPromise;
        const updateChannelTrxStatus =
          await this.signer.provider.waitForTransaction(updateChannelTrx.hash);
        if (updateChannelTrxStatus.status == 0) {
          throw new Error('Something Went wrong while creating your channel');
        }
        progressHook?.(PROGRESSHOOK['PUSH-UPDATE-04'] as ProgressHookType);
        return { transactionHash: updateChannelTrx.hash };
      } catch (error) {
        const errorProgressHook = PROGRESSHOOK[
          'PUSH-ERROR-02'
        ] as ProgressHookTypeFunction;
        progressHook?.(errorProgressHook('Update Channel', error));
        throw new Error(
          `Push SDK Error: Contract channel::update : ${error}`
        );
      }
    },
    /**
     * @description verifies a channel
     * @param {string} channelToBeVerified - address of the channel to be verified
     * @returns the transaction hash if the transaction is successful
     */
    verify: async (channelToBeVerified: string) => {
      try {
        this.checkSignerObjectExists();
        // checks if it is a valid address
        if (!ethers.utils.isAddress(channelToBeVerified)) {
          throw new Error('Invalid channel address');
        }
        // if valid, continue with it
        const verifyTrxPromise =
          this.coreContract!['verify'](channelToBeVerified);
        const verifyTrx = await verifyTrxPromise();
        await this.signer?.provider?.waitForTransaction(verifyTrx.hash);
        return { transactionHash: verifyTrx.hash };
      } catch (error) {
        throw new Error(
          `Push SDK Error: Contract channel::verify : ${(error)}`
        );
      }
    },

    setting: async (configuration: NotificationSettings) => {
      try {
        this.checkSignerObjectExists();
        // check for PUSH balance
        const pushTokenContract = await this.createContractInstance(
          config.TOKEN[this.env!],
          config.ABIS.TOKEN
        );
        const balance = await pushTokenContract!['balanceOf'](this.account);
        const fees = ethers.utils.parseUnits(
          config.MIN_TOKEN_BALANCE[this.env!].toString(),
          18
        );
        if (fees.gte(balance)) {
          throw new Error('Insufficient PUSH balance');
        }
        const { setting, description } = this.getMinimalSetting(configuration);
        const createChannelSettingPromise = this.coreContract![
          'createChannelSettings'
        ](configuration.length.toString(), setting, description, fees);
        const createChannelSettingTrx = await createChannelSettingPromise;
        await this.signer?.provider?.waitForTransaction(
          createChannelSettingTrx.hash
        );
        return { transactionHash: createChannelSettingTrx.hash };
      } catch (error) {
        throw new Error(
          `Push SDK Error: Contract : channel::setting : ${(
            error
          )}`
        );
      }
    },
  };

  delegate = {
    /**
     * @description - Get delegates of a channell
     * @param {string} [options.channel] - channel in caip. defaults to account from signer with eth caip
     * @returns array of delegates
     */
    get: async (options?: ChannelInfoOptions) => {
      try {
        const {
          channel = this.account
            ? getFallbackETHCAIPAddress(this.env!, this.account!)
            : null,
        } = options || {};
        this.checkUserAddressExists(channel!);
        if (!validateCAIP(channel!)) {
          throw new Error('Invalid CAIP');
        }
        return await PUSH_CHANNEL.getDelegates({
          channel: channel!,
          env: this.env,
        });
      } catch (error) {
        throw new Error(
          `Push SDK Error: API : delegate::get : ${(error)}`
        );
      }
    },

    /**
     * @description adds a delegate
     * @param {string} delegate - delegate address in caip to be added
     * @returns the transaction hash if the transaction is successfull
     */
    add: async (delegate: string) => {
      try {
        this.checkSignerObjectExists();
        if (this.signer && !this.signer.provider) {
          throw new Error('Provider is required');
        }
        if (!validateCAIP(delegate)) {
          throw new Error('Invalid CAIP');
        }

        const networkDetails = await this.signer?.provider?.getNetwork();
        if (networkDetails?.chainId !== parseInt(delegate.split(':')[1])) {
          return new Error('Signer and CAIP chain id doesnt match');
        }
        const caip = `eip155:${networkDetails.chainId}`;
        if (!CONFIG[this.env!][caip]) {
          throw new Error('Unsupported Chainid');
        }
        const commAddress = CONFIG[this.env!][caip].EPNS_COMMUNICATOR_CONTRACT;
        const commContract = this.createContractInstance(
          commAddress,
          config.ABIS.COMM
        );
        const addDelegatePromise = commContract!['addDelegate'](
          delegate.split(':')[2]
        );
        const addDelegateTrx = await addDelegatePromise;
        await this.signer?.provider?.waitForTransaction(addDelegateTrx.hash);
        return { transactionHash: addDelegateTrx.hash };
      } catch (error) {
        throw new Error(
          `Push SDK Error: Contract : delegate::add : ${(error)}`
        );
      }
    },

    /**
     * @description removes a delegate
     * @param {string} delegate - caip address of the delegate to be removed
     * @returns the transaction hash if the transaction is successfull
     */
    remove: async (delegate: string) => {
      try {
        this.checkSignerObjectExists();
        if (this.signer && !this.signer.provider) {
          throw new Error('Provider is required');
        }
        if (!validateCAIP(delegate)) {
          throw new Error('Invalid CAIP');
        }

        const networkDetails = await this.signer?.provider?.getNetwork();
        if (networkDetails?.chainId !== parseInt(delegate.split(':')[1])) {
          return new Error('Signer and CAIP chain id doesnt match');
        }
        const caip = `eip155:${networkDetails.chainId}`;
        if (!CONFIG[this.env!][caip]) {
          throw new Error('Unsupported Chainid');
        }
        const commAddress = CONFIG[this.env!][caip].EPNS_COMMUNICATOR_CONTRACT;
        const commContract = this.createContractInstance(
          commAddress,
          config.ABIS.COMM
        );
        const removeDelegatePromise = commContract!['removeDelegate'](
          delegate.split(':')[2]
        );
        const removeDelegateTrx = await removeDelegatePromise;
        await this.signer?.provider?.waitForTransaction(removeDelegateTrx.hash);
        return { transactionHash: removeDelegateTrx.hash };
      } catch (error) {
        throw new Error(
          `Push SDK Error: Contract : delegate::remove : ${(
            error
          )}`
        );
      }
    },
  };

  alias = {
    /**
     * @description - fetches alias information
     * @param {AliasOptions} options - options related to alias
     * @returns Alias details
     */
    info: async (options: AliasOptions) => {
      try {
        return await PUSH_ALIAS.getAliasInfo({ ...options, env: this.env });
      } catch (error) {
        throw new Error(
          `Push SDK Error: API : alias::info : ${(error)}`
        );
      }
    },
  };
}
