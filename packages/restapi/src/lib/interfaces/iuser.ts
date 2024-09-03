import { IUser } from '../types';

export interface IGetUserInfoOptions {
  overrideAccount?: string;
  raw?: boolean;
  version?: number;
}

export interface UserProfileResponseV2 {
  name: string | null;
  desc: string | null;
  image: string | null;
}
export interface UserResponseV2 {
  did: string;
  wallets: string;
  origin: string | null | undefined;
  profile: UserProfileResponseV2;
  pushPubKey: string;
  config: {
    blocked: string[] | null;
  };
  raw?: {
    keysVerificationProof: string | null;
    profileVerificationProof: string | null;
    configVerificationProof: string | null;
  };
}
