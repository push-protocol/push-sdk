import * as PUSH_USER from '../user';
import { ENV } from '../constants';
import { IUser } from '../types';
import { IGetUserInfoOptions, UserResponseV2 } from '../interfaces/iuser';

export function createUserResponseV2(
  response: IUser,
  raw: boolean
): UserResponseV2 {
  const profileResponse: UserResponseV2 = {
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
      configVerificationProof: response.config?.configVerificationProof || null,
    };
  }

  return profileResponse;
}
export class User {
  constructor(private account: string, private env: ENV) {
    const info = async (options?: IGetUserInfoOptions): Promise<IUser> => {
      const accountToUse = options?.overrideAccount || this.account;

      const response = await PUSH_USER.get({
        account: accountToUse,
        env: this.env,
      });

      return response;
    };

    const infoV2 = async (
      options?: IGetUserInfoOptions
    ): Promise<UserResponseV2> => {
      const accountToUse = options?.overrideAccount || this.account;
      const { raw = false } = options || {};

      const response = await PUSH_USER.get({
        account: accountToUse,
        env: this.env,
      });

      return createUserResponseV2(response, raw);
    };

    (info as any).v2 = infoV2;
    this.info = info as any;
  }

  info!: {
    (options?: IGetUserInfoOptions): Promise<IUser>;
    v2(options?: IGetUserInfoOptions): Promise<UserResponseV2>;
  };
}
