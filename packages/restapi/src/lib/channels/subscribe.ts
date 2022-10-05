import axios from "axios";
import {
  getCAIPAddress,
  getConfig,
  getCAIPDetails,
} from '../helpers';
import {
  getTypeInformation,
  getDomainInformation,
  getSubscriptionMessage
} from './signature.helpers';
import Constants from '../constants';

type SignerType = {
  _signTypedData: (
    domain: unknown,
    types: unknown,
    value: unknown
  ) => Promise<string>
}
 
export type SubscribeOptionsType = {
  signer: SignerType;
  channelAddress: string;
  userAddress: string;
  verifyingContractAddress?: string;
  env?: string;
  onSuccess?: () => void
  onError?: (err: Error) => void,
}

export const subscribe = async (
 options: SubscribeOptionsType
) => {
  const {
    signer,
    channelAddress,
    userAddress,
    verifyingContractAddress,
    env = Constants.ENV.PROD,
    onSuccess,
    onError,
  } = options || {};

  try {
    const _channelAddress = getCAIPAddress(env, channelAddress, 'Channel');

    const channelCAIPDetails = getCAIPDetails(_channelAddress);
    if (!channelCAIPDetails) throw Error('Invalid Channel CAIP!');

    const chainId = parseInt(channelCAIPDetails.networkId, 10);

    const _userAddress = getCAIPAddress(env, userAddress, 'User');
  
    const userCAIPDetails = getCAIPDetails(_userAddress);
    if (!userCAIPDetails) throw Error('Invalid User CAIP!');

    const { API_BASE_URL,EPNS_COMMUNICATOR_CONTRACT } = getConfig(env, channelCAIPDetails);

    const requestUrl = `${API_BASE_URL}/v1/channels/${_channelAddress}/subscribe`;

    // get domain information
    const domainInformation = getDomainInformation(
      chainId,
      verifyingContractAddress || EPNS_COMMUNICATOR_CONTRACT
    );

    // get type information
    const typeInformation = getTypeInformation("Subscribe");

    // get message
    const messageInformation = getSubscriptionMessage(
      channelCAIPDetails.address,
      userCAIPDetails.address,
      "Subscribe"
    );

    // sign a message using EIP712
    const signature = await signer._signTypedData(
      domainInformation,
      typeInformation,
      messageInformation
    );

    const verificationProof = signature; // might change

    const body = {
      verificationProof,
      message: {
        ...messageInformation,
        channel: _channelAddress,
        subscriber: _userAddress
      },
    };

    await axios.post(requestUrl, body);

    if (typeof onSuccess === 'function') onSuccess();

    return { status: "success", message: "successfully opted into channel" };
  } catch (err) {
    if (typeof onError === 'function') onError(err as Error);

    return { status: "error", message: err instanceof Error ? err.message : JSON.stringify(err) };
  }
}