import {
  recoverTypedSignature,
  SignTypedDataVersion,
} from '@metamask/eth-sig-util';

/**
 *
 * @param chainId
 * @returns
 */
export const getDomainInformation = (chainId: number) => {
  const chatVerifyingContract = '0x0000000000000000000000000000000000000000';
  return {
    name: 'PUSH CHAT ID',
    chainId,
    verifyingContract: chatVerifyingContract,
  };
};

/**
 *
 * @param action
 * @returns
 */
export const getTypeInformation = () => {
  return {
    Data: [{ name: 'data', type: 'string' }],
  };
};

/**
 *
 * @param signedData
 * @param chainId
 * @param version
 * @returns typedData for typedV4 EIP712 sig
 */
export const getTypedData = (
  signedData: string,
  chainId: number,
  version: 'V1' | 'V2'
) => {
  const message = { data: signedData };
  const typeInformation = getTypeInformation();
  const domainInformation = getDomainInformation(chainId);
  const primaryType = 'Data' as const;
  let types: any;
  let domain = {};

  if (version === 'V1') {
    types = {
      EIP712Domain: [],
      Data: typeInformation.Data,
    };
  } else {
    types = {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      Data: typeInformation.Data,
    };
    domain = domainInformation;
  }

  return {
    types,
    primaryType,
    domain,
    message,
  };
};

/**
 *
 * @param signature
 * @param signedData
 * @param address
 * @param chainId
 * @returns
 */
export const verifyEip712Signature = (
  verificationProof: string,
  signedData: string,
  address: string
): boolean => {
  const SIG_TYPE_V2 = 'eip712v2';
  let chainId: number | null = null;
  let signature: string;

  if (
    verificationProof.split(':')[0] !== SIG_TYPE_V2 ||
    verificationProof.split(':').length > 3
  ) {
    return false;
  }
  if (verificationProof.split(':').length === 2) {
    signature = verificationProof.split(':')[1];
  } else {
    chainId = parseInt(verificationProof.split(':')[1]);
    signature = verificationProof.split(':')[2];
  }

  try {
    const typedDataV1 = getTypedData(signedData, chainId as number, 'V1'); // For backward compatibility
    const recoveredAddressV1 = recoverTypedSignature({
      data: typedDataV1,
      signature: signature,
      version: SignTypedDataVersion.V4,
    });

    const typedDataV2 = getTypedData(signedData, chainId as number, 'V2'); // For backward compatibility
    const recoveredAddressV2 = recoverTypedSignature({
      data: typedDataV2,
      signature: signature,
      version: SignTypedDataVersion.V4,
    });

    if (
      recoveredAddressV1.toLowerCase() === address.toLowerCase() ||
      recoveredAddressV2.toLowerCase() === address.toLowerCase()
    )
      return true;
    return false;
  } catch (error) {
    return false;
  }
};
