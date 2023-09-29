import Constants, { ENV } from '../constants';
import {
  SignerType,
  ProgressHookType,
  ProgressHookTypeFunction,
} from '../types';
import {
  ChannelInfoOptions,
  ChannelSearchOptions,
  NotificationOptions,
  CreateChannelOptions,
  NotificationSettings,
} from './PushNotificationTypes';
import * as config from '../config';
import * as PUSH_PAYLOAD from '../payloads';
import * as PUSH_CHANNEL from '../channels';
import {
  getCAIPDetails,
  validateCAIP,
  getFallbackETHCAIPAddress,
} from '../helpers';
import PROGRESSHOOK from '../progressHook';
import { ethers } from 'ethers';

import { PushNotificationBaseClass } from './pushNotificationBase';

export class Channel extends PushNotificationBaseClass {
  constructor(signer?: SignerType, env?: ENV, account?: string) {
    super(signer, env, account);
  }

  /**
   * @description - returns information about a channel
   * @param {string} [options.channel] - channel address in caip, defaults to eth caip address
   * @returns information about the channel if it exists
   */
  info = async (channel?: string) => {
    try {
      this.checkUserAddressExists(channel);
      channel = channel ?? getFallbackETHCAIPAddress(this.env!, this.account!);
      return await PUSH_CHANNEL.getChannel({
        channel: channel as string,
        env: this.env,
      });
    } catch (error) {
      throw new Error(`Push SDK Error: API : channel::info : ${error}`);
    }
  };

  /**
   * @description - returns relevant information as per the query that was passed
   * @param {string} query - search query
   * @param {number} [options.page] -  page number. default is set to Constants.PAGINATION.INITIAL_PAGE
   * @param {number} [options.limit] - number of feeds per page. default is set to Constants.PAGINATION.LIMIT
   * @returns Array of results relevant to the serach query
   */
  search = async (query: string, options?: ChannelSearchOptions) => {
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
  };
  /**
   * @description - Get subscribers of a channell
   * @param {string} [options.channel] - channel in caip. defaults to account from signer with eth caip
   * @returns array of subscribers
   */
  subscribers = async (options?: ChannelInfoOptions) => {
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
      throw new Error(`Push SDK Error: API : channel::subscribers : ${error}`);
    }
  };
  /**
   *
   * @param {string[]} recipients - Array of recipients. `['0x1'] -> TARGET`, `['0x1, 0x2'] -> SUBSET`, `['*'] -> BROADCAST`
   * @param {object} options - Notification options
   * @returns
   */
  send = async (recipients: string[], options: NotificationOptions) => {
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
  };

  create = async (options: CreateChannelOptions) => {
    const {
      name,
      description,
      url,
      icon,
      alias = null,
      progressHook,
    } = options || {};
    try {
      if ('_signTypedData' in this.signer!) {
        if (!this.signer || !this.signer.provider) {
          throw new Error('ethers provider/signer is not provided');
        }
      } else if ('signTypedData' in this.signer!) {
        if (!this.coreContract.write) {
          throw new Error('viem signer is not provided');
        }
      } else {
        throw new Error('Unsupported Signer');
      }
      // create push token instance
      let aliasInfo;
      // validate all the parameters and length
      this.validateChannelParameters(options);
      // check for PUSH balance
      const pushTokenContract = await this.createContractInstance(
        config.TOKEN[this.env!],
        config.ABIS.TOKEN,
        config.TOKEN_VIEM_NETWORK_MAP[this.env!]
      );
      const balance = await this.fetchBalance(pushTokenContract, this.account!);
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
  };

  update = async (options: CreateChannelOptions) => {
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
      if ('_signTypedData' in this.signer!) {
        if (!this.signer || !this.signer.provider) {
          throw new Error('ethers provider/signer is not provided');
        }
      } else if ('signTypedData' in this.signer!) {
        if (!this.coreContract.write) {
          throw new Error('viem signer is not provided');
        }
      } else {
        throw new Error('Unsupported Signer');
      }
      // validate all the parameters and length
      this.validateChannelParameters(options);
      // check for PUSH balance
      const pushTokenContract = await this.createContractInstance(
        config.TOKEN[this.env!],
        config.ABIS.TOKEN,
        config.TOKEN_VIEM_NETWORK_MAP[this.env!]
      );
      const balance = await this.fetchBalance(pushTokenContract, this.account!);
      // get counter
      const counter = await this.fetchUpdateCounter(this.coreContract, this.account!);
      const fees = ethers.utils.parseUnits(
        config.MIN_TOKEN_BALANCE[this.env!].toString(),
        18
      );
      const totalFees = fees.mul(counter)
      if (totalFees.gte(balance)) {
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
      if (!allowanceAmount.gte(totalFees)) {
        progressHook?.(PROGRESSHOOK['PUSH-UPDATE-02'] as ProgressHookType);
        const approvalRes = await this.approveToken(
          pushTokenContract,
          config.CORE_CONFIG[this.env!].EPNS_CORE_CONTRACT,
          totalFees
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
        totalFees
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
  };
  /**
   * @description verifies a channel
   * @param {string} channelToBeVerified - address of the channel to be verified
   * @returns the transaction hash if the transaction is successful
   */
  verify = async (channelToBeVerified: string) => {
    try {
      this.checkSignerObjectExists();
      if ('_signTypedData' in this.signer!) {
        if (!this.signer || !this.signer.provider) {
          throw new Error('ethers provider/signer is not provided');
        }
      } else if ('signTypedData' in this.signer!) {
        if (!this.coreContract.write) {
          throw new Error('viem signer is not provided');
        }
      } else {
        throw new Error('Unsupported Signer');
      }
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
  };

  setting = async (configuration: NotificationSettings) => {
    try {
      this.checkSignerObjectExists();
      //TODO: create a separate function later
      if ('_signTypedData' in this.signer!) {
        if (!this.signer || !this.signer.provider) {
          throw new Error('ethers provider/signer is not provided');
        }
      } else if ('signTypedData' in this.signer!) {
        if (!this.coreContract.write) {
          throw new Error('viem signer is not provided');
        }
      } else {
        throw new Error('Unsupported Signer');
      }
      // check for PUSH balance
      const pushTokenContract = await this.createContractInstance(
        config.TOKEN[this.env!],
        config.ABIS.TOKEN,
        config.TOKEN_VIEM_NETWORK_MAP[this.env!]
      );
      const balance = await this.fetchBalance(pushTokenContract, this.account!);
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
        const approveRes = await this.approveToken(
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
      throw new Error(`Push SDK Error: Contract : channel::setting : ${error}`);
    }
  };
}
