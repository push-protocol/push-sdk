const getPlainAddress = (prefixedAddress: string) => {
  return prefixedAddress.replace('eip155:', '');
};

export default getPlainAddress;
