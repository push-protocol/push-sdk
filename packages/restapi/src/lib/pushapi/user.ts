import * as PUSH_USER from '../user';
import { ENV } from '../constants';
import { InfoOptions } from './pushAPITypes';

export class User {
  constructor(private account: string, private env: ENV) {}

  async info(options?: InfoOptions) {
    const accountToUse = options?.overrideAccount || this.account;
    return await PUSH_USER.get({
      account: accountToUse,
      env: this.env,
    });
  }
}
