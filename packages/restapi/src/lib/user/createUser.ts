import axios from "axios";
import { walletToCAIP10 } from "../chat/helpers";
import Constants from "../constants";
import { encryptWithRPCEncryptionPublicKeyReturnRawData, generateKeyPair, getAPIBaseUrls, getPublicKey } from "../helpers";
import { IConnectedUser, IUser, SignerType } from "../types";

export type UserCreateOptionsType = {
  env?: string;
  signer: any;
}

export const create = async (
  options : UserCreateOptionsType
) => {
  const {
    env = Constants.ENV.PROD,
    signer
  } = options || {};

  try {
    const account = signer.getAddress();
    // get User to check if user already exists
    const user: IUser = get()

    if(user) {
      return { status: "success", message: "User already exists" };
    }
    
    const keyPairs = await generateKeyPair();

    const walletPublicKey = await getPublicKey(account);
    const encryptedPrivateKey = encryptWithRPCEncryptionPublicKeyReturnRawData(
      keyPairs.privateKeyArmored,
      walletPublicKey
    );
    const caip10: string = walletToCAIP10({ account });

    const API_BASE_URL = getAPIBaseUrls(env);

    const requestUrl = `${API_BASE_URL}/v1/users/`;

    const body = {
      caip10,
      did: caip10,
      publicKey: keyPairs.publicKeyArmored,
      encryptedPrivateKey: JSON.stringify(encryptedPrivateKey),
      encryptionType: 'x25519-xsalsa20-poly1305',
      signature: 'xyz',
      sigType: 'a',
    };

    const apiResponse = await axios.post(requestUrl, body);

    return { status: "success", message: "User successfully created" };
  } catch (err) {
    return { status: "error", message: err instanceof Error ? err.message : JSON.stringify(err) };
  }
}