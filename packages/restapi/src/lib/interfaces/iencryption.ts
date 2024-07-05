export interface IUpdateEncryptionOptions {
  versionMeta?: {
    NFTPGP_V1?: { password: string };
  };
  raw?: boolean;
  version?: number;
}

export interface IGetEncryptionResponseV1 {
  decryptedPgpPrivateKey?: string;
  pgpPublicKey?: string;
  decryptedPassword?: string;
}

export interface IGetEncryptionResponseV2 {
  pushPrivKey?: string;
  pushPubKey?: string;
  decryptedPassword?: string;
}

export type IGetEncryptionResponse =
  | IGetEncryptionResponseV1
  | IGetEncryptionResponseV2;
