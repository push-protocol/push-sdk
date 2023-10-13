import {
  createUserService,
  generateKeyPair,
  generateRandomSecret,
  getAccountAddress,
  getWallet,
} from '../chat/helpers';
import Constants, { ENCRYPTION_TYPE, ENV } from '../constants';
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
  ProgressHookTypeFunction,
} from '../types';
import PROGRESSHOOK from '../progressHook';

export type CreateUserProps = {
  env?: ENV;
  account?: string;
  signer?: SignerType;
  version?: `${ENCRYPTION_TYPE}`;
  additionalMeta?: {
    NFTPGP_V1?: {
      password: string;
    };
  };
  progressHook?: (progress: ProgressHookType) => void;
  origin?: string | null;
};

interface ICreateUser extends IUser {
  decryptedPrivateKey?: string;
}
export const create = async (
  options: CreateUserProps
): Promise<ICreateUser> => {
  /**
   * Compute Input Options
   * 1. Provides the options object with default values
   * 2. Takes care of deprecated fields
   */
  const computedOptions = computeOptions(options);

  const {
    env,
    account,
    signer,
    version,
    additionalMeta,
    progressHook,
    origin,
  } = computedOptions;

  try {
    /**
     * Validate Input Options
     */
    validateOptions(computedOptions);

    const wallet = getWallet({ account, signer });
    const address = await getAccountAddress(wallet);
    const caip10: string = walletToPCAIP10(address);
    /**
     * Generate Encryption Keys
     */
    progressHook?.(PROGRESSHOOK['PUSH-CREATE-01'] as ProgressHookType);
    const keyPairs = await generateKeyPair();

    /**
     * Prepare Public Key
     */
    progressHook?.(PROGRESSHOOK['PUSH-CREATE-02'] as ProgressHookType);
    const publicKey: string = await preparePGPPublicKey(
      version,
      keyPairs.publicKeyArmored,
      wallet
    );

    /**
     * Encrypt Private Key
     */
    progressHook?.(PROGRESSHOOK['PUSH-CREATE-03'] as ProgressHookType);
    const encryptedPrivateKey: encryptedPrivateKeyType = await encryptPGPKey(
      version,
      keyPairs.privateKeyArmored,
      wallet,
      additionalMeta
    );
    if (version === ENCRYPTION_TYPE.NFTPGP_V1) {
      const encryptedPassword: encryptedPrivateKeyType = await encryptPGPKey(
        ENCRYPTION_TYPE.PGP_V3,
        additionalMeta.NFTPGP_V1?.password as string,
        wallet,
        additionalMeta
      );
      encryptedPrivateKey.encryptedPassword = encryptedPassword;
    }

    /**
     * Sync Data with Push Nodes
     */
    progressHook?.(PROGRESSHOOK['PUSH-CREATE-04'] as ProgressHookType);
    const body = {
      user: caip10,
      wallet,
      publicKey: publicKey,
      encryptedPrivateKey: JSON.stringify(encryptedPrivateKey),
      env,
      origin: origin,
    };
    const createdUser: ICreateUser = await createUserService(body);

    /**
     * Create User Success
     */
    progressHook?.(PROGRESSHOOK['PUSH-CREATE-05'] as ProgressHookType);
    createdUser.decryptedPrivateKey = keyPairs.privateKeyArmored;
    return createdUser;
  } catch (err) {
    // Report Progress
    const errorProgressHook = PROGRESSHOOK[
      'PUSH-ERROR-00'
    ] as ProgressHookTypeFunction;
    progressHook?.(errorProgressHook(create.name, err));
    throw Error(`[Push SDK] - API - Error - API ${create.name} -: ${err}`);
  }
};

type ComputedOptionsType = {
  env: ENV;
  account: string | null;
  signer: SignerType | null;
  version: `${ENCRYPTION_TYPE}`;
  additionalMeta: {
    NFTPGP_V1?: {
      password: string;
    };
  };
  progressHook?: (progress: ProgressHookType) => void;
  origin?: string | null;
};

const validateOptions = async (options: ComputedOptionsType) => {
  const { account, signer, version, additionalMeta } = options;

  if (account == null && signer == null) {
    throw new Error(`At least one from account or signer is necessary!`);
  }

  const wallet = getWallet({ account, signer });
  const address = await getAccountAddress(wallet);
  const caip10 = walletToPCAIP10(address);

  if (!isValidETHAddress(address)) {
    throw new Error(`Invalid address!`);
  }

  switch (version) {
    case ENCRYPTION_TYPE.PGP_V1: {
      if (isValidCAIP10NFTAddress(caip10)) {
        throw new Error(`NFT DID is not supported in PGP_V1!`);
      }
      break;
    }
    case ENCRYPTION_TYPE.PGP_V2:
    case ENCRYPTION_TYPE.PGP_V3: {
      if (!signer) {
        throw new Error(
          `Unable to detect signer. Please ensure that 'signer' is properly defined.`
        );
      }
      if (isValidCAIP10NFTAddress(caip10)) {
        throw new Error(`NFT DID is not supported in PGP_V2 & PGP_V3!`);
      }
      break;
    }
    case ENCRYPTION_TYPE.NFTPGP_V1: {
      if (!signer) {
        throw new Error(
          `Unable to detect signer. Please ensure that 'signer' is properly defined.`
        );
      }
      if (!isValidCAIP10NFTAddress(caip10)) {
        throw new Error(`Only NFT DID is supported in NFTPGP_V1!`);
      }
      break;
    }
    case ENCRYPTION_TYPE.PGP_V4: {
      if (!signer) {
        throw new Error(
          `Unable to detect signer. Please ensure that 'signer' is properly defined.`
        );
      }
      break;
    }
    default: {
      throw new Error(`Invalid encryption version!`);
    }
  }

  // additionalMeta validations
  if (additionalMeta?.NFTPGP_V1?.password) {
    validatePssword(additionalMeta.NFTPGP_V1.password);
  }
};

/**
 * Returns computed options after setting default values
 * @param options
 * @returns Computed Options
 */
const computeOptions = (options: CreateUserProps): ComputedOptionsType => {
  const computedOptions = {
    env: options.env || Constants.ENV.PROD,
    account: options.account || null,
    signer: options.signer || null,
    version:
      options.version ||
      (options.signer
        ? isValidCAIP10NFTAddress(options.account as string)
          ? ENCRYPTION_TYPE.NFTPGP_V1
          : ENCRYPTION_TYPE.PGP_V3
        : ENCRYPTION_TYPE.PGP_V1),
    additionalMeta: options.additionalMeta || {
      NFTPGP_V1: {
        password: '$0Pc' + generateRandomSecret(10),
      },
    },
    progressHook: options.progressHook,
    origin: options.origin,
  };
  return computedOptions;
};
