import EthereumSVG from "../../icons/ethereum.svg";
import PolygonSVG from "../../icons/polygon.svg";
import GraphSVG from "../../icons/thegraph.svg";
import Tooltip from "../tooltip";
import BscSVG from "../../icons/bsc.svg";
import OptimismSVG from "../../icons/optimism.svg";
import PolygonZKEVMSvg from "../../icons/polygonzkevm.svg"
const createSVGIcon = (url: string, chainName: string) => {
  return (
    <Tooltip tooltipContent={`Delivered by ${chainName}`}>
      <img src={url} alt={chainName.toUpperCase()} />
    </Tooltip>
  )
}

export default {
    ETH_TEST_GOERLI: { label: "ETHEREUM GOERLI", icon: createSVGIcon(EthereumSVG, "Ethereum Goerli") },
    ETH_MAINNET: { label: "ETHEREUM MAINNET", icon: createSVGIcon(EthereumSVG, "Ethereum Mainnet") },
    POLYGON_TEST_MUMBAI: { label: "POLYGON MUMBAI", icon: createSVGIcon(PolygonSVG, "Polygon Mumbai") },
    POLYGON_MAINNET: { label: "POLYGON MAINNET", icon: createSVGIcon(PolygonSVG, "Polygon Mainnet") },
    BSC_TESTNET: { label: "BSC TESTNET", icon: createSVGIcon(BscSVG, "Bsc Testnet") },
    BSC_MAINNET: { label: "BSC MAINNET", icon: createSVGIcon(BscSVG, "Bsc Mainnet") },
    OPTIMISM_TESTNET: { label: "OPTIMISM TESTNET", icon: createSVGIcon(OptimismSVG, "Optimism Testnet") },
    OPTIMISM_MAINNET: { label: "OPTIMISM MAINNET", icon: createSVGIcon(OptimismSVG, "Optimism Mainnet") },
    POLYGON_ZK_EVM_TESTNET: { label: "POLYGON ZK EVM TESTNET", icon: createSVGIcon(PolygonZKEVMSvg, "Polygon ZK EVM Testnet") },
    POLYGON_ZK_EVM_MAINNET: { label: "POLYGON ZK EVM MAINNET", icon: createSVGIcon(PolygonZKEVMSvg, "Polygon ZK EVM Mainnet") },
    THE_GRAPH: { label: "THE GRAPH", icon: createSVGIcon(GraphSVG, "The Graph") },
};
