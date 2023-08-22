import {
  createUserService,
  generateKeyPair,
  generateRandomSecret,
  getAccountAddress,
  getWallet,
} from '../chat/helpers';
import { ENCRYPTION_TYPE, ENV } from '../constants';
import {
  isValidETHAddress,
  walletToPCAIP10,
  encryptPGPKey,
  preparePGPPublicKey,
  isValidCAIP10NFTAddress,
  validatePssword,
} from '../helpers';
import {
  SignerType,
  encryptedPrivateKeyType,
  ProgressHookType,
  IUser,
  encryptedPrivateKeyTypeV2,
  ProgressHookTypeFunction,
} from '../types';
import PROGRESSHOOK from '../progressHook';
import { getTokenBoundAddress, getNFTDID } from '../helpers/tokenBound';

export type CreateUserProps = {
  account?: string;
  signer?: SignerType;
  version?: `${ENCRYPTION_TYPE}`;
  additionalMeta?: {
    NFTPGP_V1?: {
      password: string;
    };
  };
  env?: ENV;
  progressHook?: (progress: ProgressHookType) => void;
};

interface ICreateUser extends IUser {
  decryptedPrivateKey?: string;
}
export const create = async (
  options: CreateUserProps
): Promise<ICreateUser> => {
  const {
    account = null,
    signer = null,
    version = null,
    additionalMeta = {
      NFTPGP_V1: {
        password: '$0Pc' + generateRandomSecret(10), // default password
      },
    },
    env = ENV.PROD,
    progressHook,
  } = options || {};

  try {
    /**
     * 0. PREPRATION
     * This includes
     * - Input Validation
     * - Choosing encryption version if no provided by user
     * - Downgrading encryption version when signer is not provided
     * - Converting NFT-DID To Wallet-DID For 6551 Based Encryption ( NFTPGP_V2 )
     */

    await validateOptions(options);

    const wallet = getWallet({ account, signer });
    let address = await getAccountAddress(wallet);
    let encryptionType = version;

    // Define encryption version
    if (!version) {
      if (isValidCAIP10NFTAddress(walletToPCAIP10(address))) {
        encryptionType = ENCRYPTION_TYPE.NFTPGP_V1;
      } else {
        if (!signer) encryptionType = ENCRYPTION_TYPE.PGP_V1;
        else encryptionType = ENCRYPTION_TYPE.PGP_V3;
      }
    }

    // Downgrade Encryption Version ( NULL Signer is only allowed in W2W Chat )
    if (!signer) {
      encryptionType = ENCRYPTION_TYPE.PGP_V1;
    }

    // Convert NFT-DID To Wallet-DID For 6551 Based Encryption ( NFTPGP_V2 )
    if (encryptionType === ENCRYPTION_TYPE.NFTPGP_V2) {
      const tokenBoundAccount = await getTokenBoundAddress(address);
      wallet.account = tokenBoundAccount;
      address = tokenBoundAccount;
    }

    /**
     * 1. GENERATE ENCRYPTION KEY PAIR
     */
    progressHook?.(PROGRESSHOOK['PUSH-CREATE-01'] as ProgressHookType);
    const keyPairs = await generateKeyPair();

    /**
     * 2. PREPARE PUBLIC KEY
     * Note - Previously this step use to sign PGP Public Key with ETH Private Key but now it is deprecated with coming of the verificationProof
     */
    progressHook?.(PROGRESSHOOK['PUSH-CREATE-02'] as ProgressHookType);
    const publicKey: string = await preparePGPPublicKey(
      encryptionType as string,
      keyPairs.publicKeyArmored
    );

    /**
     * 3. ENCRYPT PGP PRIVATE KEY
     * Note - For Encryption NFTPGP_V1, password is also encrypted
     */
    progressHook?.(PROGRESSHOOK['PUSH-CREATE-03'] as ProgressHookType);
    const encryptedPrivateKey: encryptedPrivateKeyType = await encryptPGPKey(
      encryptionType as string,
      keyPairs.privateKeyArmored,
      wallet,
      additionalMeta
    );
    if (encryptionType === ENCRYPTION_TYPE.NFTPGP_V1) {
      const encryptedPassword: encryptedPrivateKeyTypeV2 = await encryptPGPKey(
        ENCRYPTION_TYPE.PGP_V3,
        additionalMeta.NFTPGP_V1?.password as string,
        wallet,
        additionalMeta
      );
      encryptedPrivateKey.encryptedPassword = encryptedPassword;
    }

    /**
     * 4. VERIFICATION PROOF GENERATION & PUSH NODES SYNCING
     */
    progressHook?.(PROGRESSHOOK['PUSH-CREATE-04'] as ProgressHookType);
    const body = {
      user: walletToPCAIP10(address),
      wallet,
      publicKey: publicKey,
      encryptedPrivateKey: JSON.stringify(encryptedPrivateKey),
      env,
    };
    const createdUser: ICreateUser = await createUserService(body);

    /**
     * 5. SUCCESSFUL USER CREATION
     */
    progressHook?.(PROGRESSHOOK['PUSH-CREATE-05'] as ProgressHookType);

    /**
     * Modify Response
     * 1. Add decryptedPrivateKey - this removes the need to decrypt private key again
     * 2. Mask w2w-DID to NFT-did for NFTPGP_V2
     */
    createdUser.decryptedPrivateKey = keyPairs.privateKeyArmored;
    if (encryptionType === ENCRYPTION_TYPE.NFTPGP_V2) {
      createdUser.did = createdUser.wallets = await getNFTDID(
        createdUser.did,
        address
      );
    }

    return createdUser;
  } catch (err) {
    /**
     * REPORT ERROR
     */
    const errorProgressHook = PROGRESSHOOK[
      'PUSH-ERROR-00'
    ] as ProgressHookTypeFunction;
    progressHook?.(errorProgressHook(create.name, err));
    throw Error(`[Push SDK] - API - Error - API ${create.name} -: ${err}`);
  }
};

