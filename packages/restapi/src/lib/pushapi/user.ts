import * as PUSH_USER from '../user';
import { ENV } from '../constants';
import { IUser } from '../types';
import {
  IGetUserInfoOptions,
  IUserInfoResponse,
  IUserInfoResponseV2,
} from '../interfaces/iuser';

export class User {
  constructor(private account: string, private env: ENV) {}

  async info(options?: IGetUserInfoOptions): Promise<IUserInfoResponse> {
    const accountToUse = options?.overrideAccount || this.account;
    const { raw = false, version = 1 } = options || {};

    const response = await PUSH_USER.get({
      account: accountToUse,
      env: this.env,
    });

    if (version === 2) {
      const profileResponse: IUserInfoResponseV2 = {
        did: response.did,
        wallets: response.wallets,
        origin: response.origin,
        profile: {
          name: response.profile.name,
          desc: response.profile.desc,
          image: response.profile.picture,
        },
        pushPubKey: response.publicKey,
        config: { blocked: response.profile.blockedUsersList },
      };

      if (raw) {
        profileResponse.raw = {
          keysVerificationProof: response.verificationProof || null,
          profileVerificationProof:
            response.profile?.profileVerificationProof || null,
          configVerificationProof:
            response.config?.configVerificationProof || null,
        };
      }

      return profileResponse;
    }

    return response as IUser;
  }
}
