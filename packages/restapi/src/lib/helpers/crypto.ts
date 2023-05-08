import * as metamaskSigUtil from '@metamask/eth-sig-util';
import {
  decrypt as metamaskDecrypt,
  getEncryptionPublicKey,
} from '@metamask/eth-sig-util';
import * as CryptoJS from 'crypto-js';
import { ethers } from 'ethers';
import {
  aesDecrypt,
  getAccountAddress,
  getWallet,
  pgpDecrypt,
  verifySignature,
  getEip712Signature,
  getEip191Signature,
} from '../chat/helpers';
import Constants, { ENV } from '../constants';
import {
  SignerType,
  walletType,
  encryptedPrivateKeyType,
  encryptedPrivateKeyTypeV2,
  IMessageIPFS,
  ProgressHookType,
} from '../types';
import { isValidETHAddress, pCAIP10ToWallet } from './address';
import { verifyProfileSignature } from '../chat/helpers/signature';
import { upgrade } from '../user/upgradeUser';

const KDFSaltSize = 32; // bytes
const AESGCMNonceSize = 12; // property iv

let crypto: Crypto;
if (typeof window !== 'undefined' && window.crypto) {
  crypto = window.crypto;
} else if (typeof require !== 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    crypto = require('crypto').webcrypto;
  } catch (e) {
    throw new Error('Unable To load crypto');
  }
}

/** DEPRECATED */
export const getPublicKey = async (options: walletType): Promise<string> => {
  const { account, signer } = options || {};
  const address: string = account || (await signer?.getAddress()) || '';
  const metamaskProvider = new ethers.providers.Web3Provider(
    (window as any).ethereum
  );
  const web3Provider: any = signer?.provider || metamaskProvider;

  const keyB64 = await web3Provider.provider.request({
    method: 'eth_getEncryptionPublicKey',
    params: [address],
  });
  return keyB64;
};

/** DEPRECATED */
// x25519-xsalsa20-poly1305 enryption
export const encryptV1 = (
  text: string,
  encryptionPublicKey: string,
  version: string
) => {
  const encryptedSecret = metamaskSigUtil.encrypt({
    publicKey: encryptionPublicKey,
    data: text,
    version: version,
  });

  return encryptedSecret;
};

/** DEPRECATED */
export const decryptWithWalletRPCMethod = async (
  encryptedPGPPrivateKey: string,
  account: string
) => {
  console.warn(
    'decryptWithWalletRPCMethod method is DEPRECATED. Use decryptPGPKey method with signer!'
  );
  return await decryptPGPKey({
    encryptedPGPPrivateKey,
    account,
  });
};

type decryptPgpKeyProps = {
  encryptedPGPPrivateKey: string;
  account?: string;
  signer?: SignerType | null;
  env?: ENV;
  toUpgrade?: boolean;
  additionalMeta?: {
    NFTPGP_V1?: {
      password: string;
    };
  };
  progressHook?: (progress: ProgressHookType) => void;
};

