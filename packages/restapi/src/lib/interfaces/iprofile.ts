export interface IUpdateProfileRequest {
  name?: string;
  desc?: string;
  picture?: string;
  raw?: boolean;
  version?: number;
}

export interface IGetProfileInfoOptions {
  overrideAccount?: string;
  raw?: boolean;
}

export interface IProfileInfoResponseV1 {
  name: string | null;
  desc: string | null;
  picture: string | null;
  blockedUsersList: string[] | null;
  profileVerificationProof: string | null;
}
