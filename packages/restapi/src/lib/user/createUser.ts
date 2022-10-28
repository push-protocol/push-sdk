import { createUserService, generateKeyPair } from "../chat/helpers";
import Constants from "../constants";
import { encryptWithRPCEncryptionPublicKeyReturnRawData,isValidETHAddress,walletToPCAIP10 } from "../helpers";
import { getPublicKey } from "../helpers";

export type UserCreateOptionsType = {
  env?: string;
  account: string;
}

/*
  POST /v1/users/
*/

export const create = async (
  options : UserCreateOptionsType
) => {
  const {
    env = Constants.ENV.PROD,
    account
  } = options || {};

  if(!isValidETHAddress(account))
  {
    throw new Error(`Invalid address!`);
  }
  const keyPairs = await generateKeyPair();

  const walletPublicKey = await getPublicKey(account);
  const encryptedPrivateKey = encryptWithRPCEncryptionPublicKeyReturnRawData(
    keyPairs.privateKeyArmored,
    walletPublicKey
  );
  const caip10: string = walletToPCAIP10(account);

  const body = {
    user: caip10,
    publicKey: keyPairs.publicKeyArmored,
    encryptedPrivateKey: JSON.stringify(encryptedPrivateKey),
    encryptionType: 'x25519-xsalsa20-poly1305',
    signature: 'xyz',
    sigType: 'a',
    env
  };

  return createUserService(body);
}