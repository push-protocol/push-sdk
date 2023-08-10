import { SignerType } from '../types';

export const signMessage = async (
  signer: SignerType,
  message: string
): Promise<string> => {
  // Check the signer type using type guards
  if ('signMessage' in signer) {
    // If the signer has a signMessage function with the ethersV5SignerType signature
    if ('_signTypedData' in signer) {
      // It's ethersV5SignerType, use its signMessage function
      const signature = await signer.signMessage(message);
      return signature;
    } else {
      // It's viemSignerType, use its signMessage function
      const signature = await signer.signMessage({
        message,
        account: signer.account,
      });
      return signature;
    }
  } else {
    throw new Error('Invalid signer type provided.');
  }
};

export const signTypedData = async (
  signer: SignerType,
  domain: any,
  types: any,
  value: any,
  primaryType: string
): Promise<string> => {
  // Check the signer type using type guards
  if ('_signTypedData' in signer) {
    // It's ethersV5SignerType, use its functions
    const signature = await signer._signTypedData(domain, types, value);
    return signature;
  } else if ('signTypedData' in signer) {
    // It's viemSignerType, use its functions
    const signature = await signer.signTypedData({
      account: signer.account,
      domain,
      types,
      primaryType: primaryType,
      message: value,
    });
    return signature;
  } else {
    throw new Error('Invalid signer type provided.');
  }
};

export const getAddress = async (signer: SignerType): Promise<string> => {
  if ('getAddress' in signer) {
    return await signer.getAddress();
  } else {
    return signer.account['address'] ?? '';
  }
};
