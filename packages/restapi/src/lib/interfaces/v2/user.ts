export interface UserResponseV2 {
  did: string;
  wallets: string;
  origin: string | null | undefined;
  profile: UserProfileDataV2;
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

export interface UserProfileDataV2 {
  name: string | null;
  desc: string | null;
  image: string | null;
}

export interface UserProfileResponseV2 extends UserProfileDataV2 {
  raw?: {
    profileVerificationProof: string | null;
  };
}

export interface GetUserRequestV2 {
  overrideAccount?: string;
  raw?: boolean;
}

export interface GetUserProfileRequestV2 {
  overrideAccount?: string;
  raw?: boolean;
}

export interface UpdateUserProfileRequestV2 {
  name?: string;
  desc?: string;
  picture?: string;
  raw?: boolean;
}

export interface GetUserEncryptionResponseV2 {
  pushPrivKey?: string;
  pushPubKey?: string;
  decryptedPassword?: string;
}

export interface UpdateUserEncryptionRequestOptionsV2 {
  versionMeta?: {
    NFTPGP_V1?: { password: string };
  };
  raw?: boolean;
}
