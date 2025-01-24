import { getCAIPAddress, getConfig, getCAIPDetails, Signer } from '../helpers';
import {
  getDomainInformation,
  getTypeInformationV2,
  getSubscriptionMessageV2,
} from './signature.helpers';
import Constants, { ENV } from '../constants';
import { SignerType } from '../types';
import { axiosPost } from '../utils/axiosUtil';
import { sign } from '../chat/helpers';
import * as CryptoJS from 'crypto-js';

export type UnSubscribeOptionsV2Type = {
  signer: SignerType;
  channelAddress: string;
  userAddress: string;
  verifyingContractAddress?: string;
  env?: ENV;
  onSuccess?: () => void;
  onError?: (err: Error) => void;
  pgpPrivateKey?: string;
};

export const unsubscribeV2 = async (options: UnSubscribeOptionsV2Type) => {
  const {
    signer,
    channelAddress,
    userAddress,
    verifyingContractAddress,
    env = Constants.ENV.PROD,
    onSuccess,
    onError,
    pgpPrivateKey,
  } = options || {};

  try {
    const _channelAddress = await getCAIPAddress(
      env,
      channelAddress,
      'Channel'
    );

    const channelCAIPDetails = getCAIPDetails(_channelAddress);
    if (!channelCAIPDetails) throw Error('Invalid Channel CAIP!');

    const chainId = parseInt(channelCAIPDetails.networkId, 10);

    const _userAddress = await getCAIPAddress(env, userAddress, 'User');

    const userCAIPDetails = getCAIPDetails(_userAddress);
    if (!userCAIPDetails) throw Error('Invalid User CAIP!');

    const { API_BASE_URL, EPNS_COMMUNICATOR_CONTRACT } = getConfig(
      env,
      channelCAIPDetails
    );

    const requestUrl = `${API_BASE_URL}/v1/channels/${_channelAddress}/unsubscribe`;

    // get domain information
    const domainInformation = getDomainInformation(
      chainId,
      verifyingContractAddress || EPNS_COMMUNICATOR_CONTRACT
    );

    // get type information
    const typeInformation = getTypeInformationV2();

    // get message
    let messageInformation: { data: any } = { data: {} };

    let verificationProof: string;
    if (pgpPrivateKey) {
      // TODO: Entire payload: domainInformation typeInformation messageInformation
      // TODO: Add chainid
      const data = getSubscriptionMessageV2(
        channelCAIPDetails.address,
        _userAddress,
        'Unsubscribe'
      );
      messageInformation = {
        data: data,
      };
      const hash = CryptoJS.SHA256(
        JSON.stringify(messageInformation)
      ).toString();
      const signature = await sign({
        message: hash,
        signingKey: pgpPrivateKey,
      });
      verificationProof = `pgpv4:${signature}`;
    } else {
      messageInformation = {
        data: getSubscriptionMessageV2(
          channelCAIPDetails.address,
          userCAIPDetails.address,
          'Unsubscribe'
        ),
      };
      // Existing EIP712 flow
      const pushSigner = new Signer(signer);
      const signature = await pushSigner.signTypedData(
        domainInformation,
        typeInformation,
        messageInformation,
        'Data'
      );
      verificationProof = `eip712v2:${signature}`;
    }

    const body = {
      verificationProof: verificationProof,
      message: messageInformation.data,
    };

    const res = await axiosPost(requestUrl, body);

    if (typeof onSuccess === 'function') onSuccess();

    return { status: res.status, message: 'successfully opted out channel' };
  } catch (err: any) {
    if (typeof onError === 'function') onError(err as Error);

    return {
      status: err?.response?.status ?? '',
      message: err instanceof Error ? err.message : JSON.stringify(err),
    };
  }
};
