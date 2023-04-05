export enum ENV {
  PROD = 'prod',
  STAGING = 'staging',
  DEV = 'dev',
}

const Constants = {
  ENV,
  PAGINATION: {
    INITIAL_PAGE: 1,
    LIMIT: 10,
    LIMIT_MIN: 1,
    LIMIT_MAX: 50,
  },
  DEFAULT_CHAIN_ID: 5,
  DEV_CHAIN_ID: 99999,
  NON_ETH_CHAINS: [137, 80001, 56, 97, 10, 420],
  ETH_CHAINS: [1, 5],
  ENC_TYPE_V1: 'x25519-xsalsa20-poly1305',
  ENC_TYPE_V2: 'aes256GcmHkdfSha256',
  ENC_TYPE_V3: 'eip191-aes256-gcm-hkdf-sha256',
};

export default Constants;
