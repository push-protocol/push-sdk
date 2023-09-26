import * as PUSH_USER from '../user';
import { ENV } from '../constants';

export class UserInfo {
  constructor(private account: string, private env: ENV) {}

  async info() {
    return await PUSH_USER.get({
      account: this.account,
      env: this.env,
    });
  }
}
