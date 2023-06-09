// ignore_for_file: constant_identifier_names, camel_case_types

enum ENV {
  PROD,
  STAGING,
  DEV,
  LOCAL,
}

enum ENCRYPTION_TYPE {
  PGP_V1,
  PGP_V2,
  PGP_V3,
  NFTPGP_V1,
}

class Constants {
  static const Map<String, dynamic> PAGINATION = {
    'INITIAL_PAGE': 1,
    'LIMIT': 10,
    'LIMIT_MIN': 1,
    'LIMIT_MAX': 50,
  };
  static const int DEFAULT_CHAIN_ID = 5;
  static const int DEV_CHAIN_ID = 99999;
  static const List<int> NON_ETH_CHAINS = [
    137,
    80001,
    56,
    97,
    10,
    420,
    1442,
    1101
  ];
  static const List<int> ETH_CHAINS = [1, 5];
  static const String ENC_TYPE_V1 = 'x25519-xsalsa20-poly1305';
  static const String ENC_TYPE_V2 = 'aes256GcmHkdfSha256';
  static const String ENC_TYPE_V3 = 'eip191-aes256-gcm-hkdf-sha256';
  static const String ENC_TYPE_V4 = 'pgpv1:nft';
}
