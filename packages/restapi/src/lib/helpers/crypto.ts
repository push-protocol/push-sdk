import * as metamaskSigUtil from '@metamask/eth-sig-util';
import {
  decrypt as metamaskDecrypt,
  getEncryptionPublicKey,
} from '@metamask/eth-sig-util';
import * as CryptoJS from 'crypto-js';
import { ethers } from 'ethers';
import {
  getAccountAddress,
  getWallet,
  getEip712Signature,
  getEip191Signature,
} from '../chat/helpers';
import Constants, { ENCRYPTION_TYPE, ENV } from '../constants';
import {
  SignerType,
  walletType,
  encryptedPrivateKeyType,
  ProgressHookType,
  ProgressHookTypeFunction,
} from '../types';
import {
  isValidCAIP10NFTAddress,
  isValidETHAddress,
  pCAIP10ToWallet,
} from './address';
import { verifyProfileSignature } from '../chat/helpers/signature';
import { upgrade } from '../user/upgradeUser';
import PROGRESSHOOK from '../progressHook';
import { getAddress } from './signer';
import { split, combine } from 'shamir-secret-sharing';
import Lit from './lit';

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
  const address: string =
    account || (await getAddress(signer as SignerType)) || '';
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

    // Report Progress
    progressHook?.(PROGRESSHOOK['PUSH-DECRYPT-01'] as ProgressHookType);

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
      case Constants.ENC_TYPE_V5: {
        if (!wallet?.signer) {
          throw new Error(
            'Cannot Decrypt this encryption version without signer!'
          );
        }
        const { pushShard, pushEncryptedShard, litEncryptedShard } = JSON.parse(
          encryptedPGPPrivateKey
        );

        let secret: any;
        try {
          // throw new Error('Try from Lit Shard');
          // decrypt pushShard
          const pushDecryptedShard = await decryptPGPKey({
            encryptedPGPPrivateKey: JSON.stringify(pushEncryptedShard),
            signer,
            env,
          });
          secret = await combine([
            hexToBytes(pushShard),
            hexToBytes(pushDecryptedShard),
          ]);
        } catch (err) {
          // decrypt litShard
          const lit = new Lit(
            wallet.signer as SignerType,
            pCAIP10ToWallet(address),
            litEncryptedShard.chain
          );
          const litDecryptedShard = await lit.decrypt(
            litEncryptedShard.encryptedString as string,
            litEncryptedShard.encryptedSymmetricKey as string
          );
          secret = await combine([
            hexToBytes(pushShard),
            hexToBytes(litDecryptedShard),
          ]);
        }

        const encodedPrivateKey = await decryptV2(
          JSON.parse(encryptedPGPPrivateKey),
          secret
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
        const errorProgressHook = PROGRESSHOOK[
          'PUSH-ERROR-01'
        ] as ProgressHookTypeFunction;
        progressHook?.(errorProgressHook(err));
      }
    }

    // Report Progress
    progressHook?.(PROGRESSHOOK['PUSH-DECRYPT-02'] as ProgressHookType);
    return privateKey;
  } catch (err) {
    // Report Progress
    const errorProgressHook = PROGRESSHOOK[
      'PUSH-ERROR-00'
    ] as ProgressHookTypeFunction;
    progressHook?.(errorProgressHook(decryptPGPKey.name, err));
    throw Error(
      `[Push SDK] - API - Error - API ${decryptPGPKey.name} -: ${err}`
    );
  }
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
): Promise<encryptedPrivateKeyType> => {
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
  encryptedData: encryptedPrivateKeyType,
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
  encryptionType: `${ENCRYPTION_TYPE}`,
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
    case ENCRYPTION_TYPE.PGP_V1: {
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
    case ENCRYPTION_TYPE.PGP_V2: {
      const input = bytesToHex(await getRandomValues(new Uint8Array(32)));
      const enableProfileMessage = 'Enable Push Chat Profile \n' + input;
      const { verificationProof: secret } = await getEip712Signature(
        wallet,
        enableProfileMessage,
        true
      );
      const enc = new TextEncoder();
      const encodedPrivateKey = enc.encode(privateKey);
      encryptedPrivateKey = await encryptV2(
        encodedPrivateKey,
        hexToBytes(secret || '')
      );
      encryptedPrivateKey.version = encryptionType;
      encryptedPrivateKey.preKey = input;
      break;
    }
    case ENCRYPTION_TYPE.PGP_V3: {
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
      encryptedPrivateKey.version = encryptionType;
      encryptedPrivateKey.preKey = input;
      break;
    }
    case ENCRYPTION_TYPE.NFTPGP_V1: {
      if (!additionalMeta?.NFTPGP_V1?.password) {
        throw new Error('Password is required!');
      }
      const enc = new TextEncoder();
      const encodedPrivateKey = enc.encode(privateKey);
      encryptedPrivateKey = await encryptV2(
        encodedPrivateKey,
        hexToBytes(stringToHex(additionalMeta.NFTPGP_V1.password))
      );
      encryptedPrivateKey.version = encryptionType;
      encryptedPrivateKey.preKey = '';
      break;
    }
    case ENCRYPTION_TYPE.PGP_V4: {
      // 1. Generate secret to encrypt private key
      const encryptionSecret = await getRandomValues(new Uint8Array(32));
      // 2. Split secret into 3 shards ( Combining any 2 shards can decrypt the secret )
      const PARTS = 3;
      const QUORUM = 2;
      const [shard1, shard2, shard3] = await split(
        encryptionSecret,
        PARTS,
        QUORUM
      );
      // 3. Encrypt private key with secret
      const enc = new TextEncoder();
      const encodedPrivateKey = enc.encode(privateKey);
      encryptedPrivateKey = await encryptV2(
        encodedPrivateKey,
        encryptionSecret
      );

      encryptedPrivateKey.version = encryptionType;

      // 4. Store shard1 on Push nodes
      encryptedPrivateKey.pushShard = bytesToHex(shard1);

      // 5. Encrypt and store shard2 on lit nodes
      const lit = new Lit(
        wallet.signer as SignerType,
        pCAIP10ToWallet(wallet.account as string),
        'ethereum'
      );
      const litEncryptedShard = await lit.encrypt(bytesToHex(shard2));
      encryptedPrivateKey.litEncryptedShard = litEncryptedShard;

      // 6. Encrypt and stpre shard3 on push nodes
      const pushEncryptedShard = await encryptPGPKey(
        ENCRYPTION_TYPE.PGP_V3,
        bytesToHex(shard3),
        wallet,
        additionalMeta
      );
      encryptedPrivateKey.pushEncryptedShard = pushEncryptedShard;
      break;
    }
    default:
      throw new Error('Invalid Encryption Type');
  }
  return encryptedPrivateKey;
};

