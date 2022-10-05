import EthereumSVG from "../../icons/ethereum.svg";
import PolygonSVG from "../../icons/polygon.svg";
import GraphSVG from "../../icons/thegraph.svg";

const createSVGIcon = (url: string, alt: string) => {
  return <img src={url} alt={alt} />
}

export default {
    ETH_TEST_GOERLI: { label: "ETHEREUM GOERLI", icon: createSVGIcon(EthereumSVG, "ETHEREUM GOERLI") },
    ETH_MAINNET: { label: "ETHEREUM MAINNET", icon: createSVGIcon(EthereumSVG, "ETHEREUM MAINNET") },
    POLYGON_TEST_MUMBAI: { label: "POLYGON MUMBAI", icon: createSVGIcon(PolygonSVG, "POLYGON MUMBAI") },
    POLYGON_MAINNET: { label: "POLYGON MAINNET", icon: createSVGIcon(PolygonSVG, "POLYGON MAINNET") },
    THE_GRAPH: { label: "THE GRAPH", icon: createSVGIcon(GraphSVG, "THE GRAPH") },
};