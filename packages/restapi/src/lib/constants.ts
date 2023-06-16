/**
 * SUPPORTED ENVIRONEMENTS
 */
export enum ENV {
  PROD = 'prod',
  STAGING = 'staging',
  DEV = 'dev',
  /**
   * **This is for local development only**
   */
  LOCAL = 'local',
}

/**
 * SUPPORTED ENCRYPTIONS FOR PUSH PROFILE
 */
export enum ENCRYPTION_TYPE {
  PGP_V1 = 'x25519-xsalsa20-poly1305',
  PGP_V2 = 'aes256GcmHkdfSha256',
  PGP_V3 = 'eip191-aes256-gcm-hkdf-sha256',
  NFTPGP_V1 = 'pgpv1:nft',
}

/**
 * SUPPORTED MESSAGE TYPES FOR PUSH CHAT
 */
export enum MessageType {
  Text = 1,
  Image = 2,
  /**
   * @deprecated
   */
  GIF = 3,
  Payment = 4,
  Video = 5,
  Audio = 6,
  File = 7,
  MediaEmbed = 8,
  Meta = 9,
  Custom = 10,
  Reply = 11,
  Composite = 12,
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
  DEFAULT_CHAIN_ID: 5,
  DEV_CHAIN_ID: 99999,
  NON_ETH_CHAINS: [137, 80001, 56, 97, 10, 420, 1442, 1101],
  ETH_CHAINS: [1, 5],
  ENC_TYPE_V1: 'x25519-xsalsa20-poly1305',
  ENC_TYPE_V2: 'aes256GcmHkdfSha256',
  ENC_TYPE_V3: 'eip191-aes256-gcm-hkdf-sha256',
  ENC_TYPE_V4: 'pgpv1:nft',
};

export default Constants;
