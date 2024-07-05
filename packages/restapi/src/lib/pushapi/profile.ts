import { ProgressHookType } from '../types';
import * as PUSH_USER from '../user';
import { ENV } from '../constants';
import { PushAPI } from './PushAPI';
import { LRUCache } from 'lru-cache';
import {
  IGetProfileInfoOptions,
  IProfileInfoResponse,
  IProfileInfoResponseV1,
  IProfileInfoResponseV2,
  IUpdateProfileRequest,
} from '../interfaces/iprofile';

export class Profile {
  constructor(
    private account: string,
    private env: ENV,
    private cache: LRUCache<string, any>,
    private decryptedPgpPvtKey?: string,
    private progressHook?: (progress: ProgressHookType) => void
  ) {}

  async info(options?: IGetProfileInfoOptions): Promise<IProfileInfoResponse> {
    const accountToUse = options?.overrideAccount || this.account;
    const { raw = false, version = 1 } = options || {};
    const cacheKey = `profile-${accountToUse}-v${version}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const response = await PUSH_USER.get({
      account: accountToUse,
      env: this.env,
    });

    const responseProfile = response.profile;

    if (version === 2) {
      const profileResponse: IProfileInfoResponseV2 = {
        name: responseProfile.name,
        desc: responseProfile.desc,
        image: responseProfile.picture,
      };

      if (raw) {
        profileResponse.raw = {
          profileVerificationProof: responseProfile.profileVerificationProof,
        };
      }

      this.cache.set(cacheKey, profileResponse);
      return profileResponse;
    }

    const profileResponseV1: IProfileInfoResponseV1 = {
      name: responseProfile.name,
      desc: responseProfile.desc,
      picture: responseProfile.picture,
      blockedUsersList: responseProfile.blockedUsersList,
      profileVerificationProof: responseProfile.profileVerificationProof,
    };

    this.cache.set(cacheKey, profileResponseV1);
    return profileResponseV1;
  }

  async update(options: IUpdateProfileRequest): Promise<IProfileInfoResponse> {
    if (!this.decryptedPgpPvtKey) {
      throw new Error(PushAPI.ensureSignerMessage());
    }

    const { name, desc, picture, raw = false, version = 1 } = options;
    const response = await PUSH_USER.profile.update({
      pgpPrivateKey: this.decryptedPgpPvtKey,
      account: this.account,
      profile: { name, desc, picture },
      env: this.env,
      progressHook: this.progressHook,
    });

    const cacheKey = `profile-${this.account}`;
    this.cache.delete(cacheKey);

    if (version === 2) {
      const profileResponse: IProfileInfoResponseV2 = {
        name: response.profile.name,
        desc: response.profile.desc,
        image: response.profile.picture,
      };

      if (raw) {
        profileResponse.raw = {
          profileVerificationProof: response.profile.profileVerificationProof,
        };
      }
      return profileResponse;
    }
    return response.profile as IProfileInfoResponseV1;
  }
}
