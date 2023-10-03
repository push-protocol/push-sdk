
import Tooltip from "../tooltip";

import { EthereumSvg } from '../../icons/EthereumSvg';
import { PolygonSvg } from "../../icons/PolygonSvg";
import { BSCSvg } from "../../icons/BSCSvg";
import { OptimismSvg } from "../../icons/OptimismSvg";
import { PolygonzkevmSvg } from "../../icons/PolygonzkevmSvg";
import { TheGraphSvg } from "../../icons/TheGraphSvg";
import { ArbitrumSvg } from "../../icons/ArbitrumSvg"

const createSVGIcon = (element:any, chainName: string) => {
  return (
    <Tooltip tooltipContent={`Delivered by ${chainName}`}>
      {element}
    </Tooltip>
  );
};

export default {
  ETH_TEST_GOERLI: {
    label: 'ETHEREUM GOERLI',
    icon: createSVGIcon(<EthereumSvg/>, 'Ethereum Goerli'),
  },
  ETH_MAINNET: {
    label: 'ETHEREUM MAINNET',
    icon: createSVGIcon(<EthereumSvg/>, 'Ethereum Mainnet'),
  },
  POLYGON_TEST_MUMBAI: {
    label: 'POLYGON MUMBAI',
    icon: createSVGIcon(<PolygonSvg/>, 'Polygon Mumbai'),
  },
  POLYGON_MAINNET: {
    label: 'POLYGON MAINNET',
    icon: createSVGIcon(<PolygonSvg/>, 'Polygon Mainnet'),
  },
  BSC_TESTNET: {
    label: 'BSC TESTNET',
    icon: createSVGIcon(<BSCSvg/>, 'Bsc Testnet'),
  },
  BSC_MAINNET: {
    label: 'BSC MAINNET',
    icon: createSVGIcon(<BSCSvg/>, 'Bsc Mainnet'),
  },
  OPTIMISM_TESTNET: {
    label: 'OPTIMISM TESTNET',
    icon: createSVGIcon(<OptimismSvg/>, 'Optimism Testnet'),
  },
  OPTIMISM_MAINNET: {
    label: 'OPTIMISM MAINNET',
    icon: createSVGIcon(<OptimismSvg/>, 'Optimism Mainnet'),
  },
  POLYGON_ZK_EVM_TESTNET: {
    label: 'POLYGON ZK EVM TESTNET',
    icon: createSVGIcon(<PolygonzkevmSvg/>, 'Polygon ZK EVM Testnet'),
  },
  POLYGON_ZK_EVM_MAINNET: {
    label: 'POLYGON ZK EVM MAINNET',
    icon: createSVGIcon(<PolygonzkevmSvg/>, 'Polygon ZK EVM Mainnet'),
  },

  ARBITRUMONE_MAINNET: {
    label: 'ARBITRUMONE MAINNET',
    icon: createSVGIcon(<ArbitrumSvg/>, 'Arbitrum Mainnet'),
  },
  ARBITRUM_TESTNET: {
    label: 'ARBITRUM TESTNET',
    icon: createSVGIcon(<ArbitrumSvg/>, 'Arbitrum Testnet'),
  },
  THE_GRAPH: { label: 'THE GRAPH', icon: createSVGIcon(<TheGraphSvg/>, 'The Graph') },
};
