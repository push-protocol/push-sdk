import Constants, { ENV } from './constants';
import { coreABI } from './abis/core';
import { commABI } from './abis/comm';
import { tokenABI } from './abis/token';
import {
  mainnet,
  polygon,
  bsc,
  bscTestnet,
  optimism,
  optimismSepolia,
  polygonZkEvm,
  sepolia,
  arbitrum,
  arbitrumSepolia,
  fuse,
  fuseSparknet,
  linea,
  base,
  baseSepolia
} from 'viem/chains';
import { berachainTestnet, polygonAmoy, polygonZkEvmCordona, cyberConnectMainnet, cyberConnectTestnet, lineaSepoliaTestnet } from './customChains';


// for methods not needing the entire config
export const API_BASE_URL = {
  [ENV.PROD]: 'https://backend.epns.io/apis',
  [ENV.STAGING]: 'https://backend-staging.epns.io/apis',
  [ENV.DEV]: 'https://backend-dev.epns.io/apis',

  /**
   * **This is for local development only**
   */
  [ENV.LOCAL]: 'http://localhost:4000/apis',
};

const BLOCKCHAIN_NETWORK = {
  ETH_MAINNET: 'eip155:1',
  ETH_SEPOLIA: 'eip155:11155111',
  POLYGON_MAINNET: 'eip155:137',
  POLYGON_AMOY: 'eip155:80002',
  BSC_MAINNET: 'eip155:56',
  BSC_TESTNET: 'eip155:97',
  OPTIMISM_TESTNET: 'eip155:11155420',
  OPTIMISM_MAINNET: 'eip155:10',
  POLYGON_ZK_EVM_TESTNET: 'eip155:2442',
  POLYGON_ZK_EVM_MAINNET: 'eip155:1101',
  ARBITRUM_TESTNET: 'eip155:421614',
  ARBITRUMONE_MAINNET: 'eip155:42161',
  FUSE_TESTNET: 'eip155:123',
  FUSE_MAINNET: 'eip155:122',
  BERACHAIN_TESTNET: 'eip155:80085',
  LINEA_MAINNET: 'eip155:59144',
  LINEA_TESTNET: 'eip155:59141',
  CYBER_CONNECT_TESTNET: 'eip155:111557560',
  CYBER_CONNECT_MAINNET: 'eip155:7560',
  BASE_TESTNET: 'eip155:84532',
  BASE_MAINNET: 'eip155:8453',
};

export type ALIAS_CHAIN =
  | 'POLYGON'
  | 'BSC'
  | 'OPTIMISM'
  | 'POLYGONZKEVM'
  | 'ARBITRUMONE'
  | 'FUSE'
  | 'BERACHAIN'
  | 'LINEA'
  | 'CYBERCONNECT'
  | 'BASE';

export const ETH_CHAIN_ID = {
  [ENV.PROD]: 1,
  [ENV.STAGING]: 11155111,
  [ENV.DEV]: 11155111,
  [ENV.LOCAL]: 11155111,
};
export const ALIAS_CHAIN_ID: {
  [key: string]: { [key in ENV]: number };
} = {
  POLYGON: {
    [ENV.PROD]: 137,
    [ENV.STAGING]: 80002,
    [ENV.DEV]: 80002,
    [ENV.LOCAL]: 80002,
  },
  BSC: {
    [ENV.PROD]: 56,
    [ENV.STAGING]: 97,
    [ENV.DEV]: 97,
    [ENV.LOCAL]: 97,
  },
  OPTIMISM: {
    [ENV.PROD]: 10,
    [ENV.STAGING]: 11155420,
    [ENV.DEV]: 11155420,
    [ENV.LOCAL]: 11155420,
  },
  POLYGONZKEVM: {
    [ENV.PROD]: 1101,
    [ENV.STAGING]: 2442,
    [ENV.DEV]: 2442,
    [ENV.LOCAL]: 2442,
  },
  ARBITRUMONE: {
    [ENV.PROD]: 42161,
    [ENV.STAGING]: 421614,
    [ENV.DEV]: 421614,
    [ENV.LOCAL]: 421614,
  },
  FUSE: {
    [ENV.PROD]: 122,
    [ENV.STAGING]: 123,
    [ENV.DEV]: 123,
    [ENV.LOCAL]: 123,
  },
  BERACHAIN: {
    [ENV.PROD]: 0, // TODO: update this
    [ENV.STAGING]: 80085,
    [ENV.DEV]: 80085,
    [ENV.LOCAL]: 80085,
  },
  LINEA: {
    [ENV.PROD]: 59144, 
    [ENV.STAGING]: 59141,
    [ENV.DEV]: 59141,
    [ENV.LOCAL]: 59141,
  },
  CYBERCONNECT: {
    [ENV.PROD]: 7560,
    [ENV.STAGING]: 111557560,
    [ENV.DEV]: 111557560,
    [ENV.LOCAL]: 111557560,
  },
  BASE: {
    [ENV.PROD]: 8453,
    [ENV.STAGING]: 84532,
    [ENV.DEV]: 84532,
    [ENV.LOCAL]: 84532,
  },
};

