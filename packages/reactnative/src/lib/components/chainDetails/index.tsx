import EthereumSvg from "./ethereumSVG";
import PolygonSvg from "./polygonSVG";
import GraphSvg from "./thegraphSVG";
import BscSvg from "./bscSVG";
import OptimismSvg from "./optimismSVG"
import PolygonZKEVMSvg from "./polygonZkEVMSVG";
import ArbitrumSvgComponent from "./arbitrumSVG";

type Network = {
    label: string;
    Icon: any;
};

const networks: Record<string, Network> = {
    ETH_TEST_GOERLI: { label: "ETHEREUM GOERLI", Icon: EthereumSvg },
    ETH_MAINNET: { label: "ETHEREUM MAINNET", Icon: EthereumSvg },
    POLYGON_TEST_MUMBAI: { label: "POLYGON MUMBAI", Icon: PolygonSvg },
    POLYGON_MAINNET: { label: "POLYGON MAINNET", Icon: PolygonSvg },
    BSC_TESTNET: { label: "BSC TESTNET", Icon: BscSvg },
    BSC_MAINNET: { label: "BSC MAINNET", Icon: BscSvg },
    OPTIMISM_TESTNET: { label: "OPTIMISM TESTNET", Icon: OptimismSvg },
    OPTIMISM_MAINNET: { label: "OPTIMISM MAINNET", Icon: OptimismSvg },
    POLYGON_ZK_EVM_TESTNET: {label:"POLYGON_ZK_EVM_TESTNET",Icon: PolygonZKEVMSvg},
    POLYGON_ZK_EVM_MAINNET: {label:"POLYGON_ZK_EVM_MAINNET",Icon: PolygonZKEVMSvg},
    ARBITRUM_TESTNET: {label:"ARBITRUM_TESTNET",Icon: ArbitrumSvgComponent},
    ARBITRUMONE_MAINNET: {label: "ARBITRUMONE_MAINNET", Icon: ArbitrumSvgComponent},
    THE_GRAPH: { label: "THE GRAPH", Icon: GraphSvg },
};

export default networks