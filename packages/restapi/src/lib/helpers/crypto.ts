import * as metamaskSigUtil from "@metamask/eth-sig-util";
import * as CryptoJS from "crypto-js"
import { ethers } from "ethers";
import { aesDecrypt, pgpDecrypt, verifySignature } from "../chat/helpers";
import { walletType } from "../types";
import { isValidETHAddress } from "./address";

export const getPublicKey = async (options: walletType): Promise<string> => {
  const {account, signer} = options || {};
  const address: string = account || (await signer?.getAddress()) || '';
  console.log('Fetching Public Key');
  const metamaskProvider = new ethers.providers.Web3Provider((window as any).ethereum);
  const web3Provider = signer?.provider || metamaskProvider;

  const keyB64 = await web3Provider.provider.request({
    method: "eth_getEncryptionPublicKey",
    params: [address]
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
  if (!isValidETHAddress(account))
    throw new Error(`Invalid address!`);
  const result = await (window as any).ethereum.request({
    method: 'eth_decrypt',
    params: [encryptedMessage, account],
  });

  return result;
};

export const decryptMessage = async ({
  encryptedMessage,
  encryptionType,
  encryptedSecret,
  pgpPrivateKey,
  signature,
  signatureValidationPubliKey
}:
  {
    encryptedMessage: string,
    encryptionType: string,
    encryptedSecret: string,
    pgpPrivateKey: string,
    signature: string,
    signatureValidationPubliKey: string
  }
): Promise<string> => {
  let plainText: string
  if (encryptionType !== 'PlainText' && encryptionType !== null) {
    plainText = await decryptAndVerifySignature({
      cipherText: encryptedMessage,
      encryptedSecretKey: encryptedSecret,
      privateKeyArmored: pgpPrivateKey,
      publicKeyArmored: signatureValidationPubliKey,
      signatureArmored: signature,
    });
  } else {
    plainText = encryptedMessage
  }

  return plainText;
}

export const decryptAndVerifySignature = async ({
  cipherText,
  encryptedSecretKey,
  publicKeyArmored,
  signatureArmored,
  privateKeyArmored
}: {
  cipherText: string
  encryptedSecretKey: string
  publicKeyArmored: string
  signatureArmored: string,
  privateKeyArmored: string
}): Promise<string> => {
  // const privateKeyArmored: string = await DIDHelper.decrypt(JSON.parse(encryptedPrivateKeyArmored), did)
  const secretKey: string = await pgpDecrypt({
    cipherText: encryptedSecretKey,
    toPrivateKeyArmored: privateKeyArmored
  })
  await verifySignature({ messageContent: cipherText, signatureArmored, publicKeyArmored })
  return aesDecrypt({ cipherText, secretKey })
}

export const generateHash = (message:any):string=> {
  const hash = CryptoJS.SHA256(JSON.stringify(message)).toString(
    CryptoJS.enc.Hex
  );
  return hash;
}