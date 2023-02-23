import axios from 'axios';
import { getAPIBaseUrls } from '../helpers';
import Constants from '../constants';
import { AccountEnvOptionsType } from '../types';
import { approveRequestPayload, sign, getConnectedUser, IApproveRequestPayload } from './helpers';
import * as CryptoJS from "crypto-js"

interface ApproveRequestOptionsType extends AccountEnvOptionsType {
  /**
   * Chat request sender address
   */
  senderAddress: string;
  pgpPrivateKey?: string;

  /**
   * Request state. As of now, only `Approved` is allowed
   */
  status?: 'Approved';
}

/**
 * Approve Chat Request
 */
export const approve = async (
  options: ApproveRequestOptionsType
) => {
  const {
    status = "Approved",
    account,
    senderAddress,
    env = Constants.ENV.PROD,
    pgpPrivateKey = null,
  } = options || {};

  // get user with raw privateKey
  // const createdUser: IConnectedUser = await getConnectedUser(account, privateKey, env);
  // const connectedUser = await createUserIfNecessary({account,env});
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/chat/request/accept`;
  const body: IApproveRequestPayload = approveRequestPayload(senderAddress, account, status);

  const bodyToBeHashed = {
    fromDID: body.fromDID,
    toDID: body.toDID,
    status: body.status
  }

  const connectedUser = await getConnectedUser(account, pgpPrivateKey, env);
  const hash = CryptoJS.SHA256(JSON.stringify(bodyToBeHashed)).toString()
  const signature: string = await sign({
    message: hash,
    signingKey: connectedUser.privateKey!
  });
  const sigType = "pgp";
  const verificationProof: string = sigType + ":" + signature;
  body.verificationProof = verificationProof;

  return axios.put(apiEndpoint, body)
    .catch((err) => {
      console.error(`[Push SDK] - API ${approve.name}: `, err);
      throw Error(`[Push SDK] - API ${approve.name}: ${err}`);
    });
}
