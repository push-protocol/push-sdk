import { ProgressHookType } from '../types';
import * as PUSH_USER from '../user';
import { ENV } from '../constants';
import { PushAPI } from './PushAPI';
import { LRUCache } from 'lru-cache';
import {
  IGetProfileInfoOptions,
  IProfileInfoResponseV1,
  IProfileInfoResponseV2,
  IUpdateProfileRequest,
} from '../interfaces/iprofile';

export function createProfileResponseV2(
  response: IProfileInfoResponseV1,
  raw: boolean
): IProfileInfoResponseV2 {
  const profileResponse: IProfileInfoResponseV2 = {
    name: response.name,
    desc: response.desc,
    image: response.picture,
  };

  if (raw) {
    profileResponse.raw = {
      profileVerificationProof: response.profileVerificationProof,
    };
  }

  return profileResponse;
}
export class Profile {
  constructor(
    private account: string,
    private env: ENV,
    private cache: LRUCache<string, any>,
    private decryptedPgpPvtKey?: string,
    private progressHook?: (progress: ProgressHookType) => void
  ) {
    const info = async (
      options?: IGetProfileInfoOptions
    ): Promise<IProfileInfoResponseV1> => {
      const accountToUse = options?.overrideAccount || this.account;
      const cacheKey = `profile-${accountToUse}-v1`;

      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const response = await PUSH_USER.get({
        account: accountToUse,
        env: this.env,
      });

      const responseProfile = response.profile;

      const profileResponseV1: IProfileInfoResponseV1 = {
        name: responseProfile.name,
        desc: responseProfile.desc,
        picture: responseProfile.picture,
        blockedUsersList: responseProfile.blockedUsersList,
        profileVerificationProof: responseProfile.profileVerificationProof,
      };

      this.cache.set(cacheKey, profileResponseV1);
      return profileResponseV1;
    };

    const infoV2 = async (
      options?: IGetProfileInfoOptions
    ): Promise<IProfileInfoResponseV2> => {
      const accountToUse = options?.overrideAccount || this.account;
      const { raw = false } = options || {};
      const cacheKey = `profile-${accountToUse}-v2`;

      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const response = await PUSH_USER.get({
        account: accountToUse,
        env: this.env,
      });

      const profileResponse = createProfileResponseV2(response.profile, raw);
      this.cache.set(cacheKey, profileResponse);
      return profileResponse;
    };

    (info as any).v2 = infoV2;
    this.info = info as any;

    const update = async (
      options: IUpdateProfileRequest
    ): Promise<IProfileInfoResponseV1> => {
      if (!this.decryptedPgpPvtKey) {
        throw new Error(PushAPI.ensureSignerMessage());
      }

      const { name, desc, picture } = options;
      const response = await PUSH_USER.profile.update({
        pgpPrivateKey: this.decryptedPgpPvtKey,
        account: this.account,
        profile: { name, desc, picture },
        env: this.env,
        progressHook: this.progressHook,
      });

      const cacheKey = `profile-${this.account}`;
      this.cache.delete(cacheKey);

      return response.profile as IProfileInfoResponseV1;
    };

    const updateV2 = async (
      options: IUpdateProfileRequest & { raw?: boolean }
    ): Promise<IProfileInfoResponseV2> => {
      if (!this.decryptedPgpPvtKey) {
        throw new Error(PushAPI.ensureSignerMessage());
      }

      const { name, desc, picture, raw = false } = options;
      const response = await PUSH_USER.profile.update({
        pgpPrivateKey: this.decryptedPgpPvtKey,
        account: this.account,
        profile: { name, desc, picture },
        env: this.env,
        progressHook: this.progressHook,
      });

      return createProfileResponseV2(response.profile, raw);
    };

    (update as any).v2 = updateV2;
    this.update = update as any;
  }

  info!: {
    (options?: IGetProfileInfoOptions): Promise<IProfileInfoResponseV1>;
    v2(options?: IGetProfileInfoOptions): Promise<IProfileInfoResponseV2>;
  };

  update!: {
    (options: IUpdateProfileRequest): Promise<IProfileInfoResponseV1>;
    v2(
      options: IUpdateProfileRequest & { raw?: boolean }
    ): Promise<IProfileInfoResponseV2>;
  };
}
