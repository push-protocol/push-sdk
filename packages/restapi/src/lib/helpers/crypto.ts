import * as metamaskSigUtil from "@metamask/eth-sig-util";

export const getPublicKey = async (account: string): Promise<string> => {
  console.log('Fetching Public Key');
  const keyB64 = await (window as any).ethereum.request({
    method: 'eth_getEncryptionPublicKey',
    params: [account], // you must have access to the specified account
  });
  console.log(`Public Key: ${keyB64}`);
  return keyB64;
};

export const encryptWithRPCEncryptionPublicKeyReturnRawData = (text: string, encryptionPublicKey: string) => {
  const encryptedSecret = metamaskSigUtil.encrypt({
    publicKey: encryptionPublicKey,
    data: text,
    version: 'x25519-xsalsa20-poly1305'
  });

  return encryptedSecret;
};

export const decryptWithWalletRPCMethod = async (encryptedMessage: string, account: string) => {
  const result = await (window as any).ethereum.request({
    method: 'eth_decrypt',
    params: [encryptedMessage, account],
  });

  return result;
};