export const CHAIN_ID = {
  ETHEREUM: ETH_CHAIN_ID,
  ...ALIAS_CHAIN_ID,
};

export const CHAIN_NAME: { [key: number]: string } = {
  // eth
  1: 'ETHEREUM',
  11155111: 'ETHEREUM',
  // polygon
  137: 'POLYGON',
  80002: 'POLYGON',
  // bsc
  56: 'BSC',
  97: 'BSC',
  // optimism
  10: 'OPTIMISM',
  11155420: 'OPTIMISM',
  // plygonzkevm
  1101: 'POLYGONZKEVM',
  2442: 'POLYGONZKEVM',
  // arbitrun
  421614: 'ARBITRUN',
  42161: 'ARBITRUM',
  // fuse
  122: 'FUSE',
  123: 'FUSE',
  // berachain
  80085: 'BERACHAIN',
  // linea
  59144: 'LINEA',
  59141: 'LINEA',
  // cyberconnect
  7560: 'CYBER_CONNECT_MAINNET',
  111557560: 'CYBER_CONNECT_TESTNET',
  // base
  8453: 'BASE_MAINNET',
  84532: 'BASE_TESTNET',
};
export interface ConfigType {
  API_BASE_URL: string;
  EPNS_COMMUNICATOR_CONTRACT: string;
}

export const VIEM_CORE_CONFIG = {
  [ENV.PROD]: {
    NETWORK: mainnet,
    API_BASE_URL: API_BASE_URL[ENV.PROD],
    EPNS_CORE_CONTRACT: '0x66329Fdd4042928BfCAB60b179e1538D56eeeeeE',
  },
  [ENV.STAGING]: {
    NETWORK: sepolia,
    API_BASE_URL: API_BASE_URL[ENV.STAGING],
    EPNS_CORE_CONTRACT: '0x9d65129223451fbd58fc299c635cd919baf2564c',
  },
  [ENV.DEV]: {
    NETWORK: sepolia,
    API_BASE_URL: API_BASE_URL[ENV.DEV],
    EPNS_CORE_CONTRACT: '0x5ab1520e2bd519bdab2e1347eee81c00a77f4946',
  },
  [ENV.LOCAL]: {
    NETWORK: sepolia,
    API_BASE_URL: API_BASE_URL[ENV.DEV],
    EPNS_CORE_CONTRACT: '0x5ab1520e2bd519bdab2e1347eee81c00a77f4946',
  },
};

export const CORE_CONFIG = {
  [ENV.PROD]: {
    API_BASE_URL: API_BASE_URL[ENV.PROD],
    EPNS_CORE_CONTRACT: '0x66329Fdd4042928BfCAB60b179e1538D56eeeeeE',
  },
  [ENV.STAGING]: {
    API_BASE_URL: API_BASE_URL[ENV.STAGING],
    EPNS_CORE_CONTRACT: '0x9d65129223451fbd58fc299c635cd919baf2564c',
  },
  [ENV.DEV]: {
    API_BASE_URL: API_BASE_URL[ENV.DEV],
    EPNS_CORE_CONTRACT: '0x5ab1520e2bd519bdab2e1347eee81c00a77f4946',
  },
  [ENV.LOCAL]: {
    API_BASE_URL: API_BASE_URL[ENV.LOCAL],
    EPNS_CORE_CONTRACT: '0x5ab1520e2bd519bdab2e1347eee81c00a77f4946',
  },
};

