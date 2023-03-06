import * as metamaskSigUtil from "@metamask/eth-sig-util";
import { decrypt } from "@metamask/eth-sig-util";
import CryptoES from "crypto-es"
import { ethers } from "ethers";
import { aesDecrypt, getAccountAddress, getWallet, pgpDecrypt, verifySignature } from "../chat/helpers";
import { SignerType, walletType } from "../types";
import { isValidETHAddress } from "./address";

export const getPublicKey = async (options: walletType): Promise<string> => {
  const { account, signer } = options || {};
  const address: string = account || (await signer?.getAddress()) || '';
  const metamaskProvider = new ethers.providers.Web3Provider((window as any).ethereum);
  const web3Provider = signer?.provider || metamaskProvider;

  const keyB64 = await web3Provider.provider.request({
    method: "eth_getEncryptionPublicKey",
    params: [address]
  });
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

export const decryptWithWalletRPCMethod = async (encryptedPGPPrivateKey: string, account: string) => {
  console.warn("decryptWithWalletRPCMethod method is DEPRECATED. Use decryptPGPKey method with signer!")
  return await decryptPGPKey({
    encryptedPGPPrivateKey,
    account
  });
};

type decryptPgpKeyProps = {
  encryptedPGPPrivateKey: string;
  account?: string;
  signer?: SignerType;
}

export const decryptPGPKey = async (options: decryptPgpKeyProps) => {
  const {
    encryptedPGPPrivateKey,
    account = null,
    signer = null
  } = options || {};
  try {
    if (account == null && signer == null) {
      throw new Error(`At least one from account or signer is necessary!`);
    }

    const wallet = getWallet({ account, signer });
    const address = await getAccountAddress(wallet);

    if (!isValidETHAddress(address)) {
      throw new Error(`Invalid address!`);
    }

    let decryptedMsg;
    if (wallet?.signer?.privateKey) {
      decryptedMsg = decrypt({
        encryptedData: JSON.parse(encryptedPGPPrivateKey),
        privateKey: wallet?.signer?.privateKey.substring(2),
      });
    } else {
      const metamaskProvider = new ethers.providers.Web3Provider((window as any).ethereum);
      const web3Provider = signer?.provider || metamaskProvider;
      decryptedMsg = await web3Provider.provider.request({
        method: "eth_decrypt",
        params: [encryptedPGPPrivateKey, address]
      });
    }
    return decryptedMsg;
  } catch (err) {
    console.error(`[Push SDK] - API  - Error - API decrypt Pgp Key() -:  `, err);
    throw Error(`[Push SDK] - API  - Error - API decrypt Pgp Key() -: ${err}`);
  }
}

export const decryptMessage = async ({
  encryptedPGPPrivateKey,
  encryptionType,
  encryptedSecret,
  pgpPrivateKey,
  signature,
  signatureValidationPubliKey
}:
  {
    encryptedPGPPrivateKey: string,
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
      cipherText: encryptedPGPPrivateKey,
      encryptedSecretKey: encryptedSecret,
      privateKeyArmored: pgpPrivateKey,
      publicKeyArmored: signatureValidationPubliKey,
      signatureArmored: signature,
    });
  } else {
    plainText = encryptedPGPPrivateKey
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

export const generateHash = (message: any): string => {
  const hash = CryptoES.SHA256(JSON.stringify(message)).toString(
    CryptoES.enc.Hex
  );
  return hash;
}