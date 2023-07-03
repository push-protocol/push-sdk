import { PeerData, VideoCallStatus } from '../../types';

const getConnectedAddresses = ({
  incomingPeers,
}: {
  incomingPeers: PeerData[];
}): string[] => {
  const connectedAddresses: string[] = [];
  incomingPeers.forEach((incomingPeer) => {
    if (incomingPeer.status === VideoCallStatus.CONNECTED) {
      connectedAddresses.push(incomingPeer.address);
    }
  });
  return connectedAddresses;
};

export default getConnectedAddresses;
