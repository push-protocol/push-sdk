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
  NFTPGP_V2 = 'pgpv2:nft',
}

/**
 * SUPPORTED MESSAGE TYPES FOR PUSH CHAT
 */
export enum MessageType {
  TEXT = 'Text',
  IMAGE = 'Image',
  FILE = 'File',
  MEDIA_EMBED = 'MediaEmbed',
  META = 'Meta',
  REACTION = 'Reaction',
  /**
   * @deprecated - Use MediaEmbed Instead
   */
  GIF = 'GIF',

  // TODO
  // AUDIO = 'Audio',
  // VIDEO = 'Video',
  // PAYMENT = 'Payment',
  // REPLY = 'Reply',
  // COMPOSITE = 'Composite',
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
  ENC_TYPE_V5: 'pgpv2:nft',
};

export default Constants;
