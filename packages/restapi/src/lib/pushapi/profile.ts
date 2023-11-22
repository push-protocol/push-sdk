import { ProgressHookType } from '../types';
import * as PUSH_USER from '../user';
import { ENV } from '../constants';
import { PushAPI } from './PushAPI';

export class Profile {
  constructor(
    private account: string,
    private env: ENV,
    private decryptedPgpPvtKey?: string,
    private progressHook?: (progress: ProgressHookType) => void
  ) {}

  async info() {
    const response = await PUSH_USER.get({
      account: this.account,
      env: this.env,
    });
    return response.profile;
  }

  async update(options: { name?: string; desc?: string; picture?: string }) {
     if (!this.decryptedPgpPvtKey) {
       throw new Error(PushAPI.ensureSignerMessage());
     }
    const { name, desc, picture } = options;
    const response = await PUSH_USER.profile.update({
      pgpPrivateKey: this.decryptedPgpPvtKey,
      account: this.account,
      profile: {
        name: name,
        desc: desc,
        picture: picture,
      },
      env: this.env,
      progressHook: this.progressHook,
    });
    return response.profile;
  }
}