const CONFIG = {
  [ENV.PROD]: {
    [BLOCKCHAIN_NETWORK.ETH_MAINNET]: {
      API_BASE_URL: API_BASE_URL[ENV.PROD],
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    },
    [BLOCKCHAIN_NETWORK.POLYGON_MAINNET]: {
      API_BASE_URL: API_BASE_URL[ENV.PROD],
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    },
    [BLOCKCHAIN_NETWORK.BSC_MAINNET]: {
      API_BASE_URL: API_BASE_URL[ENV.PROD],
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    },
    [BLOCKCHAIN_NETWORK.OPTIMISM_MAINNET]: {
      API_BASE_URL: API_BASE_URL[ENV.PROD],
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    },
    [BLOCKCHAIN_NETWORK.POLYGON_ZK_EVM_MAINNET]: {
      API_BASE_URL: API_BASE_URL[ENV.PROD],
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    },
    [BLOCKCHAIN_NETWORK.ARBITRUMONE_MAINNET]: {
      API_BASE_URL: API_BASE_URL[ENV.PROD],
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    },
    [BLOCKCHAIN_NETWORK.FUSE_MAINNET]: {
      API_BASE_URL: API_BASE_URL[ENV.PROD],
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    },    
    [BLOCKCHAIN_NETWORK.CYBER_CONNECT_MAINNET]: {
      API_BASE_URL: API_BASE_URL[ENV.PROD],
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    },
    [BLOCKCHAIN_NETWORK.LINEA_MAINNET]:{
      API_BASE_URL: API_BASE_URL[ENV.PROD],
      EPNS_COMMUNICATOR_CONTRACT: '0x0d8e75CB5d8873c43c5d9Add71Fd71a09F7Ef890',
    },
    [BLOCKCHAIN_NETWORK.BASE_MAINNET]: {
      API_BASE_URL: API_BASE_URL[ENV.PROD],
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    }
  },
  [ENV.STAGING]: {
    [BLOCKCHAIN_NETWORK.ETH_SEPOLIA]: {
      API_BASE_URL: API_BASE_URL[ENV.STAGING],
      EPNS_COMMUNICATOR_CONTRACT: '0x0c34d54a09cfe75bccd878a469206ae77e0fe6e7',
    },
    [BLOCKCHAIN_NETWORK.POLYGON_AMOY]: {
      API_BASE_URL: API_BASE_URL[ENV.STAGING],
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    },
    [BLOCKCHAIN_NETWORK.BSC_TESTNET]: {
      API_BASE_URL: API_BASE_URL[ENV.STAGING],
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    },
    [BLOCKCHAIN_NETWORK.OPTIMISM_TESTNET]: {
      API_BASE_URL: API_BASE_URL[ENV.STAGING],
      EPNS_COMMUNICATOR_CONTRACT: '0x9Dc25996ba72A2FD7E64e7a674232a683f406F1A',
    },
    [BLOCKCHAIN_NETWORK.POLYGON_ZK_EVM_TESTNET]: {
      API_BASE_URL: API_BASE_URL[ENV.STAGING],
      EPNS_COMMUNICATOR_CONTRACT: '0x6e489b7af21ceb969f49a90e481274966ce9d74d',
    },
    [BLOCKCHAIN_NETWORK.ARBITRUM_TESTNET]: {
      API_BASE_URL: API_BASE_URL[ENV.STAGING],
      EPNS_COMMUNICATOR_CONTRACT: '0x9Dc25996ba72A2FD7E64e7a674232a683f406F1A',
    },
    [BLOCKCHAIN_NETWORK.FUSE_TESTNET]: {
      API_BASE_URL: API_BASE_URL[ENV.STAGING],
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    },
    [BLOCKCHAIN_NETWORK.BERACHAIN_TESTNET]: {
      API_BASE_URL: API_BASE_URL[ENV.STAGING],
      EPNS_COMMUNICATOR_CONTRACT: '0x7b9C405e261ba671f008c20D0321f62d08C140EC',
    },
    [BLOCKCHAIN_NETWORK.LINEA_TESTNET]:{
      API_BASE_URL: API_BASE_URL[ENV.STAGING],
      EPNS_COMMUNICATOR_CONTRACT: '0x9cb3bd7550B5c92baA056Fc0F08132f49508145F',
    },
    [BLOCKCHAIN_NETWORK.CYBER_CONNECT_TESTNET]: {
      API_BASE_URL: API_BASE_URL[ENV.STAGING],
      EPNS_COMMUNICATOR_CONTRACT: '0x6e489B7af21cEb969f49A90E481274966ce9D74d',
    },
    [BLOCKCHAIN_NETWORK.BASE_TESTNET]: {
      API_BASE_URL: API_BASE_URL[ENV.STAGING],
      EPNS_COMMUNICATOR_CONTRACT: '0x6e489B7af21cEb969f49A90E481274966ce9D74d',
    }
  },
  [ENV.DEV]: {
    [BLOCKCHAIN_NETWORK.ETH_SEPOLIA]: {
      API_BASE_URL: API_BASE_URL[ENV.DEV],
      EPNS_COMMUNICATOR_CONTRACT: '0x9dDCD7ed7151afab43044E4D694FA064742C428c',
    },
    [BLOCKCHAIN_NETWORK.POLYGON_AMOY]: {
      API_BASE_URL: API_BASE_URL[ENV.DEV],
      EPNS_COMMUNICATOR_CONTRACT: '0x9cb3bd7550b5c92baa056fc0f08132f49508145f',
    },
    [BLOCKCHAIN_NETWORK.BSC_TESTNET]: {
      API_BASE_URL: API_BASE_URL[ENV.DEV],
      EPNS_COMMUNICATOR_CONTRACT: '0x4132061E3349ff36cFfCadA460E10Bd4f31F7ea8',
    },
    [BLOCKCHAIN_NETWORK.OPTIMISM_TESTNET]: {
      API_BASE_URL: API_BASE_URL[ENV.DEV],
      EPNS_COMMUNICATOR_CONTRACT: '0x754787358fac861ef904c92d54f7adb659779317',
    },
    [BLOCKCHAIN_NETWORK.POLYGON_ZK_EVM_TESTNET]: {
      API_BASE_URL: API_BASE_URL[ENV.DEV],
      EPNS_COMMUNICATOR_CONTRACT: '0x9cb3bd7550b5c92baa056fc0f08132f49508145f',
    },
    [BLOCKCHAIN_NETWORK.ARBITRUM_TESTNET]: {
      API_BASE_URL: API_BASE_URL[ENV.DEV],
      EPNS_COMMUNICATOR_CONTRACT: '0x754787358fac861ef904c92d54f7adb659779317',
    },
    [BLOCKCHAIN_NETWORK.FUSE_TESTNET]: {
      API_BASE_URL: API_BASE_URL[ENV.DEV],
      EPNS_COMMUNICATOR_CONTRACT: '0x7eBb54D86CF928115965DB596a3E600404dD8039',
    },
    [BLOCKCHAIN_NETWORK.BERACHAIN_TESTNET]: {
      API_BASE_URL: API_BASE_URL[ENV.DEV],
      EPNS_COMMUNICATOR_CONTRACT: '0xA1DF3E68D085aa6918bcc2506b24e499830Db0eB',
    },
    [BLOCKCHAIN_NETWORK.LINEA_TESTNET]:{
      API_BASE_URL: API_BASE_URL[ENV.DEV],
      EPNS_COMMUNICATOR_CONTRACT: '0x9cb3bd7550B5c92baA056Fc0F08132f49508145F',
    },
    [BLOCKCHAIN_NETWORK.CYBER_CONNECT_TESTNET]: {
      API_BASE_URL: API_BASE_URL[ENV.DEV],
      EPNS_COMMUNICATOR_CONTRACT: '0x9cb3bd7550B5c92baA056Fc0F08132f49508145F',
    },
    [BLOCKCHAIN_NETWORK.BASE_TESTNET]: {
      API_BASE_URL: API_BASE_URL[ENV.DEV],
      EPNS_COMMUNICATOR_CONTRACT: '0x9cb3bd7550B5c92baA056Fc0F08132f49508145F',
    }
  },
  [ENV.LOCAL]: {
    [BLOCKCHAIN_NETWORK.ETH_SEPOLIA]: {
      API_BASE_URL: API_BASE_URL[ENV.LOCAL],
      EPNS_COMMUNICATOR_CONTRACT: '0x9dDCD7ed7151afab43044E4D694FA064742C428c',
    },
    [BLOCKCHAIN_NETWORK.POLYGON_AMOY]: {
      API_BASE_URL: API_BASE_URL[ENV.LOCAL],
      EPNS_COMMUNICATOR_CONTRACT: '0x9cb3bd7550b5c92baa056fc0f08132f49508145f',
    },
    [BLOCKCHAIN_NETWORK.BSC_TESTNET]: {
      API_BASE_URL: API_BASE_URL[ENV.LOCAL],
      EPNS_COMMUNICATOR_CONTRACT: '0x4132061E3349ff36cFfCadA460E10Bd4f31F7ea8',
    },
    [BLOCKCHAIN_NETWORK.OPTIMISM_TESTNET]: {
      API_BASE_URL: API_BASE_URL[ENV.LOCAL],
      EPNS_COMMUNICATOR_CONTRACT: '0x754787358fac861ef904c92d54f7adb659779317',
    },
    [BLOCKCHAIN_NETWORK.POLYGON_ZK_EVM_TESTNET]: {
      API_BASE_URL: API_BASE_URL[ENV.LOCAL],
      EPNS_COMMUNICATOR_CONTRACT: '0x9cb3bd7550b5c92baa056fc0f08132f49508145f',
    },
    [BLOCKCHAIN_NETWORK.ARBITRUM_TESTNET]: {
      API_BASE_URL: API_BASE_URL[ENV.LOCAL],
      EPNS_COMMUNICATOR_CONTRACT: '0x754787358fac861ef904c92d54f7adb659779317',
    },
    [BLOCKCHAIN_NETWORK.FUSE_TESTNET]: {
      API_BASE_URL: API_BASE_URL[ENV.LOCAL],
      EPNS_COMMUNICATOR_CONTRACT: '0x7eBb54D86CF928115965DB596a3E600404dD8039',
    },
    [BLOCKCHAIN_NETWORK.BERACHAIN_TESTNET]: {
      API_BASE_URL: API_BASE_URL[ENV.LOCAL],
      EPNS_COMMUNICATOR_CONTRACT: '0xA1DF3E68D085aa6918bcc2506b24e499830Db0eB',
    },
    [BLOCKCHAIN_NETWORK.LINEA_TESTNET]:{
      API_BASE_URL: API_BASE_URL[ENV.LOCAL],
      EPNS_COMMUNICATOR_CONTRACT: '0x9cb3bd7550B5c92baA056Fc0F08132f49508145F',
    },
    [BLOCKCHAIN_NETWORK.CYBER_CONNECT_TESTNET]: {
      API_BASE_URL: API_BASE_URL[ENV.DEV],
      EPNS_COMMUNICATOR_CONTRACT: '0x9cb3bd7550B5c92baA056Fc0F08132f49508145F',
    },
    [BLOCKCHAIN_NETWORK.BASE_TESTNET]: {
      API_BASE_URL: API_BASE_URL[ENV.LOCAL],
      EPNS_COMMUNICATOR_CONTRACT: '0x9cb3bd7550B5c92baA056Fc0F08132f49508145F',
    }
  },
};

