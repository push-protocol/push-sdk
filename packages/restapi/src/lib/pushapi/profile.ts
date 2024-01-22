import { ProgressHookType } from '../types';
import * as PUSH_USER from '../user';
import { ENV } from '../constants';
import { PushAPI } from './PushAPI';
import { InfoOptions } from './pushAPITypes';
import { LRUCache } from 'lru-cache';

export class Profile {
  private static cache = new LRUCache<string, any>({
    max: 200,
    maxSize: 500 * 1024, // 500KB
    sizeCalculation: (value, key) => {
      return typeof value === 'string'
        ? value.length
        : new TextEncoder().encode(JSON.stringify(value)).length;
    },
    ttl: 1000 * 60 * 5, // 5 minutes
    allowStale: false,
  });

  constructor(
    private account: string,
    private env: ENV,
    private decryptedPgpPvtKey?: string,
    private progressHook?: (progress: ProgressHookType) => void
  ) {}

  async info(options?: InfoOptions) {
    const accountToUse = options?.overrideAccount || this.account;
    const cacheKey = `profile-${accountToUse}`;

    console.log(`Fetching profile info for account: ${accountToUse}`);

    // Check if the profile is already in the cache
    if (Profile.cache.has(cacheKey)) {
      console.log(`Profile data for ${accountToUse} found in cache.`);
      return Profile.cache.get(cacheKey);
    }

    console.log(
      `Profile data for ${accountToUse} not in cache, fetching from API.`
    );

    // If not in cache, fetch from API
    const response = await PUSH_USER.get({
      account: accountToUse,
      env: this.env,
    });
    // Cache the profile data
    Profile.cache.set(cacheKey, response.profile);
    return response.profile;
  }

  async update(options: { name?: string; desc?: string; picture?: string }) {
    if (!this.decryptedPgpPvtKey) {
      throw new Error(PushAPI.ensureSignerMessage());
    }

    console.log(`Updating profile for account: ${this.account}`);

    const { name, desc, picture } = options;
    const response = await PUSH_USER.profile.update({
      pgpPrivateKey: this.decryptedPgpPvtKey,
      account: this.account,
      profile: { name, desc, picture },
      env: this.env,
      progressHook: this.progressHook,
    });

    const cacheKey = `profile-${this.account}`;
    Profile.cache.delete(cacheKey);
    console.log(
      `Profile update successful. Cache cleared for account: ${this.account}`
    );

    return response.profile;
  }
}
