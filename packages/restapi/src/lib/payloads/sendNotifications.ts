import axios from 'axios';
import { ISendNotificationInputOptions } from '../types';
import {
  getPayloadForAPIInput,
  getPayloadIdentity,
  getRecipients,
  getRecipientFieldForAPIPayload,
  getVerificationProof,
  getSource,
  getUUID,
} from './helpers';
import { getCAIPAddress, getCAIPDetails, getConfig } from '../helpers';
import { IDENTITY_TYPE } from './constants';
import { ENV } from '../constants';
import { getWallet } from '../chat/helpers';

/**
 * Validate options for some scenarios
 */
function validateOptions(options: any) {
  if (!options?.channel) {
    throw '[Push SDK] - Error - sendNotification() - "channel" is mandatory!';
  }

  /**
   * Apart from IPFS, GRAPH use cases "notification", "payload" is mandatory
   */
  if (
    options?.identityType === IDENTITY_TYPE.DIRECT_PAYLOAD ||
    options?.identityType === IDENTITY_TYPE.MINIMAL
  ) {
    if (!options.notification) {
      throw '[Push SDK] - Error - sendNotification() - "notification" mandatory for Identity Type: Direct Payload, Minimal!';
    }
    if (!options.payload) {
      throw '[Push SDK] - Error - sendNotification() - "payload" mandatory for Identity Type: Direct Payload, Minimal!';
    }
  }
}

export async function sendNotification(options: ISendNotificationInputOptions) {
  try {
    const {
      /* 
        senderType = 0 for channel notification (default)
        senderType = 1 for chat notification
      */
      senderType = 0,
      signer,
      type,
      identityType,
      payload,
      recipients,
      channel,
      graph,
      ipfsHash,
      env = ENV.PROD,
      chatId,
      pgpPrivateKey,
    } = options || {};

    validateOptions(options);

    if (signer === undefined) {
      throw new Error(`Signer is necessary!`);
    }

    const wallet = getWallet({ account: null, signer });

    const _channelAddress = getCAIPAddress(env, channel, 'Channel');
    const channelCAIPDetails = getCAIPDetails(_channelAddress);

    if (!channelCAIPDetails) throw Error('Invalid Channel CAIP!');

    const uuid = getUUID();
    const chainId = parseInt(channelCAIPDetails.networkId, 10);

    const { API_BASE_URL, EPNS_COMMUNICATOR_CONTRACT } = getConfig(
      env,
      channelCAIPDetails
    );

    const _recipients = await getRecipients({
      env,
      notificationType: type,
      channel: _channelAddress,
      recipients,
      secretType: payload?.sectype,
    });

    const notificationPayload = getPayloadForAPIInput(options, _recipients);

    const verificationProof = await getVerificationProof({
      senderType,
      signer,
      chainId,
      identityType,
      notificationType: type,
      verifyingContract: EPNS_COMMUNICATOR_CONTRACT,
      payload: notificationPayload,
      graph,
      ipfsHash,
      uuid,
      // for the pgpv2 verfication proof
      chatId,
      wallet,
      pgpPrivateKey,
      env,
    });

    const identity = getPayloadIdentity({
      identityType,
      payload: notificationPayload,
      notificationType: type,
      graph,
      ipfsHash,
    });

    const source = getSource(chainId, identityType, senderType);

    const apiPayload = {
      verificationProof,
      identity,
      sender:
        senderType === 1
          ? `${channelCAIPDetails?.blockchain}:${channelCAIPDetails?.address}`
          : _channelAddress,
      source,
      /** note this recipient key has a different expectation from the BE API, see the funciton for more */
      recipient: getRecipientFieldForAPIPayload({
        env,
        notificationType: type,
        recipients: recipients || '',
        channel: _channelAddress,
      }),
    };

    const requestURL = `${API_BASE_URL}/v1/payloads/`;
    return await axios.post(requestURL, apiPayload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.error(
      '[Push SDK] - Error - sendNotification() - ',
      JSON.stringify(err)
    );
    throw err;
  }
}
