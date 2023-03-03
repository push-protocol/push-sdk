import EthereumSvg from "./ethereumSVG";
import PolygonSvg from "./polygonSVG";
import GraphSvg from "./thegraphSVG";
import BscSvg from "./bscSVG";
import OptimismSvg from "./optimismSVG"

export default {
    ETH_TEST_GOERLI: { label: "ETHEREUM GOERLI", Icon: EthereumSvg },
    ETH_MAINNET: { label: "ETHEREUM MAINNET", Icon: EthereumSvg },
    POLYGON_TEST_MUMBAI: { label: "POLYGON MUMBAI", Icon: PolygonSvg },
    POLYGON_MAINNET: { label: "POLYGON MAINNET", Icon: PolygonSvg },
    BSC_TESTNET: { label: "BSC TESTNET", Icon: BscSvg },
    BSC_MAINNET: { label: "BSC MAINNET", Icon: BscSvg },
    OPTIMISM_TESTNET: { label: "OPTIMISM TESTNET", Icon: OptimismSvg },
    OPTIMISM_MAINNET: { label: "OPTIMISM MAINNET", Icon: OptimismSvg },
    THE_GRAPH: { label: "THE GRAPH", Icon: GraphSvg },
};