const validateOptions = async (options: CreateUserProps): Promise<void> => {
  const {
    account = null,
    signer = null,
    version,
    additionalMeta = {
      NFTPGP_V1: {
        password: '$0Pc' + generateRandomSecret(10), // default password
      },
    },
  } = options || {};

  /**
   * 1. Account Validation
   * Note - Account is required for NFT CHAT
   */
  if (account == null && signer == null) {
    throw new Error(`At least one from account or signer is necessary!`);
  }

  const wallet = getWallet({ account, signer });
  const address = await getAccountAddress(wallet);

  if (!isValidETHAddress(address)) {
    throw new Error(`Invalid address!`);
  }

  if (
    version &&
    (version === ENCRYPTION_TYPE.NFTPGP_V1 ||
      version === ENCRYPTION_TYPE.NFTPGP_V2)
  ) {
    if (!isValidCAIP10NFTAddress(account as string)) {
      throw new Error(`Account is not a valid NFT-DID`);
    }
  }

  /**
   * 2. Signer Validation
   * Note - Signer is required for NFT CHAT
   */
  if (isValidCAIP10NFTAddress(walletToPCAIP10(address)) && signer === null) {
    throw new Error(`Signer is not required for NFT Encryption!`);
  }

  /**
   * 3. Encryption Version Validation
   * Note - If verson not passed then sdk chooses the default itself
   */
  if (version) {
    // NFT CHAT
    if (isValidCAIP10NFTAddress(walletToPCAIP10(address))) {
      if (
        version !== ENCRYPTION_TYPE.NFTPGP_V1 &&
        version !== ENCRYPTION_TYPE.NFTPGP_V2
      ) {
        throw new Error(`Invalid encryption version!`);
      }
    }
    // W2W CHAT
    else {
      if (
        version !== ENCRYPTION_TYPE.PGP_V1 &&
        version !== ENCRYPTION_TYPE.PGP_V2 &&
        version !== ENCRYPTION_TYPE.PGP_V3
      ) {
        throw new Error(`Invalid encryption version!`);
      }
    }
  }

  /**
   * 4. AddtionalMeta Validation
   */
  if (additionalMeta?.NFTPGP_V1?.password) {
    validatePssword(additionalMeta.NFTPGP_V1.password);
  }
};
