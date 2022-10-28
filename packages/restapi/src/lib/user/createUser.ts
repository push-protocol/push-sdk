import axios from "axios";
import { generateKeyPair, walletToCAIP10 } from "../chat/helpers";
import Constants from "../constants";
import { encryptWithRPCEncryptionPublicKeyReturnRawData, getAPIBaseUrls } from "../helpers";
import { getPublicKey } from "../helpers";
import { Signer } from "ethers";

export type UserCreateOptionsType = {
  env?: string;
  signer: Signer;
}

/*
  POST /v1/users/
*/

export const create = async (
  options : UserCreateOptionsType
) => {
  const {
    env = Constants.ENV.PROD,
    signer
  } = options || {};

  const account = await signer.getAddress();
  
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

  return axios.post(requestUrl, body)
  .then((response) => {
    return response.data;
  })
  .catch((err) => {
    console.error(`[EPNS-SDK] - API ${requestUrl}: `, err);
  });
}