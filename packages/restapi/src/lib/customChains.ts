import { defineChain } from 'viem';

export const polygonZkEvmCordona = defineChain({
  id: 2442,
  name: 'Polygon zkEVM Cardona Testnet',
  network: 'polygon-zkevm-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://rpc.cardona.zkevm-rpc.com/'] },
    public: { http: ['https://rpc.cardona.zkevm-rpc.com/'] },
  },
  blockExplorers: {
    default: {
      name: 'Polygon zkEVM Cardona',
      url: ' https://cardona-zkevm.polygonscan.com/',
    },
  },
  testnet: true,
});

export const polygonAmoy = defineChain({
  id: 80002,
  name: 'Polygon Amoy Testnet',
  network: 'polygon-amoy',
  nativeCurrency: {
    decimals: 18,
    name: 'MATIC',
    symbol: 'MATIC',
  },
  rpcUrls: {
    default: { http: ['https://rpc-amoy.polygon.technology/'] },
    public: { http: ['https://rpc-amoy.polygon.technology/'] },
  },
  blockExplorers: {
    default: {
      name: 'Polygon Amoy',
      url: 'https://www.oklink.com/amoy',
    },
  },
  testnet: true,
});

export const berachainTestnet = defineChain({
  id: 80085,
  name: 'Berachain Artio',
  network: 'berachain-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'BERA Token',
    symbol: 'BERA',
  },
  rpcUrls: {
    default: { http: ['https://artio.rpc.berachain.com'] },
    public: { http: ['https://artio.rpc.berachain.com'] },
  },
  blockExplorers: {
    default: {
      name: 'Berachain',
      url: 'https://artio.beratrail.io',
    },
  },
  testnet: true,
});

export const cyberConnectTestnet = defineChain({
  id: 111_557_560,
  name: 'Cyber Testnet',
  network: 'cyberconnect-testent',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://cyber-testnet.alt.technology'] },
    public: { http: ['https://cyber-testnet.alt.technology'] },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://testnet.cyberscan.co',
    },
  },
  contracts: {
    multicall3: {
      address: '0xffc391F0018269d4758AEA1a144772E8FB99545E',
      blockCreated: 304545,
    },
  },
  testnet: true,
});

export const cyberConnectMainnet = defineChain({
  id: 7_560,
  name: 'Cyber',
  network: 'cyberconnect-mainnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://cyber.alt.technology'],
    },
    public: {
      http: ['https://cyber.alt.technology'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://cyberscan.co',
      apiUrl: 'https://cyberscan.co/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 0,
    },
  },
});