export const decryptPGPKey = async (options: decryptPgpKeyProps) => {
  const {
    encryptedPGPPrivateKey,
    account = null,
    signer = null,
    env = Constants.ENV.PROD,
    toUpgrade = false,
    additionalMeta = null,
    progressHook,
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

    const { version: encryptionType } = JSON.parse(encryptedPGPPrivateKey);
    let privateKey;

    progressHook?.({
      progressId: 'PUSH-DECRYPT-01',
      progressTitle: 'Decrypting Profile',
      progressInfo: 'Please sign the transaction to decrypt profile',
      level: 'INFO',
    });

    switch (encryptionType) {
      case Constants.ENC_TYPE_V1: {
        if (wallet?.signer?.privateKey) {
          privateKey = metamaskDecrypt({
            encryptedData: JSON.parse(encryptedPGPPrivateKey),
            privateKey: wallet?.signer?.privateKey.substring(2),
          });
        } else {
          const metamaskProvider = new ethers.providers.Web3Provider(
            (window as any).ethereum
          );
          const web3Provider: any = signer?.provider || metamaskProvider;
          privateKey = await web3Provider.provider.request({
            method: 'eth_decrypt',
            params: [encryptedPGPPrivateKey, address],
          });
        }
        break;
      }
      case Constants.ENC_TYPE_V2: {
        if (!wallet?.signer) {
          throw new Error(
            'Cannot Decrypt this encryption version without signer!'
          );
        }
        const { preKey: input } = JSON.parse(encryptedPGPPrivateKey);
        const enableProfileMessage = 'Enable Push Chat Profile \n' + input;
        let encodedPrivateKey: Uint8Array;
        try {
          const { verificationProof: secret } = await getEip712Signature(
            wallet,
            enableProfileMessage,
            true
          );
          encodedPrivateKey = await decryptV2(
            JSON.parse(encryptedPGPPrivateKey),
            hexToBytes(secret || '')
          );
        } catch (err) {
          const { verificationProof: secret } = await getEip712Signature(
            wallet,
            enableProfileMessage,
            false
          );
          encodedPrivateKey = await decryptV2(
            JSON.parse(encryptedPGPPrivateKey),
            hexToBytes(secret || '')
          );
        }
        const dec = new TextDecoder();
        privateKey = dec.decode(encodedPrivateKey);
        break;
      }
      case Constants.ENC_TYPE_V3: {
        if (!wallet?.signer) {
          throw new Error(
            'Cannot Decrypt this encryption version without signer!'
          );
        }
        const { preKey: input } = JSON.parse(encryptedPGPPrivateKey);
        const enableProfileMessage = 'Enable Push Profile \n' + input;
        const { verificationProof: secret } = await getEip191Signature(
          wallet,
          enableProfileMessage
        );
        const encodedPrivateKey = await decryptV2(
          JSON.parse(encryptedPGPPrivateKey),
          hexToBytes(secret || '')
        );
        const dec = new TextDecoder();
        privateKey = dec.decode(encodedPrivateKey);
        break;
      }
      case Constants.ENC_TYPE_V4: {
        let password: string | null = null;
        if (additionalMeta?.NFTPGP_V1) {
          password = additionalMeta.NFTPGP_V1.password;
        } else {
          if (!wallet?.signer) {
            throw new Error(
              'Cannot Decrypt this encryption version without signer!'
            );
          }
          const { encryptedPassword } = JSON.parse(encryptedPGPPrivateKey);
          password = await decryptPGPKey({
            encryptedPGPPrivateKey: JSON.stringify(encryptedPassword),
            signer,
            env,
          });
        }
        const encodedPrivateKey = await decryptV2(
          JSON.parse(encryptedPGPPrivateKey),
          hexToBytes(stringToHex(password as string))
        );
        const dec = new TextDecoder();
        privateKey = dec.decode(encodedPrivateKey);
        break;
      }
      default:
        throw new Error('Invalid Encryption Type');
    }

    // try key upgradation
    if (signer && toUpgrade && encryptionType !== Constants.ENC_TYPE_V4) {
      try {
        await upgrade({ env, account: address, signer, progressHook });
      } catch (err) {
        // Report Progress
        progressHook?.({
          progressId: 'PUSH-ERROR-01',
          progressTitle: 'Upgrade Profile Failed',
          progressInfo: `[Push SDK] - API  - Error - API decrypt Pgp Key() -: ${err}`,
          level: 'WARN',
        });
      }
    }
    progressHook?.({
      progressId: 'PUSH-DECRYPT-02',
      progressTitle: 'Push Profile Unlocked',
      progressInfo: 'Unlocking push profile',
      level: 'SUCCESS',
    });
    return privateKey;
  } catch (err) {
    // Report Progress
    progressHook?.({
      progressId: 'PUSH-ERROR-00',
      progressTitle: 'Non Specific Error',
      progressInfo: `[Push SDK] - API  - Error - API create User() -: ${err}`,
      level: 'ERROR',
    });
    console.error(
      `[Push SDK] - API  - Error - API decrypt Pgp Key() -:  `,
      err
    );
    throw Error(`[Push SDK] - API  - Error - API decrypt Pgp Key() -: ${err}`);
  }
};

export const decryptMessage = async ({
  encryptedPGPPrivateKey,
  encryptionType,
  encryptedSecret,
  pgpPrivateKey,
  signature,
  signatureValidationPubliKey,
  message,
}: {
  encryptedPGPPrivateKey: string;
  encryptionType: string;
  encryptedSecret: string;
  pgpPrivateKey: string;
  signature: string;
  signatureValidationPubliKey: string;
  message: IMessageIPFS;
}): Promise<string> => {
  let plainText: string;
  if (encryptionType !== 'PlainText' && encryptionType !== null) {
    try {
      plainText = await decryptAndVerifySignature({
        cipherText: encryptedPGPPrivateKey,
        encryptedSecretKey: encryptedSecret,
        privateKeyArmored: pgpPrivateKey,
        publicKeyArmored: signatureValidationPubliKey,
        signatureArmored: signature,
        message: message,
      });
    } catch (err) {
      plainText = 'Unable to decrypt message';
    }
  } else {
    plainText = encryptedPGPPrivateKey;
  }

  return plainText;
};

