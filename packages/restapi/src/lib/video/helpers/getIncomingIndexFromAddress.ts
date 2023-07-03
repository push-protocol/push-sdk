import { PeerData } from "../../types";

const getIncomingIndexFromAddress = (incomingPeers: PeerData[], address: string) => {
    return incomingPeers.findIndex(incomingPeer => incomingPeer.address === address);
}

export default getIncomingIndexFromAddress;
