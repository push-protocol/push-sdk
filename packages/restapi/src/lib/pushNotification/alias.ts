import { ENV } from '../constants';
import { AliasOptions } from './PushNotificationTypes';

import * as PUSH_ALIAS from '../alias';


export class Alias {
  private env: ENV
  constructor(env: ENV) {
    this.env = env
  }

  /**
   * @description - fetches alias information
   * @param {AliasOptions} options - options related to alias
   * @returns Alias details
   */
  info = async (options: AliasOptions) => {
    try {
      return await PUSH_ALIAS.getAliasInfo({ ...options, env: this.env });
    } catch (error) {
      throw new Error(`Push SDK Error: API : alias::info : ${error}`);
    }
  };
}
