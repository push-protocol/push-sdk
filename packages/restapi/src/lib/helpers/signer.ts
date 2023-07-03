import { TypedDataDomain, TypedDataField } from 'ethers';

export const signTypedData = async (
  signer: any,
  domain: TypedDataDomain,
  types: Record<string, TypedDataField[]>,
  value: Record<string, any>
): Promise<string> => {
  if (signer._signTypedData) {
    //experimental Function in V5
    return await signer._signTypedData(domain, types, value);
  } else {
    //stable Function in V5
    return await signer.signTypedData(domain, types, value);
  }
};

export const getChainId = async (signer: any): Promise<number> => {
  if (signer.getChainId) {
    return await signer.getChainId;
  } else if (signer.provider) {
    return (await signer.provider.getNetwork()).chainId;
  } else {
    throw new Error('chainId not found!!!');
  }
};
