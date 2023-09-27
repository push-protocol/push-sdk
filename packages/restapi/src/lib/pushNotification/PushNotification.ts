import Constants, { ENV } from '../constants';
import {
  SignerType,
  ISendNotificationInputOptions,
  ProgressHookType,
  ProgressHookTypeFunction,
} from '../types';
import {
  ChannelInfoOptions,
  SubscribeUnsubscribeOptions,
  SubscriptionOptions,
  AliasOptions,
  FeedType,
  FeedsOptions,
  ChannelSearchOptions,
  NotificationOptions,
  CreateChannelOptions,
  NotificationSettings,
} from './PushNotificationTypes';
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
import { ethers, Contract, Signer, BigNumber } from 'ethers';
import axios from 'axios';
import {
  createPublicClient,
  http,
  getContract,
  WalletClient,
  Chain,
} from 'viem';

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
export class PushNotification {
  private signer: SignerType | undefined;
  private account: string | undefined;
  private env: ENV | undefined;
  private guestMode: boolean;
  private coreContract: Contract | undefined;

  constructor(
    signer?: SignerType,
    env?: ENV,
    account?: string,
    coreContract?: any
  ) {
    this.signer = signer;
    this.env = env;
    this.guestMode = !!(account && signer);
    this.account = account;
    this.coreContract = coreContract;
  }
  static async initialize(
    signer?: SignerType,
    options?: { env?: ENV }
  ): Promise<PushNotification> {
    const { env = ENV.STAGING } = options || {};
    // Derives account from signer if not provided
    let derivedAccount;
    let coreContract;
    if (signer) {
      if (!('_signTypedData' in signer!) && !('signTypedData' in signer!)) {
        throw new Error('Unsupported signer type');
      } else if ('_signTypedData' in signer) {
        derivedAccount = await getAccountAddress({
          account: null,
          signer: signer,
        });
        if (signer?.provider) {
          coreContract = new ethers.Contract(
            config.CORE_CONFIG[env].EPNS_CORE_CONTRACT,
            config.ABIS.CORE,
            signer as unknown as Signer
          );
        }
      } else if ('signTypedData' in signer) {
        derivedAccount = await getAccountAddress({
          account: null,
          signer: signer,
        });
        const client = createPublicClient({
          chain: config.TOKEN_VIEM_NETWORK_MAP[env],
          transport: http(),
        });
        coreContract = getContract({
          abi: config.ABIS.CORE,
          address: config.CORE_CONFIG[env].EPNS_CORE_CONTRACT as `0x${string}`,
          publicClient: client,
          walletClient: signer as unknown as WalletClient,
        });
      }
    }

    // Initialize PushNotifications instance
    return new PushNotification(
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
  public createContractInstance(
    contractAddress: string | `0x${string}`,
    contractABI: any,
    network: Chain
  ) {
    let contract: any;
    if (
      !('_signTypedData' in this.signer!) &&
      !('signTypedData' in this.signer!)
    ) {
      throw new Error('Unsupported signer type');
    } else if ('_signTypedData' in this.signer) {
      if (!this.signer?.provider) {
        throw new Error('Provider is required');
      }
      contract = new ethers.Contract(
        contractAddress,
        contractABI,
        this.signer as unknown as Signer
      );
    } else if ('signTypedData' in this.signer) {
      const client = createPublicClient({
        chain: network,
        transport: http(),
      });
      contract = getContract({
        abi: contractABI,
        address: contractAddress as `0x${string}`,
        publicClient: client,
        walletClient: this.signer as unknown as WalletClient,
      });
    } else {
      throw new Error('Unsupported signer type');
    }
    return contract;
  }

  private async fetchBalance(contract: any, userAddress: string) {
    let balance: BigNumber;
    try {
      if ('_signTypedData' in this.signer!) {
        balance = await contract!['balanceOf'](userAddress);
      } else if ('signTypedData' in this.signer!) {
        const balanceInBigInt = await contract.read.balanceOf({
          args: [userAddress],
        });
        balance = ethers.BigNumber.from(balanceInBigInt);
      } else {
        throw new Error('Unsupported signer');
      }
      return balance;
    } catch (error) {
      console.log(error);
      throw new Error(JSON.stringify(error));
    }
  }

  private async fetchAllownace(
    contract: any,
    userAddress: string,
    spenderAddress: string
  ) {
    let allowance: BigNumber;
    try {
      if ('_signTypedData' in this.signer!) {
        allowance = await contract!['allowance'](userAddress, spenderAddress);
      } else if ('signTypedData' in this.signer!) {
        const allowanceInBigInt = await contract.read.allowance({
          args: [userAddress, spenderAddress],
        });
        allowance = ethers.BigNumber.from(allowanceInBigInt);
      } else {
        throw new Error('Unsupported signer');
      }
      return allowance;
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }

  private async approveToken(
    contract: any,
    spenderAddress: string,
    amount: string | BigNumber
  ) {
    try {
      if ('_signTypedData' in this.signer!) {
        if (!this.signer || !this.signer.provider) {
          throw new Error('ethers provider/signer is not provided');
        }
        const approvalTrxPromise = contract!['approve'](spenderAddress, amount);
        const approvalTrx = await approvalTrxPromise;
        await this.signer?.provider?.waitForTransaction(approvalTrx.hash);
        // console.log(approvalTrx.hash)
      } else if ('signTypedData' in this.signer!) {
        if (!contract.write) {
          throw new Error('viem signer is not provided');
        }
        const approvalTrxPromise = contract.write.approve({
          args: [spenderAddress, amount],
        });
        const approvalTrxRes = await approvalTrxPromise;
        // console.log(approvalTrxRes);
      } else {
        throw new Error('Unsupported signer');
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  private async createChannel(
    contract: any,
    channelType: number,
    identityBytes: Uint8Array,
    fees: BigNumber
  ) {
    let createChannelRes;
    try {
      if (!this.signer || !this.signer.provider) {
        throw new Error('ethers provider/signer is not provided');
      }
      if ('_signTypedData' in this.signer!) {
        const createChannelPromise = contract!['createChannelWithPUSH'](
          channelType,
          identityBytes,
          fees,
          this.getTimeBound(),
          {
            gasLimit: 1000000,
          }
        );
        const createChannelTrx = await createChannelPromise;
        const createChannelTrxStatus =
          await this.signer?.provider?.waitForTransaction(
            createChannelTrx.hash
          );
        if (createChannelTrxStatus?.status == 0) {
          throw new Error('Something Went wrong while creating your channel');
        }
        createChannelRes = createChannelTrx.hash;
      } else if ('signTypedData' in this.signer!) {
        if (!contract.write) {
          throw new Error('viem signer is not provided');
        }
        const createChannelPromise = contract.write.createChannelWithPUSH({
          args: [channelType, identityBytes, fees, this.getTimeBound()],
        });
        createChannelRes = await createChannelPromise;
      }

      return createChannelRes;
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }

  private async updateChannel(
    contract: any,
    account: string,
    identityBytes: Uint8Array,
    fees: BigNumber
  ) {
    let updateChannelRes;
    try {
      if (!this.signer || !this.signer.provider) {
        throw new Error('ethers provider/signer is not provided');
      }
      if ('_signTypedData' in this.signer!) {
        const updateChannelPromise = contract!['updateChannelMeta'](
          account,
          identityBytes,
          fees,
          {
            gasLimit: 1000000,
          }
        );
        const updateChannelTrx = await updateChannelPromise;
        const updateChannelTrxStatus =
          await this.signer?.provider?.waitForTransaction(
            updateChannelTrx.hash
          );
        if (updateChannelTrxStatus?.status == 0) {
          throw new Error('Something Went wrong while creating your channel');
        }
        updateChannelRes = updateChannelTrx.hash;
      } else if ('signTypedData' in this.signer!) {
        if (!contract.write) {
          throw new Error('viem signer is not provided');
        }
        const updateChannelPromise = contract.write.createChannelWithPUSH({
          args: [account, identityBytes, fees],
        });
        updateChannelRes = await updateChannelPromise;
      }

      return updateChannelRes;
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }

  private async verifyChannel(contract: any, channelToBeVerified: string) {
    try {
      let verifyTrxRes;
      if ('_signTypedData' in this.signer!) {
        if (!this.signer || !this.signer.provider) {
          throw new Error('ethers provider/signer is not provided');
        }
        const verifyTrxPromise = contract!['verify'](channelToBeVerified);
        const verifyTrx = await verifyTrxPromise;
        await this.signer?.provider?.waitForTransaction(verifyTrx.hash);
        verifyTrxRes = verifyTrx.hash;
      } else if ('signTypedData' in this.signer!) {
        if (!contract.write) {
          throw new Error('viem signer is not provided');
        }
        const verifyTrxPromise = contract.write.verify({
          args: [channelToBeVerified],
        });
        verifyTrxRes = await verifyTrxPromise;
      } else {
        throw new Error('Unsupported signer');
      }
      return verifyTrxRes;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  private async createChanelSettings(
    contract: any,
    numberOfSettings: number,
    settings: string,
    description: string,
    fees: BigNumber
  ) {
    try {
      let createSettingsRes;
      if ('_signTypedData' in this.signer!) {
        if (!this.signer || !this.signer.provider) {
          throw new Error('ethers provider/signer is not provided');
        }
        const createSettingsPromise = contract!['createChannelSettings'](
          numberOfSettings,
          settings,
          description,
          fees
        );
        const createSettings = await createSettingsPromise;
        await this.signer?.provider?.waitForTransaction(createSettings.hash);
        createSettingsRes = createSettings.hash;
      } else if ('signTypedData' in this.signer!) {
        if (!contract.write) {
          throw new Error('viem signer is not provided');
        }
        const createSettingsTrxPromise = contract.write.createChannelSettings({
          args: [numberOfSettings, settings, description, fees],
        });
        createSettingsRes = await createSettingsTrxPromise;
      } else {
        throw new Error('Unsupported signer');
      }
      return createSettingsRes;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  private async addDelegator(contract: any, delegatee: string) {
    try {
      let addDelegateRes;
      if ('_signTypedData' in this.signer!) {
        if (!this.signer || !this.signer.provider) {
          throw new Error('ethers provider/signer is not provided');
        }
        const addDelegateTrxPromise = contract!['addDelegate'](delegatee);
        const addDelegateTrx = await addDelegateTrxPromise;
        await this.signer?.provider?.waitForTransaction(addDelegateTrx.hash);
        addDelegateRes = addDelegateTrx.hash;
      } else if ('signTypedData' in this.signer!) {
        if (!contract.write) {
          throw new Error('viem signer is not provided');
        }
        const addDelegateTrxPromise = contract.write.addDelegate({
          args: [delegatee],
        });
        addDelegateRes = await addDelegateTrxPromise;
      } else {
        throw new Error('Unsupported signer');
      }
      return addDelegateRes;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  private async removeDelegator(contract: any, delegatee: string) {
    try {
      let removeDelegateRes;
      if ('_signTypedData' in this.signer!) {
        if (!this.signer || !this.signer.provider) {
          throw new Error('ethers provider/signer is not provided');
        }
        const removeDelegateTrxPromise = contract!['removeDelegate'](delegatee);
        const removeDelegateTrx = await removeDelegateTrxPromise;
        await this.signer?.provider?.waitForTransaction(removeDelegateTrx.hash);
        removeDelegateRes = removeDelegateTrx.hash;
      } else if ('signTypedData' in this.signer!) {
        if (!contract.write) {
          throw new Error('viem signer is not provided');
        }
        const removeDelegateTrxPromise = contract.write.removeDelegate({
          args: [delegatee],
        });
        removeDelegateRes = await removeDelegateTrxPromise;
      } else {
        throw new Error('Unsupported signer');
      }
      return removeDelegateRes;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  private async getChianId(signer: SignerType) {
    let chainId;
    if ('_signTypedData' in signer!) {
      const chainDetails = await signer?.provider?.getNetwork();
      chainId = chainDetails?.chainId;
    } else if ('signTypedData' in signer!) {
      chainId = await signer.getChainId();
    }
    return chainId;
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
      options?: FeedsOptions
    ) => {
      const {
        account = this.account
          ? getFallbackETHCAIPAddress(this.env!, this.account!)
          : null,
        page = Constants.PAGINATION.INITIAL_PAGE,
        limit = Constants.PAGINATION.LIMIT,
        channels = [],
        raw = false,
      } = options || {};
      try {
        // guest mode and valid address check
        this.checkUserAddressExists(account!);
        if (!validateCAIP(account!)) {
          throw new Error('Invalid CAIP');
        }
        const nonCaipAccount =
          account?.split(':')[account?.split(':').length - 1];
        if (channels.length == 0) {
          // else return the response
          return await PUSH_USER.getFeeds({
            user: nonCaipAccount!,
            page: page,
            limit: limit,
            spam: FEED_MAP[spam],
            raw: raw,
            env: this.env,
          });
        } else {
          return await PUSH_USER.getFeedsPerChannel({
            user: nonCaipAccount!,
            page: page,
            limit: limit,
            spam: FEED_MAP[spam],
            raw: raw,
            env: this.env,
            channels: channels,
          });
        }
      } catch (error) {
        throw new Error(`Push SDK Error: API : notifcaiton::list : ${error}`);
      }
    },

    subscriptions: async (options?: SubscriptionOptions) => {
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
          `Push SDK Error: API : notifcaiton::subscriptions : ${error}`
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
      options?: SubscribeUnsubscribeOptions
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
          `Push SDK Error: API : notifcaiton::subscribe : ${error}`
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
      options?: SubscribeUnsubscribeOptions
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
          `Push SDK Error: API : notifcaiton::unsubscribe : ${error}`
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
        throw new Error(`Push SDK Error: API : channel::info : ${error}`);
      }
    },

    /**
     * @description - returns relevant information as per the query that was passed
     * @param {string} query - search query
     * @param {number} [options.page] -  page number. default is set to Constants.PAGINATION.INITIAL_PAGE
     * @param {number} [options.limit] - number of feeds per page. default is set to Constants.PAGINATION.LIMIT
     * @returns Array of results relevant to the serach query
     */
    search: async (query: string, options?: ChannelSearchOptions) => {
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
        throw new Error(`Push SDK Error: API : channel::search : ${error}`);
      }
    },
    /**
     * @description - Get subscribers of a channell
     * @param {string} [options.channel] - channel in caip. defaults to account from signer with eth caip
     * @returns array of subscribers
     */
    subscribers: async (options?: ChannelInfoOptions) => {
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
        return await PUSH_CHANNEL._getSubscribers({
          channel: channel!,
          env: this.env,
        });
      } catch (error) {
        throw new Error(
          `Push SDK Error: API : channel::subscribers : ${error}`
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
        throw new Error(`Push SDK Error: API : channel::send : ${error}`);
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
          config.ABIS.TOKEN,
          config.TOKEN_VIEM_NETWORK_MAP[this.env!]
        );
        const balance = await this.fetchBalance(
          pushTokenContract,
          this.account!
        );
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
        const allowanceAmount = await this.fetchAllownace(
          pushTokenContract,
          this.account!,
          config.CORE_CONFIG[this.env!].EPNS_CORE_CONTRACT
        );
        if (!allowanceAmount.gte(fees)) {
          progressHook?.(PROGRESSHOOK['PUSH-CREATE-02'] as ProgressHookType);
          const approvalRes = await this.approveToken(
            pushTokenContract,
            config.CORE_CONFIG[this.env!].EPNS_CORE_CONTRACT,
            fees
          );
          if (!approvalRes) {
            throw new Error('Something went wrong while approving the token');
          }
        }
        // generate the contract parameters
        const channelType = config.CHANNEL_TYPE['GENERAL'];
        const identity = '1+' + cid;
        const identityBytes = ethers.utils.toUtf8Bytes(identity);
        // call contract
        progressHook?.(PROGRESSHOOK['PUSH-CREATE-03'] as ProgressHookType);
        const createChannelRes = await this.createChannel(
          this.coreContract,
          channelType,
          identityBytes,
          fees
        );
        progressHook?.(PROGRESSHOOK['PUSH-CREATE-04'] as ProgressHookType);
        return { transactionHash: createChannelRes };
      } catch (error) {
        const errorProgressHook = PROGRESSHOOK[
          'PUSH-ERROR-02'
        ] as ProgressHookTypeFunction;
        progressHook?.(errorProgressHook('Create Channel', error));
        throw new Error(
          `Push SDK Error: Contract : createChannelWithPUSH : ${error}`
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
          config.ABIS.TOKEN,
          config.TOKEN_VIEM_NETWORK_MAP[this.env!]
        );
        const balance = await this.fetchBalance(
          pushTokenContract,
          this.account!
        );
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
        const allowanceAmount = await this.fetchAllownace(
          pushTokenContract,
          this.account!,
          config.CORE_CONFIG[this.env!].EPNS_CORE_CONTRACT
        );
        // if allowance is not greater than the fees, dont call approval again
        if (!allowanceAmount.gte(fees)) {
          progressHook?.(PROGRESSHOOK['PUSH-UPDATE-02'] as ProgressHookType);
          const approvalRes = await this.approveToken(
            pushTokenContract,
            config.CORE_CONFIG[this.env!].EPNS_CORE_CONTRACT,
            fees
          );
          if (!approvalRes) {
            throw new Error('Something went wrong while approving the token');
          }
        }
        // generate the contract parameters
        const identity = '1+' + cid;
        const identityBytes = ethers.utils.toUtf8Bytes(identity);
        // call contract
        progressHook?.(PROGRESSHOOK['PUSH-UPDATE-03'] as ProgressHookType);
        const updateChannelRes = await this.updateChannel(
          this.coreContract,
          this.account!,
          identityBytes,
          fees
        );
        progressHook?.(PROGRESSHOOK['PUSH-UPDATE-04'] as ProgressHookType);
        return { transactionHash: updateChannelRes };
      } catch (error) {
        const errorProgressHook = PROGRESSHOOK[
          'PUSH-ERROR-02'
        ] as ProgressHookTypeFunction;
        progressHook?.(errorProgressHook('Update Channel', error));
        throw new Error(`Push SDK Error: Contract channel::update : ${error}`);
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
        if (validateCAIP(channelToBeVerified)) {
          channelToBeVerified = channelToBeVerified.split(':')[2];
        }
        // checks if it is a valid address
        if (!ethers.utils.isAddress(channelToBeVerified)) {
          throw new Error('Invalid channel address');
        }
        // if valid, continue with it
        const res = await this.verifyChannel(
          this.coreContract,
          channelToBeVerified
        );
        if (!res) {
          throw new Error('Something went wrong while verifying the channel');
        }
        return { transactionHash: res };
      } catch (error) {
        throw new Error(`Push SDK Error: Contract channel::verify : ${error}`);
      }
    },

    setting: async (configuration: NotificationSettings) => {
      try {
        this.checkSignerObjectExists();
        // check for PUSH balance
        const pushTokenContract = await this.createContractInstance(
          config.TOKEN[this.env!],
          config.ABIS.TOKEN,
          config.TOKEN_VIEM_NETWORK_MAP[this.env!]
        );
        const balance = await this.fetchBalance(
          pushTokenContract,
          this.account!
        );
        const fees = ethers.utils.parseUnits(
          config.MIN_TOKEN_BALANCE[this.env!].toString(),
          18
        );
        if (fees.gte(balance)) {
          throw new Error('Insufficient PUSH balance');
        }
        const allowanceAmount = await this.fetchAllownace(
          pushTokenContract,
          this.account!,
          config.CORE_CONFIG[this.env!].EPNS_CORE_CONTRACT
        );
        // if allowance is not greater than the fees, dont call approval again
        if (!allowanceAmount.gte(fees)) {
          const approveRes = this.approveToken(
            pushTokenContract,
            config.CORE_CONFIG[this.env!].EPNS_CORE_CONTRACT,
            fees
          );
          if (!approveRes) {
            throw new Error('Something went wrong while approving your token');
          }
        }
        const { setting, description } = this.getMinimalSetting(configuration);
        const createSettingsRes = await this.createChanelSettings(
          this.coreContract,
          configuration.length,
          setting,
          description,
          fees
        );
        return { transactionHash: createSettingsRes };
      } catch (error) {
        throw new Error(
          `Push SDK Error: Contract : channel::setting : ${error}`
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
        throw new Error(`Push SDK Error: API : delegate::get : ${error}`);
      }
    },

    /**
     * @description adds a delegate
     * @param {string} delegate - delegate address in caip to be added
     * @returns the transaction hash if the transaction is successfull
     */
    add: async (delegate: string) => {
      try {
        if (!validateCAIP(delegate)) {
          throw new Error('Invalid CAIP');
        }

        const networkDetails = await this.getChianId(this.signer!);
        if (networkDetails !== parseInt(delegate.split(':')[1])) {
          return new Error('Signer and CAIP chain id doesnt match');
        }
        const caip = `eip155:${networkDetails}`;
        if (!CONFIG[this.env!][caip] || !config.VIEM_CONFIG[this.env!][caip]) {
          throw new Error('Unsupported Chainid');
        }
        const commAddress = CONFIG[this.env!][caip].EPNS_COMMUNICATOR_CONTRACT;
        const commContract = this.createContractInstance(
          commAddress,
          config.ABIS.COMM,
          config.VIEM_CONFIG[this.env!][caip].NETWORK
        );
        const addDelegateRes = await this.addDelegator(
          commContract,
          delegate.split(':')[2]
        );
        return { transactionHash: addDelegateRes };
      } catch (error) {
        throw new Error(`Push SDK Error: Contract : delegate::add : ${error}`);
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

        const networkDetails = await this.getChianId(this.signer!);
        if (networkDetails !== parseInt(delegate.split(':')[1])) {
          return new Error('Signer and CAIP chain id doesnt match');
        }
        const caip = `eip155:${networkDetails}`;
        if (!CONFIG[this.env!][caip] || !config.VIEM_CONFIG[this.env!][caip]) {
          throw new Error('Unsupported Chainid');
        }
        const commAddress = CONFIG[this.env!][caip].EPNS_COMMUNICATOR_CONTRACT;
        const commContract = this.createContractInstance(
          commAddress,
          config.ABIS.COMM,
          config.VIEM_CONFIG[this.env!][caip].NETWORK
        );
        const removeDelegateRes = await this.removeDelegator(
          commContract,
          delegate.split(':')[2]
        );
        return { transactionHash: removeDelegateRes };
      } catch (error) {
        throw new Error(
          `Push SDK Error: Contract : delegate::remove : ${error}`
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
        throw new Error(`Push SDK Error: API : alias::info : ${error}`);
      }
    },
  };
}
