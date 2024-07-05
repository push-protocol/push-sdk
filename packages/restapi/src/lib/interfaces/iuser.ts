import { IUser } from '../types';

export interface IGetUserInfoOptions {
  overrideAccount?: string;
  raw?: boolean;
  version?: number;
}

export interface IUserProfile {
  name: string | null;
  desc: string | null;
  image: string | null;
}

export interface IUserInfoResponseV2 {
  did: string;
  wallets: string;
  origin: string | null | undefined;
  profile: IUserProfile;
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

export type IUserInfoResponse = IUser | IUserInfoResponseV2;
