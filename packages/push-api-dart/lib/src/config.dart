// ignore_for_file: non_constant_identifier_names, constant_identifier_names

import '../push_api_dart.dart';

// for methods not needing the entire config

const BLOCKCHAIN_NETWORK = {
  'ETH_MAINNET': 'eip155:1',
  'ETH_GOERLI': 'eip155:5',
  'POLYGON_MAINNET': 'eip155:137',
  'POLYGON_MUMBAI': 'eip155:80001',
  'BSC_MAINNET': 'eip155:56',
  'BSC_TESTNET': 'eip155:97',
  'OPTIMISM_TESTNET': 'eip155:420',
  'OPTIMISM_MAINNET': 'eip155:10',
  'POLYGON_ZK_EVM_TESTNET': 'eip155:1442',
  'POLYGON_ZK_EVM_MAINNET': 'eip155:1101'
};

// typedef ALIAS_CHAIN = 'POLYGON' | 'BSC' | 'OPTIMISM' | 'POLYGONZKEVM';

const ALIAS_CHAIN_ID = {
  'POLYGON': {
    ENV.prod: 137,
    ENV.staging: 80001,
    ENV.dev: 80001,
    ENV.local: 80001,
  },
  'BSC': {
    ENV.prod: 56,
    ENV.staging: 97,
    ENV.dev: 97,
    ENV.local: 97,
  },
  'OPTIMISM': {
    ENV.prod: 10,
    ENV.staging: 420,
    ENV.dev: 420,
    ENV.local: 420,
  },
  'POLYGONZKEVM': {
    ENV.prod: 1101,
    ENV.staging: 1442,
    ENV.dev: 1442,
    ENV.local: 420,
  }
};

class ConfigType {
  String? API_BASE_URL;
  String EPNS_COMMUNICATOR_CONTRACT;

  ConfigType({
    required this.API_BASE_URL,
    required this.EPNS_COMMUNICATOR_CONTRACT,
  });
}

final CONFIG = {
  ENV.prod: {
    BLOCKCHAIN_NETWORK['ETH_MAINNET']: ConfigType(
      API_BASE_URL: Api.getAPIBaseUrls(ENV.prod),
      // API_BASE_URL: Api.getAPIBaseUrls(ENV.prod),
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    ),
    BLOCKCHAIN_NETWORK['POLYGON_MAINNET']: ConfigType(
      API_BASE_URL: Api.getAPIBaseUrls(ENV.prod),
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    ),
    BLOCKCHAIN_NETWORK['BSC_MAINNET']: ConfigType(
      API_BASE_URL: Api.getAPIBaseUrls(ENV.prod),
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    ),
    BLOCKCHAIN_NETWORK['OPTIMISM_MAINNET']: ConfigType(
      API_BASE_URL: Api.getAPIBaseUrls(ENV.prod),
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    ),
    BLOCKCHAIN_NETWORK['POLYGON_ZK_EVM_MAINNET']: ConfigType(
      API_BASE_URL: Api.getAPIBaseUrls(ENV.prod),
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    ),
  },
  ENV.staging: {
    BLOCKCHAIN_NETWORK['ETH_GOERLI']: ConfigType(
      API_BASE_URL: Api.getAPIBaseUrls(ENV.staging),
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    ),
    BLOCKCHAIN_NETWORK['POLYGON_MUMBAI']: ConfigType(
      API_BASE_URL: Api.getAPIBaseUrls(ENV.staging),
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    ),
    BLOCKCHAIN_NETWORK['BSC_TESTNET']: ConfigType(
      API_BASE_URL: Api.getAPIBaseUrls(ENV.staging),
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    ),
    BLOCKCHAIN_NETWORK['OPTIMISM_TESTNET']: ConfigType(
      API_BASE_URL: Api.getAPIBaseUrls(ENV.staging),
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    ),
    BLOCKCHAIN_NETWORK['POLYGON_ZK_EVM_TESTNET']: ConfigType(
      API_BASE_URL: Api.getAPIBaseUrls(ENV.staging),
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    ),
  },
  ENV.dev: {
    BLOCKCHAIN_NETWORK['ETH_GOERLI']: ConfigType(
      API_BASE_URL: Api.getAPIBaseUrls(ENV.dev),
      EPNS_COMMUNICATOR_CONTRACT: '0xc064F30bac07e84500c97A04D21a9d1bfFC72Ec0',
    ),
    BLOCKCHAIN_NETWORK['POLYGON_MUMBAI']: ConfigType(
      API_BASE_URL: Api.getAPIBaseUrls(ENV.dev),
      EPNS_COMMUNICATOR_CONTRACT: '0xAf55BE8e6b0d6107891bA76eADeEa032ef8A4504',
    ),
    BLOCKCHAIN_NETWORK['BSC_TESTNET']: ConfigType(
      API_BASE_URL: Api.getAPIBaseUrls(ENV.dev),
      EPNS_COMMUNICATOR_CONTRACT: '0x4132061E3349ff36cFfCadA460E10Bd4f31F7ea8',
    ),
    BLOCKCHAIN_NETWORK['OPTIMISM_TESTNET']: ConfigType(
      API_BASE_URL: Api.getAPIBaseUrls(ENV.dev),
      EPNS_COMMUNICATOR_CONTRACT: '0x4305D572F2bf38Fc2AE8D0172055b1EFd18F57a6',
    ),
    BLOCKCHAIN_NETWORK['POLYGON_ZK_EVM_TESTNET']: ConfigType(
      API_BASE_URL: Api.getAPIBaseUrls(ENV.dev),
      EPNS_COMMUNICATOR_CONTRACT: '0x630b152e4185c63D7177c656b56b26f878C61572',
    ),
  },
  ENV.local: {
    BLOCKCHAIN_NETWORK['ETH_GOERLI']: ConfigType(
      API_BASE_URL: Api.getAPIBaseUrls(ENV.local),
      EPNS_COMMUNICATOR_CONTRACT: '0xc064F30bac07e84500c97A04D21a9d1bfFC72Ec0',
    ),
    BLOCKCHAIN_NETWORK['POLYGON_MUMBAI']: ConfigType(
      API_BASE_URL: Api.getAPIBaseUrls(ENV.local),
      EPNS_COMMUNICATOR_CONTRACT: '0xAf55BE8e6b0d6107891bA76eADeEa032ef8A4504',
    ),
    BLOCKCHAIN_NETWORK['BSC_TESTNET']: ConfigType(
      API_BASE_URL: Api.getAPIBaseUrls(ENV.local),
      EPNS_COMMUNICATOR_CONTRACT: '0x4132061E3349ff36cFfCadA460E10Bd4f31F7ea8',
    ),
    BLOCKCHAIN_NETWORK['OPTIMISM_TESTNET']: ConfigType(
      API_BASE_URL: Api.getAPIBaseUrls(ENV.local),
      EPNS_COMMUNICATOR_CONTRACT: '0x4305D572F2bf38Fc2AE8D0172055b1EFd18F57a6',
    ),
    BLOCKCHAIN_NETWORK['POLYGON_ZK_EVM_TESTNET']: ConfigType(
      API_BASE_URL: Api.getAPIBaseUrls(ENV.local),
      EPNS_COMMUNICATOR_CONTRACT: '0x630b152e4185c63D7177c656b56b26f878C61572',
    ),
  },
};
