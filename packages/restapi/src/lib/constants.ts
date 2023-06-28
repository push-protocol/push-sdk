export enum ENV {
  PROD = 'prod',
  STAGING = 'staging',
  DEV = 'dev',
  /**
   * **This is for local development only**
   */
  LOCAL = 'local',
}

export enum ENCRYPTION_TYPE {
  PGP_V1 = 'x25519-xsalsa20-poly1305',
  PGP_V2 = 'aes256GcmHkdfSha256',
  PGP_V3 = 'eip191-aes256-gcm-hkdf-sha256',
  NFTPGP_V1 = 'pgpv1:nft',
}

const Constants = {
  ENV,
  ENCRYPTION_TYPE,
  PAGINATION: {
    INITIAL_PAGE: 1,
    LIMIT: 10,
    LIMIT_MIN: 1,
    LIMIT_MAX: 50,
  },
  DEFAULT_CHAIN_ID: 11155111,
  DEV_CHAIN_ID: 99999,
  NON_ETH_CHAINS: [137, 80001, 56, 97, 10, 420, 1442, 1101],
  ETH_CHAINS: [1, 11155111],
  ENC_TYPE_V1: 'x25519-xsalsa20-poly1305',
  ENC_TYPE_V2: 'aes256GcmHkdfSha256',
  ENC_TYPE_V3: 'eip191-aes256-gcm-hkdf-sha256',
  ENC_TYPE_V4: 'pgpv1:nft',
};

export default Constants;
