import { PushSubTabs } from '../types';

export enum ENV {
  PROD = 'prod',
  STAGING = 'staging',
  DEV = 'dev',
  /**
   * **This is for local development only**
   */
  LOCAL = 'local',
}
export const Constants = {
  ENV,
  DEFAULT_TITLE: 'Chat with us!',
  DEFAULT_GREETING_MSG: 'Hi there!',
  DEFAULT_PROFILE_PICTURE:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==',
};

export const ALCHEMY_API_KEY = 'rtkd-a4JWpnViQBZdNCiFBGTJdp5e0R2';
export const NETWORK_DETAILS = {
  11155111: {
    network: 'sepolia',
  },
  80002: {
    network: 'polygon-amoy',
  },
  1: {
    network: 'mainnet',
  },
  137: {
    network: 'polygon-mainnet',
  },
  97: {},
  11155420: {},
  80085: {},
};

//todo: need to change o sepolia
export const CoreContractChainId = {
  prod: 1,
  dev: 11155111,
  staging: 11155111,
  local: 11155111,
};

export const CoreRPC = {
  prod: 'https://mainnet.infura.io/v3/4ff53a5254144d988a8318210b56f47a',
  dev: 'https://sepolia.infura.io/v3/5524d420b29f4f7a8d8d2f582a0d43f7',
  staging: 'https://sepolia.infura.io/v3/49f638cc25a94ddb86b7aefd612f11ab',
  local: 'https://sepolia.infura.io/v3/5524d420b29f4f7a8d8d2f582a0d43f7',
};

const TESTNET_NETWORK = {
  ETHEREUM: 'eip155:11155111',
  POLYGON: 'eip155:80002',
  BSC: 'eip155:97',
  OPTIMISM: 'eip155:11155420',
  POLYGON_ZK_EVM: 'eip155:2442',
  ARBITRUM: 'eip155:421614',
  FUSE: 'eip155:123',
  BERACHAIN: 'eip155:80085',
  CYBER_CONNECT: 'eip155:111557560',
  BASE: 'eip155:84532',
};
const MAINET_NETWORK = {
  ETHEREUM: 'eip155:1',
  POLYGON: 'eip155:137',
  BSC: 'eip155:56',
  OPTIMISM: 'eip155:10',
  POLYGON_ZK_EVM: 'eip155:1101',
  ARBITRUM: 'eip155:42161',
  FUSE: 'eip155:122',
  CYBER_CONNECT: 'eip155:7560',
  BASE: 'eip155:8453',
};

export const BLOCKCHAIN_NETWORK = {
  prod: MAINET_NETWORK,
  dev: TESTNET_NETWORK,
  staging: TESTNET_NETWORK,
  local: TESTNET_NETWORK,
};

export const allowedNetworks = {
  prod: [
    1, //for ethereum mainnet
    137, //for polygon mainnet
    56, // for bnb mainnet
    10, // for optimism mainnet
    42161, // for arbitrum mainnet
    122, // for fuse mainnet
    59144, // for linea mainnet
    7569, // for cyber connect mainnet
    8453, // for base mainnet
  ],
  dev: [
    11155111, // for eth sepolia
    80002, //for polygon amoy
    97, // bnb testnet
    11155420, // optimism sepolia testnet
    421614, // for arbitrum testnet
    123, // for fuse testnet
    80085, // for berachain testnet
    59141, // for linea testnet
    2442, // polygon zkevm
    111557560, // cyber connect testnet
    84532, // for base testnet
  ],
  staging: [
    // 42, //for kovan
    11155111, // for sepolia
    80002, //for polygon amoy
    97, // bnb testnet
    11155420, // optimism sepolia testnet
    421614, // for arbitrum testnet
    123, // for fuse testnet
    80085, // for berachain testnet
    59141, // for linea testnet
    2442, // polygon zkevm
    111557560, // cyber connect testnet
    84532, // for base testnet
  ],
  local: [
    11155111, // for eth sepolia
    80002, //for polygon amoy
    97, // bnb testnet
    11155420, // optimism sepolia testnet
    421614, // for arbitrum testnet
    123, // for fuse testnet
    80085, // for berachain testnet
    59141, // for linea testnet
    2442, // polygon zkevm
    111557560, // cyber connect testnet
    84532, // for base testnet
  ],
};

export const BLOCKNATIVE_PROJECT_ID = '64a44a0fb537407bfe97d24330e4109c';

export const InfuraAPIKey = '150f25623ae64d08ab7ec7dd0c6b6ee9';

export const PUBLIC_GOOGLE_TOKEN = 'AIzaSyBhUBnCia6zpxY7KcqjghRS1IphinAvKXs';

export const ProfilePicture = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==`;

export const PushSubTabTitle = {
  REQUESTS: {
    title: 'Chat request',
  },
  SPAM: {
    title: 'Spam',
  },
};

export const chatLimit = 10;
export const requestLimit = 10;
export const notificationLimit = 5;

export const FILE_ICON = (extension: string) =>
  `https://cdn.jsdelivr.net/gh/napthedev/file-icons/file/${extension}.svg`;

// Livekit Server URLs
export const LIVEKIT_SERVER_URL = 'https://spacev2-demo-17wvllxz.livekit.cloud';
export const LIVEKIT_SERVER_WEBSOCKET_URL = 'wss://spacev2-demo-17wvllxz.livekit.cloud';
export const LIVEKIT_TOKEN_GENERATOR_SERVER_URL = 'https://ms-lk-server.onrender.com';
export const GUEST_MODE_ACCOUNT = '0x0000000000000000000000000000000000000001';

export const pushBotAddress = 'eip155:0x99A08ac6254dcf7ccc37CeC662aeba8eFA666666';