export const preparePGPPublicKey = async (
  encryptionType: `${ENCRYPTION_TYPE}`,
  publicKey: string,
  wallet: walletType
): Promise<string> => {
  let chatPublicKey: string;
  switch (encryptionType) {
    case ENCRYPTION_TYPE.PGP_V1:
    case ENCRYPTION_TYPE.PGP_V4: {
      chatPublicKey = publicKey;
      break;
    }
    case ENCRYPTION_TYPE.PGP_V2:
    case ENCRYPTION_TYPE.PGP_V3:
    case ENCRYPTION_TYPE.NFTPGP_V1: {
      const verificationProof = 'DEPRECATED';

      /**
       * @deprecated
       * PUSH CHAT PROFILE CREATION DOES NOT SIGN PGP PUBLIC KEY
       * VERIFICATION PROOF SIGNATURE SHOULD BE USED FOR VERIFICATION OF PUSH PROFILE KEYS
       */

      // const createProfileMessage =
      //   'Create Push Profile \n' + generateHash(publicKey);
      // const { verificationProof } = await getEip191Signature(
      //   wallet,
      //   createProfileMessage
      // );

      // TODO - Change JSON Structure to string ie equivalent to ENC_TYPE_V1 ( would be done after PUSH Node changes )
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

/**
 * Checks the Push Profile keys using verificationProof
 * @param encryptedPrivateKey
 * @param publicKey
 * @param did
 * @param caip10
 * @param verificationProof
 * @returns PGP Public Key
 */
export const verifyProfileKeys = async (
  encryptedPrivateKey: string,
  publicKey: string,
  did: string,
  caip10: string,
  verificationProof: string
): Promise<string> => {
  let parsedPublicKey: string;
  try {
    parsedPublicKey = JSON.parse(publicKey).key;
    if (parsedPublicKey === undefined) {
      throw new Error('Invalid Public Key');
    }
  } catch (err) {
    parsedPublicKey = publicKey;
  }

  try {
    if (publicKey && publicKey.length > 0 && verificationProof) {
      const data = {
        caip10,
        did,
        publicKey,
        encryptedPrivateKey,
      };

      if (isValidCAIP10NFTAddress(did)) {
        const keyToRemove = 'owner';
        const parsedEncryptedPrivateKey = JSON.parse(encryptedPrivateKey);
        if (keyToRemove in parsedEncryptedPrivateKey) {
          delete parsedEncryptedPrivateKey[keyToRemove];
        }
        data.encryptedPrivateKey = JSON.stringify(parsedEncryptedPrivateKey);
      }

      const signedData = generateHash(data);

      const isValidSig: boolean = await verifyProfileSignature(
        verificationProof,
        signedData,
        isValidCAIP10NFTAddress(did)
          ? pCAIP10ToWallet(JSON.parse(encryptedPrivateKey).owner)
          : pCAIP10ToWallet(did)
      );
      if (isValidSig) {
        return parsedPublicKey;
      } else {
        throw new Error('Invalid Signature');
      }
    }
    return parsedPublicKey;
  } catch (err) {
    console.warn(`Cannot Verify keys for DID : ${did} !!!`);
    return parsedPublicKey;
  }
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
