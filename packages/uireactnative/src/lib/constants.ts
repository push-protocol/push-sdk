import {
  ArbitrumSVG,
  BscSVG,
  EthereumSVG,
  GraphSVG,
  OptimismSVG,
  PolygonSVG,
  PolygonZkevmSVG,
} from './assets';

export const GLOBALS = {
  COLORS: {
    PRIMARY: 'rgba(27.0, 150.0, 227.0, 1.0)',

    LINKS: 'rgba(20.0, 126.0, 251.0, 1.0)',

    GRADIENT_PRIMARY: 'rgba(226.0, 8.0, 128.0, 1.0)',
    GRADIENT_SECONDARY: 'rgba(53.0, 197.0, 243.0, 1.0)',
    GRADIENT_THIRD: 'rgba(103.0, 76.0, 159.0, 1.0)',
    QR_SCAN_COLOR: '#D53893',

    TRANSPARENT: 'transparent',

    WHITE: 'rgba(255.0, 255.0, 255.0, 1.0)',
    DARK_WHITE: 'rgba(255.0, 255.0, 255.0, 0.75)',
    MID_WHITE: 'rgba(255.0, 255.0, 255.0, 0.5)',
    LIGHT_WHITE: 'rgba(255.0, 255.0, 255.0, 0.25)',

    SLIGHTER_GRAY: 'rgba(250.0, 250.0, 250.0, 1)',
    SLIGHT_GRAY: 'rgba(231.0, 231.0, 231.0, 1)',
    LIGHT_GRAY: 'rgba(225.0, 225.0, 225.0, 1)',
    MID_GRAY: '#C8C8C8',
    DARK_GRAY: 'rgba(160.0, 160.0, 160.0, 1)',
    DARKER_GRAY: 'rgba(100.0, 100.0, 100.0, 1)',

    LIGHT_BLACK_TRANS: 'rgba(0.0, 0.0, 0.0, 0.1)',
    SEMI_MID_BLACK_TRANS: 'rgba(0.0, 0.0, 0.0, 0.25)',
    MID_BLACK_TRANS: 'rgba(0.0, 0.0, 0.0, 0.5)',
    DARK_BLACK_TRANS: 'rgba(0.0, 0.0, 0.0, 0.75)',
    BLACK: '#000000',

    CONFIRM_GREEN: 'rgba(50.0, 205.0, 50.0, 1.0)',
    CONFIRM_GREEN_LIGHT: 'rgba(48.0, 204.0, 139.0, 1.0)',

    CONFIRM: 'rgba(34.0, 139.0, 34.0, 1.0)',
    WARNING: 'rgba(255.0, 153.0, 0.0, 1.0)',

    SUBLIME_RED: 'rgba(237.0, 59.0, 72.0, 1.0)',
    BADGE_RED: 'rgba(208.0, 44.0, 30.0, 1.0)',
    LIGHT_MAROON: 'rgba(159.0, 0.0, 0.0, 1.0)',
    LIGHTER_MAROON: 'rgba(129.0, 0.0, 0.0, 1.0)',

    // Chats
    PINK: '#D53A94',
    LIGHT_BLUE: '#F4F5FA',
    CHAT_BLACK: '#1E1E1E',
    CHAT_LIGHT_DARK: '#657795',

    // Group Chat
    CHAT_LIGHT_PINK: '#F3D7FA',
    CHAT_LIGHT_GRAY: '#BAC4D6',
    CHAT_BORDER_COLOR: '#A0A3B1',
  },
  CHAINS: {
    ETH_TEST_SEPOLIA: {
      label: 'ETHEREUM SEPOLIA',
      icon: EthereumSVG,
    },
    ETH_MAINNET: {
      label: 'ETHEREUM MAINNET',
      icon: EthereumSVG,
    },
    POLYGON_TEST_MUMBAI: {
      label: 'POLYGON MUMBAI',
      icon: PolygonSVG,
    },
    POLYGON_MAINNET: {
      label: 'POLYGON MAINNET',
      icon: PolygonSVG,
    },
    BSC_TESTNET: {
      label: 'BSC TESTNET',
      icon: BscSVG,
    },
    BSC_MAINNET: {
      label: 'BSC MAINNET',
      icon: BscSVG,
    },
    OPTIMISM_TESTNET: {
      label: 'OPTIMISM TESTNET',
      icon: OptimismSVG,
    },
    OPTIMISM_MAINNET: {
      label: 'OPTIMISM MAINNET',
      icon: OptimismSVG,
    },
    POLYGON_ZK_EVM_TESTNET: {
      label: 'POLYGON ZK EVM TESTNET',
      icon: PolygonZkevmSVG,
    },
    POLYGON_ZK_EVM_MAINNET: {
      label: 'POLYGON ZK EVM MAINNET',
      icon: PolygonZkevmSVG,
    },

    ARBITRUMONE_MAINNET: {
      label: 'ARBITRUMONE MAINNET',
      icon: ArbitrumSVG,
    },
    ARBITRUM_TESTNET: {
      label: 'ARBITRUM TESTNET',
      icon: ArbitrumSVG,
    },
    THE_GRAPH: {
      label: 'THE GRAPH',
      icon: GraphSVG,
    },
  },
};
