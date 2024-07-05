import { IUser } from '../types';

export interface IGetUserInfoOptions {
  overrideAccount?: string;
  raw?: boolean;
  version?: number;
}

export interface IUserInfoResponseV2 {
  did: string;
  wallets: string;
  origin: string | null | undefined;
  profile: {
    name: string | null;
    desc: string | null;
    image: string | null;
  };
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
