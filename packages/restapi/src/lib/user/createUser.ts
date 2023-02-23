import { getEncryptionPublicKey } from "@metamask/eth-sig-util";
import { createUserService, generateKeyPair, getWallet } from "../chat/helpers";
import Constants from "../constants";
import { encryptWithRPCEncryptionPublicKeyReturnRawData, isValidETHAddress, walletToPCAIP10 } from "../helpers";
import { getPublicKey } from "../helpers";
import { SignerType } from "../types";

export type CreateUserProps = {
  env?: string;
  account?: string;
  signer?: SignerType;
};

export const create = async (
  options: CreateUserProps
) => {
  const {
    env = Constants.ENV.PROD,
    account = null,
    signer = null
  } = options || {};

  if(account == null && signer == null) {
    throw new Error(`At least one from account or signer is necessary!`);
  }

  const wallet = getWallet({ account, signer });
  const address: string = account || (await signer?.getAddress()) || '';

  if (!isValidETHAddress(address)) {
    throw new Error(`Invalid address!`);
  }

  const keyPairs = await generateKeyPair();

  let walletPublicKey;
  if(wallet?.signer?.privateKey) {
    // get metamask specific encryption public key
    walletPublicKey = getEncryptionPublicKey(wallet?.signer?.privateKey.substring(2));
  } else {
    // wallet popup will happen to get encryption public key
    walletPublicKey = await getPublicKey(wallet);
  }

  const encryptedPrivateKey = encryptWithRPCEncryptionPublicKeyReturnRawData(
    keyPairs.privateKeyArmored,
    walletPublicKey
  );
  const caip10: string = walletToPCAIP10(address);
  console.log(encryptedPrivateKey);

  const body = {
    user: caip10,
    wallet,
    publicKey: keyPairs.publicKeyArmored,
    encryptedPrivateKey: JSON.stringify(encryptedPrivateKey),
    encryptionType: encryptedPrivateKey.version,
    env
  };

  return createUserService(body);
}