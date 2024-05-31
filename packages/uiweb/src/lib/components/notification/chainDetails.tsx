import Tooltip from '../tooltip';

import { ArbitrumSvg } from '../../icons/ArbitrumSvg';
import { BSCSvg } from '../../icons/BSCSvg';
import { BerachainSVG } from '../../icons/BerachainSVG';
import { EthereumSvg } from '../../icons/EthereumSvg';
import { FuseSvg } from '../../icons/FuseSvg';
import { OptimismSvg } from '../../icons/OptimismSvg';
import { PolygonSvg } from '../../icons/PolygonSvg';
import { PolygonzkevmSvg } from '../../icons/PolygonzkevmSvg';
import { TheGraphSvg } from '../../icons/TheGraphSvg';
import LineaSVG from '../../icons/LineaSVG';
import { CyberConnectSVG } from '../../icons/CyberConnectSVG';
const createSVGIcon = (element: any, chainName: string) => {
  return <Tooltip tooltipContent={`Delivered by ${chainName}`}>{element}</Tooltip>;
};

export default {
  ETH_TEST_SEPOLIA: {
    label: 'ETHEREUM SEPOLIA',
    icon: createSVGIcon(<EthereumSvg />, 'Ethereum Sepolia'),
  },
  ETH_MAINNET: {
    label: 'ETHEREUM MAINNET',
    icon: createSVGIcon(<EthereumSvg />, 'Ethereum Mainnet'),
  },
  POLYGON_MAINNET: {
    label: 'POLYGON MAINNET',
    icon: createSVGIcon(<PolygonSvg />, 'Polygon Mainnet'),
  },
  POLYGON_TEST_AMOY: {
    label: 'POLYGON AMOY',
    icon: createSVGIcon(<PolygonSvg />, 'Polygon Amoy'),
  },
  BSC_TESTNET: {
    label: 'BSC TESTNET',
    icon: createSVGIcon(<BSCSvg />, 'Bsc Testnet'),
  },
  BSC_MAINNET: {
    label: 'BSC MAINNET',
    icon: createSVGIcon(<BSCSvg />, 'Bsc Mainnet'),
  },
  OPTIMISM_TESTNET: {
    label: 'OPTIMISM TESTNET',
    icon: createSVGIcon(<OptimismSvg />, 'Optimism Testnet'),
  },
  OPTIMISM_MAINNET: {
    label: 'OPTIMISM MAINNET',
    icon: createSVGIcon(<OptimismSvg />, 'Optimism Mainnet'),
  },
  POLYGON_ZK_EVM_TESTNET: {
    label: 'POLYGON ZK EVM TESTNET',
    icon: createSVGIcon(<PolygonzkevmSvg />, 'Polygon ZK EVM Testnet'),
  },
  POLYGON_ZK_EVM_MAINNET: {
    label: 'POLYGON ZK EVM MAINNET',
    icon: createSVGIcon(<PolygonzkevmSvg />, 'Polygon ZK EVM Mainnet'),
  },

  ARBITRUMONE_MAINNET: {
    label: 'ARBITRUMONE MAINNET',
    icon: createSVGIcon(<ArbitrumSvg />, 'Arbitrum Mainnet'),
  },
  ARBITRUM_TESTNET: {
    label: 'ARBITRUM TESTNET',
    icon: createSVGIcon(<ArbitrumSvg />, 'Arbitrum Testnet'),
  },

  FUSE_MAINNET: {
    label: 'FUSE MAINNNET',
    icon: createSVGIcon(<FuseSvg />, 'Fuse Mainnet'),
  },

  FUSE_TESTNET: {
    label: 'FUSE TESTNET',
    icon: createSVGIcon(<FuseSvg />, 'Fuse Testnet'),
  },
  THE_GRAPH: {
    label: 'THE GRAPH',
    icon: createSVGIcon(<TheGraphSvg />, 'The Graph'),
  },
  BERACHAIN_TESTNET: {
    label: 'BERACHAIN TESTNET',
    icon: createSVGIcon(<BerachainSVG />, 'Berachain Testnet'),
  },
  CYBER_CONNECT_TESTNET: {
    label: 'CYBER CONNECT TESTNET',
    icon: createSVGIcon(<CyberConnectSVG />, 'CyberConnect Testnet'),
  },
  LINEA_TESTNET: {
    label: 'LINEA TESTNET',
    icon: createSVGIcon(<LineaSVG />, 'Linea Testnet'),
  },
  LINEA_MAINNET: {
    label: 'LINEA MAINNET',
    icon: createSVGIcon(<LineaSVG />, 'Linea Mainnet'),
  },
  CYBER_CONNECT_MAINNET: {
    label: 'CYBER CONNECT MAINNET',
    icon: createSVGIcon(<CyberConnectSVG />, 'CyberConnect Mainnet'),
  },
};
