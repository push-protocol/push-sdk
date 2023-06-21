export const convertAddressToAddrCaip = (
    userAddress: string,
    chainId: number
  ): string => {
    return `eip155:${chainId}:${userAddress}`;
  };
  