export const decryptAndVerifySignature = async ({
  cipherText,
  encryptedSecretKey,
  publicKeyArmored,
  signatureArmored,
  privateKeyArmored,
  message,
}: {
  cipherText: string;
  encryptedSecretKey: string;
  publicKeyArmored: string;
  signatureArmored: string;
  privateKeyArmored: string;
  message: IMessageIPFS;
}): Promise<string> => {
  // const privateKeyArmored: string = await DIDHelper.decrypt(JSON.parse(encryptedPrivateKeyArmored), did)
  const secretKey: string = await pgpDecrypt({
    cipherText: encryptedSecretKey,
    toPrivateKeyArmored: privateKeyArmored,
  });
  if (message.link == null) {
    const bodyToBeHashed = {
      fromDID: message.fromDID,
      toDID: message.toDID,
      messageContent: message.messageContent,
      messageType: message.messageType,
    };
    const hash = CryptoJS.SHA256(JSON.stringify(bodyToBeHashed)).toString();
    try {
      await verifySignature({
        messageContent: hash,
        signatureArmored,
        publicKeyArmored,
      });
    } catch (err) {
      await verifySignature({
        messageContent: cipherText,
        signatureArmored,
        publicKeyArmored,
      });
    }
  } else {
    await verifySignature({
      messageContent: cipherText,
      signatureArmored,
      publicKeyArmored,
    });
  }
  return aesDecrypt({ cipherText, secretKey });
};

export const generateHash = (message: any): string => {
  const hash = CryptoJS.SHA256(JSON.stringify(message)).toString(
    CryptoJS.enc.Hex
  );
  return hash;
};

const getRandomValues = async (array: Uint8Array) => {
  return crypto.getRandomValues(array);
};

const bytesToHex = (bytes: Uint8Array): string => {
  return bytes.reduce(
    (str, byte) => str + byte.toString(16).padStart(2, '0'),
    ''
  );
};

export const hexToBytes = (hex: string): Uint8Array => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
};

export const stringToHex = (str: string): string => {
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16).padStart(2, '0');
  }
  return hex;
};

// Derive AES-256-GCM key from a shared secret and salt
const hkdf = async (
  secret: Uint8Array,
  salt: Uint8Array
): Promise<CryptoKey> => {
  const key = await crypto.subtle.importKey('raw', secret, 'HKDF', false, [
    'deriveKey',
  ]);
  return crypto.subtle.deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt, info: new ArrayBuffer(0) },
    key,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
};

/** AES-GCM Encryption */
export const encryptV2 = async (
  data: Uint8Array,
  secret: Uint8Array,
  additionalData?: Uint8Array
): Promise<encryptedPrivateKeyTypeV2> => {
  const salt = crypto.getRandomValues(new Uint8Array(KDFSaltSize));
  const nonce = crypto.getRandomValues(new Uint8Array(AESGCMNonceSize));
  const key = await hkdf(secret, salt);

  const aesGcmParams: AesGcmParams = {
    name: 'AES-GCM',
    iv: nonce,
  };
  if (additionalData) {
    aesGcmParams.additionalData = additionalData;
  }
  const encrypted: ArrayBuffer = await crypto.subtle.encrypt(
    aesGcmParams,
    key,
    data
  );
  return {
    ciphertext: bytesToHex(new Uint8Array(encrypted)),
    salt: bytesToHex(salt),
    nonce: bytesToHex(nonce),
  };
};

/** AES-GCM Decryption */
export const decryptV2 = async (
  encryptedData: encryptedPrivateKeyTypeV2,
  secret: Uint8Array,
  additionalData?: Uint8Array
): Promise<Uint8Array> => {
  const key = await hkdf(secret, hexToBytes(encryptedData.salt as string));
  const aesGcmParams: AesGcmParams = {
    name: 'AES-GCM',
    iv: hexToBytes(encryptedData.nonce),
  };
  if (additionalData) {
    aesGcmParams.additionalData = additionalData;
  }
  const decrypted: ArrayBuffer = await crypto.subtle.decrypt(
    aesGcmParams,
    key,
    hexToBytes(encryptedData.ciphertext)
  );
  return new Uint8Array(decrypted);
};

