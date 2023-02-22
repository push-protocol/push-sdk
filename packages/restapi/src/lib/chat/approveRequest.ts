import axios from 'axios';
import { getAPIBaseUrls } from '../helpers';
import Constants from '../constants';
import { AccountEnvOptionsType } from '../types';
import { approveRequestPayload, sign, getConnectedUser, IApproveRequestPayload } from './helpers';
import * as CryptoJS from "crypto-js"

/**
 *  POST '/v1/chat/request/accept
 */

interface ApproveRequestOptionsType extends AccountEnvOptionsType {
  senderAddress: string; // chat request sender address
  pgpPrivateKey?: string,
  status?: 'Approved';
  // sigType?: string;
}

export const approve = async (
  options: ApproveRequestOptionsType
) => {
  const {
    status = "Approved",
    // sigType = 'sigType',
    // privateKey = null,
    account,
    senderAddress,
    env = Constants.ENV.PROD,
    pgpPrivateKey = null,
  } = options || {};

  // get user with raw privateKey
  // const createdUser: IConnectedUser = await getConnectedUser(account, privateKey, env);
  // const connectedUser = await createUserIfNecessary({account,env});
  // TODO: make signature
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/chat/request/accept`;

  const requestUrl = `${apiEndpoint}`;

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

  return axios.put(requestUrl, body)
    .catch((err) => {
      console.error(`[EPNS-SDK] - API ${requestUrl}: `, err);
      throw Error(`[EPNS-SDK] - API ${requestUrl}: ${err}`);
    });
}
