import axios from 'axios';
import { getAPIBaseUrls } from '../helpers';
import Constants from '../constants';
import { ChatStatus, EnvOptionsType, GroupInfoDTO, SignerType } from '../types';
import { sign, getWallet, getConnectedUserV2 } from './helpers';
import * as CryptoJS from 'crypto-js';

export interface ChatUpdateConfigProfileType extends EnvOptionsType {
  account?: string | null;
  signer?: SignerType | null;
  chatId: string;
  meta?: string | null;
  scheduleAt?: Date | null;
  scheduleEnd?: Date | null;
  status?: ChatStatus | null;
  pgpPrivateKey?: string | null;
}

/**
 * Update Group Config
 */
export const updateGroupConfig = async (
  options: ChatUpdateConfigProfileType
): Promise<GroupInfoDTO> => {
  const {
    chatId,
    meta,
    scheduleAt,
    scheduleEnd,
    status,
    account = null,
    signer = null,
    env = Constants.ENV.PROD,
    pgpPrivateKey = null,
  } = options || {};
  try {
    /**
     * VALIDATIONS
     */
    if (account == null && signer == null) {
      throw new Error(`At least one from account or signer is necessary!`);
    }

    const wallet = getWallet({ account, signer });

    /**
     * CREATE PROFILE VERIFICATION PROOF
     */
    const bodyToBeHashed = {
      meta,
      scheduleAt,
      scheduleEnd,
      status,
    };

    const hash = CryptoJS.SHA256(JSON.stringify(bodyToBeHashed)).toString();
    const connectedUser = await getConnectedUserV2(wallet, pgpPrivateKey, env);
    const signature: string = await sign({
      message: hash,
      signingKey: connectedUser.privateKey!,
    });
    const sigType = 'pgpv2';
    // Account is need to verify the signature at any future point
    const configVerificationProof: string =
      sigType + ':' + signature + ':' + connectedUser.did;

    /**
     * API CALL TO PUSH NODES
     */
    const API_BASE_URL = getAPIBaseUrls(env);
    const apiEndpoint = `${API_BASE_URL}/v1/chat/groups/${chatId}/config`;

    const body = bodyToBeHashed;
    (body as any).configVerificationProof = configVerificationProof;

    return axios
      .put(apiEndpoint, body)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        if (err?.response?.data)
          throw new Error(JSON.stringify(err?.response?.data));
        throw new Error(err);
      });
  } catch (err) {
    console.error(
      `[Push SDK] - API  - Error - API ${updateGroupConfig.name} -:  `,
      err
    );
    throw Error(
      `[Push SDK] - API  - Error - API ${updateGroupConfig.name} -: ${err}`
    );
  }
};