export const encryptPGPKey = async (
  encryptionType: string,
  privateKey: string,
  wallet: walletType,
  additionalMeta?: {
    NFTPGP_V1?: {
      password: string;
    };
  }
): Promise<encryptedPrivateKeyType> => {
  let encryptedPrivateKey: encryptedPrivateKeyType;
  switch (encryptionType) {
    case Constants.ENC_TYPE_V1: {
      let walletPublicKey: string;
      if (wallet?.signer?.privateKey) {
        // get metamask specific encryption public key
        walletPublicKey = getEncryptionPublicKey(
          wallet?.signer?.privateKey.substring(2)
        );
      } else {
        // wallet popup will happen to get encryption public key
        walletPublicKey = await getPublicKey(wallet);
      }
      encryptedPrivateKey = encryptV1(
        privateKey,
        walletPublicKey,
        encryptionType
      );
      break;
    }
    case Constants.ENC_TYPE_V3: {
      const input = bytesToHex(await getRandomValues(new Uint8Array(32)));
      const enableProfileMessage = 'Enable Push Profile \n' + input;
      const { verificationProof: secret } = await getEip191Signature(
        wallet,
        enableProfileMessage
      );
      const enc = new TextEncoder();
      const encodedPrivateKey = enc.encode(privateKey);
      encryptedPrivateKey = await encryptV2(
        encodedPrivateKey,
        hexToBytes(secret || '')
      );
      encryptedPrivateKey.version = Constants.ENC_TYPE_V3;
      encryptedPrivateKey.preKey = input;
      break;
    }
    case Constants.ENC_TYPE_V4: {
      if (!additionalMeta?.NFTPGP_V1?.password) {
        throw new Error('Password is required!');
      }
      const enc = new TextEncoder();
      const encodedPrivateKey = enc.encode(privateKey);
      encryptedPrivateKey = await encryptV2(
        encodedPrivateKey,
        hexToBytes(stringToHex(additionalMeta.NFTPGP_V1.password))
      );
      encryptedPrivateKey.version = Constants.ENC_TYPE_V4;
      encryptedPrivateKey.preKey = '';
      break;
    }
    default:
      throw new Error('Invalid Encryption Type');
  }
  return encryptedPrivateKey;
};

export const preparePGPPublicKey = async (
  encryptionType: string,
  publicKey: string,
  wallet: walletType
): Promise<string> => {
  let chatPublicKey: string;
  switch (encryptionType) {
    case Constants.ENC_TYPE_V1: {
      chatPublicKey = publicKey;
      break;
    }
    case Constants.ENC_TYPE_V3: {
      const createProfileMessage =
        'Create Push Profile \n' + generateHash(publicKey);
      const { verificationProof } = await getEip191Signature(
        wallet,
        createProfileMessage
      );
      chatPublicKey = JSON.stringify({
        key: publicKey,
        signature: verificationProof,
      });
      break;
    }
    case Constants.ENC_TYPE_V4: {
      const createProfileMessage =
        'Create Push Profile \n' + generateHash(publicKey);
      const { verificationProof } = await getEip191Signature(
        wallet,
        createProfileMessage
      );
      chatPublicKey = JSON.stringify({
        key: publicKey,
        signature: verificationProof,
      });
      break;
    }
    default:
      throw new Error('Invalid Encryption Type');
  }
  return chatPublicKey;
};

export const verifyPGPPublicKey = (
  encryptionType: string,
  publicKey: string,
  did: string,
  nftOwner: string
): string => {
  if (encryptionType && encryptionType !== Constants.ENC_TYPE_V1) {
    const { key, signature: verificationProof } = JSON.parse(publicKey);
    publicKey = key;
    let signedData: string;
    if (encryptionType === Constants.ENC_TYPE_V2)
      signedData = 'Create Push Chat Profile \n' + generateHash(key);
    else signedData = 'Create Push Profile \n' + generateHash(key);
    if (
      verifyProfileSignature(
        verificationProof,
        signedData,
        pCAIP10ToWallet(did),
        nftOwner ? pCAIP10ToWallet(nftOwner) : nftOwner
      )
    )
      return publicKey;
    else throw new Error('Cannot verify Encryption Keys for this user');
  }
  return publicKey;
};

export const validatePssword = (password: string) => {
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long!');
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error('Password must contain at least one uppercase letter!');
  }
  if (!/[a-z]/.test(password)) {
    throw new Error('Password must contain at least one lowercase letter!');
  }
  if (!/\d/.test(password)) {
    throw new Error('Password must contain at least one digit!');
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    throw new Error('Password must contain at least one special character!');
  }
};
