const getConnectToAddresses = ({
  localAddress,
  localConnectedAddresses,
  receivedConnectedAddresses,
}: {
  localAddress: string;
  localConnectedAddresses: string[];
  receivedConnectedAddresses: string[];
}): string[] => {
  return receivedConnectedAddresses.filter(
    (receivedConnectedAddress) =>
      !localConnectedAddresses.includes(receivedConnectedAddress) &&
      receivedConnectedAddress !== localAddress
  );
};

export default getConnectToAddresses;