export default CONFIG;
export const TOKEN = {
  [ENV.PROD]: '0xf418588522d5dd018b425E472991E52EBBeEEEEE',
  [ENV.STAGING]: '0x37c779a1564DCc0e3914aB130e0e787d93e21804',
  [ENV.DEV]: '0x37c779a1564DCc0e3914aB130e0e787d93e21804',
  [ENV.LOCAL]: '0x37c779a1564DCc0e3914aB130e0e787d93e21804',
};

export const TOKEN_VIEM_NETWORK_MAP = {
  [ENV.PROD]: mainnet,
  [ENV.STAGING]: sepolia,
  [ENV.DEV]: sepolia,
  [ENV.LOCAL]: sepolia,
};

export const MIN_TOKEN_BALANCE = {
  [ENV.PROD]: 50,
  [ENV.STAGING]: 50,
  [ENV.DEV]: 50,
  [ENV.LOCAL]: 50,
};
export const ABIS = {
  CORE: coreABI,
  COMM: commABI,
  TOKEN: tokenABI,
};

export const CHANNEL_TYPE = {
  TIMEBOUND: 4,
  GENERAL: 2,
};

export const VIEM_CONFIG = {
  [ENV.PROD]: {
    [BLOCKCHAIN_NETWORK.ETH_MAINNET]: {
      NETWORK: mainnet,
      API_BASE_URL: API_BASE_URL[ENV.PROD],
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    },
    [BLOCKCHAIN_NETWORK.POLYGON_MAINNET]: {
      NETWORK: polygon,
      API_BASE_URL: API_BASE_URL[ENV.PROD],
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    },
    [BLOCKCHAIN_NETWORK.BSC_MAINNET]: {
      NETWORK: bsc,
      API_BASE_URL: API_BASE_URL[ENV.PROD],
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    },
    [BLOCKCHAIN_NETWORK.OPTIMISM_MAINNET]: {
      NETWORK: optimism,
      API_BASE_URL: API_BASE_URL[ENV.PROD],
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    },
    [BLOCKCHAIN_NETWORK.POLYGON_ZK_EVM_MAINNET]: {
      NETWORK: polygonZkEvm,
      API_BASE_URL: API_BASE_URL[ENV.PROD],
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    },
    [BLOCKCHAIN_NETWORK.ARBITRUMONE_MAINNET]: {
      NETWORK: arbitrum,
      API_BASE_URL: API_BASE_URL[ENV.PROD],
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    },
    [BLOCKCHAIN_NETWORK.FUSE_MAINNET]: {
      NETWORK: fuse,
      API_BASE_URL: API_BASE_URL[ENV.PROD],
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    },
    [BLOCKCHAIN_NETWORK.LINEA_MAINNET]:{
      NETWORK:linea,
      API_BASE_URL: API_BASE_URL[ENV.PROD],
      EPNS_COMMUNICATOR_CONTRACT: '0x0d8e75CB5d8873c43c5d9Add71Fd71a09F7Ef890',
    },
    [BLOCKCHAIN_NETWORK.CYBER_CONNECT_MAINNET]: {
      NETWORK: cyberConnectMainnet,
      API_BASE_URL: API_BASE_URL[ENV.PROD],
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    },
    [BLOCKCHAIN_NETWORK.BASE_MAINNET]: {
      NETWORK: base,
      API_BASE_URL: API_BASE_URL[ENV.PROD],
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    }
  },
  [ENV.STAGING]: {
    [BLOCKCHAIN_NETWORK.ETH_SEPOLIA]: {
      NETWORK: sepolia,
      API_BASE_URL: API_BASE_URL[ENV.STAGING],
      EPNS_COMMUNICATOR_CONTRACT: '0x0c34d54a09cfe75bccd878a469206ae77e0fe6e7',
    },
    [BLOCKCHAIN_NETWORK.POLYGON_AMOY]: {
      NETWORK: polygonAmoy,
      API_BASE_URL: API_BASE_URL[ENV.STAGING],
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    },
    [BLOCKCHAIN_NETWORK.BSC_TESTNET]: {
      NETWORK: bscTestnet,
      API_BASE_URL: API_BASE_URL[ENV.STAGING],
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    },
    [BLOCKCHAIN_NETWORK.OPTIMISM_TESTNET]: {
      NETWORK: optimismSepolia,
      API_BASE_URL: API_BASE_URL[ENV.STAGING],
      EPNS_COMMUNICATOR_CONTRACT: '0x9Dc25996ba72A2FD7E64e7a674232a683f406F1A',
    },
    [BLOCKCHAIN_NETWORK.POLYGON_ZK_EVM_TESTNET]: {
      NETWORK: polygonZkEvmCordona,
      API_BASE_URL: API_BASE_URL[ENV.STAGING],
      EPNS_COMMUNICATOR_CONTRACT: '0x6e489b7af21ceb969f49a90e481274966ce9d74d',
    },
    [BLOCKCHAIN_NETWORK.ARBITRUM_TESTNET]: {
      NETWORK: arbitrumSepolia,
      API_BASE_URL: API_BASE_URL[ENV.STAGING],
      EPNS_COMMUNICATOR_CONTRACT: '0x9Dc25996ba72A2FD7E64e7a674232a683f406F1A',
    },
    [BLOCKCHAIN_NETWORK.FUSE_TESTNET]: {
      NETWORK: fuseSparknet,
      API_BASE_URL: API_BASE_URL[ENV.STAGING],
      EPNS_COMMUNICATOR_CONTRACT: '0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa',
    },
    [BLOCKCHAIN_NETWORK.BERACHAIN_TESTNET]: {
      NETWORK: berachainTestnet,
      API_BASE_URL: API_BASE_URL[ENV.STAGING],
      EPNS_COMMUNICATOR_CONTRACT: '0x7b9C405e261ba671f008c20D0321f62d08C140EC',
    },
    [BLOCKCHAIN_NETWORK.LINEA_TESTNET]:{
      NETWORK: lineaSepoliaTestnet,
      API_BASE_URL: API_BASE_URL[ENV.STAGING],
      EPNS_COMMUNICATOR_CONTRACT: '0x9cb3bd7550B5c92baA056Fc0F08132f49508145F',
    },
    [BLOCKCHAIN_NETWORK.CYBER_CONNECT_TESTNET]: {
      NETWORK: cyberConnectTestnet,
      API_BASE_URL: API_BASE_URL[ENV.STAGING],
      EPNS_COMMUNICATOR_CONTRACT: '0x6e489B7af21cEb969f49A90E481274966ce9D74d',
    },
    [BLOCKCHAIN_NETWORK.BASE_TESTNET]: {
      NETWORK: baseSepolia,
      API_BASE_URL: API_BASE_URL[ENV.STAGING],
      EPNS_COMMUNICATOR_CONTRACT: '0x6e489B7af21cEb969f49A90E481274966ce9D74d',
    }
  },
  [ENV.DEV]: {
    [BLOCKCHAIN_NETWORK.ETH_SEPOLIA]: {
      NETWORK: sepolia,
      API_BASE_URL: API_BASE_URL[ENV.DEV],
      EPNS_COMMUNICATOR_CONTRACT: '0x9dDCD7ed7151afab43044E4D694FA064742C428c',
    },
    [BLOCKCHAIN_NETWORK.POLYGON_AMOY]: {
      NETWORK: polygonAmoy,
      API_BASE_URL: API_BASE_URL[ENV.DEV],
      EPNS_COMMUNICATOR_CONTRACT: '0x9cb3bd7550b5c92baa056fc0f08132f49508145f',
    },
    [BLOCKCHAIN_NETWORK.BSC_TESTNET]: {
      NETWORK: bscTestnet,
      API_BASE_URL: API_BASE_URL[ENV.DEV],
      EPNS_COMMUNICATOR_CONTRACT: '0x4132061E3349ff36cFfCadA460E10Bd4f31F7ea8',
    },
    [BLOCKCHAIN_NETWORK.OPTIMISM_TESTNET]: {
      NETWORK: optimismSepolia,
      API_BASE_URL: API_BASE_URL[ENV.DEV],
      EPNS_COMMUNICATOR_CONTRACT: '0x754787358fac861ef904c92d54f7adb659779317',
    },
    [BLOCKCHAIN_NETWORK.POLYGON_ZK_EVM_TESTNET]: {
      NETWORK: polygonZkEvmCordona,
      API_BASE_URL: API_BASE_URL[ENV.DEV],
      EPNS_COMMUNICATOR_CONTRACT: '0x9cb3bd7550b5c92baa056fc0f08132f49508145f',
    },
    [BLOCKCHAIN_NETWORK.ARBITRUM_TESTNET]: {
      NETWORK: arbitrumSepolia,
      API_BASE_URL: API_BASE_URL[ENV.DEV],
      EPNS_COMMUNICATOR_CONTRACT: '0x754787358fac861ef904c92d54f7adb659779317',
    },
    [BLOCKCHAIN_NETWORK.FUSE_TESTNET]: {
      NETWORK: fuseSparknet,
      API_BASE_URL: API_BASE_URL[ENV.DEV],
      EPNS_COMMUNICATOR_CONTRACT: '0x7eBb54D86CF928115965DB596a3E600404dD8039',
    },
    [BLOCKCHAIN_NETWORK.BERACHAIN_TESTNET]: {
      NETWORK: berachainTestnet,
      API_BASE_URL: API_BASE_URL[ENV.DEV],
      EPNS_COMMUNICATOR_CONTRACT: '0xA1DF3E68D085aa6918bcc2506b24e499830Db0eB',
    },
    [BLOCKCHAIN_NETWORK.LINEA_TESTNET]:{
      NETWORK: lineaSepoliaTestnet,
      API_BASE_URL: API_BASE_URL[ENV.DEV],
      EPNS_COMMUNICATOR_CONTRACT: '0x9cb3bd7550B5c92baA056Fc0F08132f49508145F',
    },
    [BLOCKCHAIN_NETWORK.CYBER_CONNECT_TESTNET]: {
      NETWORK: cyberConnectTestnet,
      API_BASE_URL: API_BASE_URL[ENV.DEV],
      EPNS_COMMUNICATOR_CONTRACT: '0x9cb3bd7550B5c92baA056Fc0F08132f49508145F',
    },
    [BLOCKCHAIN_NETWORK.BASE_TESTNET]: {
      NETWORK: baseSepolia,
      API_BASE_URL: API_BASE_URL[ENV.DEV],
      EPNS_COMMUNICATOR_CONTRACT: '0x9cb3bd7550B5c92baA056Fc0F08132f49508145F',
    }
  },
  [ENV.LOCAL]: {
    [BLOCKCHAIN_NETWORK.ETH_SEPOLIA]: {
      NETWORK: sepolia,
      API_BASE_URL: API_BASE_URL[ENV.LOCAL],
      EPNS_COMMUNICATOR_CONTRACT: '0x9dDCD7ed7151afab43044E4D694FA064742C428c',
    },
    [BLOCKCHAIN_NETWORK.POLYGON_AMOY]: {
      NETWORK: polygonAmoy,
      API_BASE_URL: API_BASE_URL[ENV.LOCAL],
      EPNS_COMMUNICATOR_CONTRACT: '0x9cb3bd7550b5c92baa056fc0f08132f49508145f',
    },
    [BLOCKCHAIN_NETWORK.BSC_TESTNET]: {
      NETWORK: bscTestnet,
      API_BASE_URL: API_BASE_URL[ENV.LOCAL],
      EPNS_COMMUNICATOR_CONTRACT: '0x4132061E3349ff36cFfCadA460E10Bd4f31F7ea8',
    },
    [BLOCKCHAIN_NETWORK.OPTIMISM_TESTNET]: {
      NETWORK: optimismSepolia,
      API_BASE_URL: API_BASE_URL[ENV.LOCAL],
      EPNS_COMMUNICATOR_CONTRACT: '0x754787358fac861ef904c92d54f7adb659779317',
    },
    [BLOCKCHAIN_NETWORK.POLYGON_ZK_EVM_TESTNET]: {
      NETWORK: polygonZkEvmCordona,
      API_BASE_URL: API_BASE_URL[ENV.LOCAL],
      EPNS_COMMUNICATOR_CONTRACT: '0x9cb3bd7550b5c92baa056fc0f08132f49508145f',
    },
    [BLOCKCHAIN_NETWORK.ARBITRUM_TESTNET]: {
      NETWORK: arbitrumSepolia,
      API_BASE_URL: API_BASE_URL[ENV.LOCAL],
      EPNS_COMMUNICATOR_CONTRACT: '0x754787358fac861ef904c92d54f7adb659779317',
    },
    [BLOCKCHAIN_NETWORK.FUSE_TESTNET]: {
      NETWORK: fuseSparknet,
      API_BASE_URL: API_BASE_URL[ENV.LOCAL],
      EPNS_COMMUNICATOR_CONTRACT: '0x7eBb54D86CF928115965DB596a3E600404dD8039',
    },
    [BLOCKCHAIN_NETWORK.BERACHAIN_TESTNET]: {
      NETWORK: berachainTestnet,
      API_BASE_URL: API_BASE_URL[ENV.LOCAL],
      EPNS_COMMUNICATOR_CONTRACT: '0xA1DF3E68D085aa6918bcc2506b24e499830Db0eB',
    },
    [BLOCKCHAIN_NETWORK.LINEA_TESTNET]:{
      NETWORK: lineaSepoliaTestnet,
      API_BASE_URL: API_BASE_URL[ENV.LOCAL],
      EPNS_COMMUNICATOR_CONTRACT: '0x9cb3bd7550B5c92baA056Fc0F08132f49508145F',
    },
    [BLOCKCHAIN_NETWORK.CYBER_CONNECT_TESTNET]: {
      NETWORK: cyberConnectTestnet,
      API_BASE_URL: API_BASE_URL[ENV.LOCAL],
      EPNS_COMMUNICATOR_CONTRACT: '0x9cb3bd7550B5c92baA056Fc0F08132f49508145F',
    },
    [BLOCKCHAIN_NETWORK.BASE_TESTNET]: {
      NETWORK: baseSepolia,
      API_BASE_URL: API_BASE_URL[ENV.LOCAL],
      EPNS_COMMUNICATOR_CONTRACT: '0x9cb3bd7550B5c92baA056Fc0F08132f49508145F',
    }
  },
};

export const ALPHA_FEATURE_CONFIG = {
  STABLE: {
    feature: [] as string[],
  },
  ALPHA: {
    feature: [Constants.ALPHA_FEATURES.SCALABILITY_V2],
  },
};
