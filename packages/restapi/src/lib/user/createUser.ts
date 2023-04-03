import { createUserService, generateKeyPair, getAccountAddress, getWallet } from "../chat/helpers";
import Constants, {ENV} from "../constants";
import { isValidETHAddress, walletToPCAIP10, encryptPGPKey, preparePGPPublicKey } from "../helpers";
import { SignerType, encryptedPrivateKeyType } from "../types";

export type CreateUserProps = {
  env?:  ENV;
  account?: string;
  signer?: SignerType;
  version?: typeof Constants.ENC_TYPE_V1 | typeof Constants.ENC_TYPE_V2;
};

export const create = async (
  options: CreateUserProps
) => {
  const {
    env = Constants.ENV.PROD,
    account = null,
    signer = null,
    version = Constants.ENC_TYPE_V2
  } = options || {};

  if(account == null && signer == null) {
    throw new Error(`At least one from account or signer is necessary!`);
  }

  const wallet = getWallet({ account, signer });
  const address = await getAccountAddress(wallet);
  
  if (!isValidETHAddress(address)) {
    throw new Error(`Invalid address!`);
  }

  const caip10: string = walletToPCAIP10(address);
  const encryptionType: string = (wallet?.signer && version === Constants.ENC_TYPE_V2) ? Constants.ENC_TYPE_V2 : Constants.ENC_TYPE_V1;
  const keyPairs = await generateKeyPair();
  const publicKey: string = await preparePGPPublicKey(encryptionType, keyPairs.publicKeyArmored, wallet);
  const encryptedPrivateKey: encryptedPrivateKeyType = await encryptPGPKey(encryptionType, keyPairs.privateKeyArmored, address, wallet);

  const body = {
    user: caip10,
    wallet,
    publicKey: publicKey,
    encryptedPrivateKey: JSON.stringify(encryptedPrivateKey),
    encryptionType: encryptionType,
    env
  };

  return createUserService(body);
}