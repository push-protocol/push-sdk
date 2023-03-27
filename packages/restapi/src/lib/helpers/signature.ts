import { recoverTypedSignature, SignTypedDataVersion } from '@metamask/eth-sig-util';

export const getDomainInformation = (
  chainId: number,
  verifyingContract: string
) => {
  return {
    name: 'EPNS COMM V1',
    chainId,
    verifyingContract,
  };
};

export const getTypeInformation = (action: string) => {
  if (action === 'Create_user') {
    return {
      Data: [{ name: 'data', type: 'string' }],
    };
  }
  return '';
};

export const verifyEip712Signature = (
  signature: string,
  signedData: string,
  address: string
): boolean => {
  try {
    const message = { data: signedData };
    const types = {
      EIP712Domain: [],
      Data: [{ name: 'data', type: 'string' }],
    };
    const primaryType = 'Data' as const;
    const typedMessage = {
      types,
      primaryType,
      domain: {},
      message,
    };

    const recoveredAddress = recoverTypedSignature({
      data: typedMessage,
      signature: signature,
      version: SignTypedDataVersion.V4,
    });
    if (recoveredAddress.toLowerCase() === address.toLowerCase()) return true;
    return false;
  } catch (error) {
    return false;
  }
};
