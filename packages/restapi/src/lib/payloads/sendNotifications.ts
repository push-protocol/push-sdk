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
import {
  getAPIBaseUrls,
  getCAIPAddress,
  getCAIPDetails,
  getConfig,
  isValidCAIP10NFTAddress,
  isValidETHAddress,
} from '../helpers';
import {
  IDENTITY_TYPE,
  DEFAULT_DOMAIN,
  NOTIFICATION_TYPE,
  SOURCE_TYPES,
} from './constants';
import { ENV } from '../constants';
import { getChannel } from '../channels/getChannel';
import { axiosPost } from '../utils/axiosUtil';
/**
 * Validate options for some scenarios
 */
function validateOptions(options: any) {
  if (!options?.channel) {
    throw '[Push SDK] - Error - sendNotification() - "channel" is mandatory!';
  }
  if (!isValidETHAddress(options.channel)) {
    throw '[Push SDK] - Error - sendNotification() - "channel" is invalid!';
  }
  if (options.senderType === 0 && options.signer === undefined) {
    throw '[Push SDK] - Error - sendNotification() - "signer" is mandatory!';
  }
  if (options.senderType === 1 && options.pgpPrivateKey === undefined) {
    throw '[Push SDK] - Error - sendNotification() - "pgpPrivateKey" is mandatory!';
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

/**
 *
 * @param payloadOptions channel, recipient and type tp verify whether it is a simulate type
 * @returns boolean
 */
async function checkSimulateNotification(payloadOptions: {
  channel: string;
  recipient: string | string[] | undefined;
  type: NOTIFICATION_TYPE;
  env: ENV | undefined;
}): Promise<boolean> {
  try {
    const { channel, recipient, type, env } = payloadOptions || {};
    // fetch channel info
    const channelInfo = await getChannel({
      channel: channel,
      env: env,
    });
    // check if channel exists, if it does then its not simulate type
    if (channelInfo) return false;
    else {
      // if no channel info found, check if channel address = recipient and notification type is targeted
      const convertedRecipient =
        typeof recipient == 'string' && recipient?.split(':').length == 3
          ? recipient.split(':')[2]
          : recipient;
      return (
        channel == convertedRecipient && type == NOTIFICATION_TYPE.TARGETTED
      );
    }
  } catch (e) {
    return true;
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

    if (
      payload &&
      payload.additionalMeta &&
      typeof payload.additionalMeta === 'object' &&
      !payload.additionalMeta.domain
    ) {
      payload.additionalMeta.domain = DEFAULT_DOMAIN;
    }
    const _channelAddress = await getCAIPAddress(env, channel, 'Channel');
    const channelCAIPDetails = getCAIPDetails(_channelAddress);

    if (!channelCAIPDetails) throw Error('Invalid Channel CAIP!');

    const uuid = getUUID();
    const chainId = parseInt(channelCAIPDetails.networkId, 10);

    const API_BASE_URL = getAPIBaseUrls(env);
    let COMMUNICATOR_CONTRACT = '';
    if (senderType === 0) {
      const { EPNS_COMMUNICATOR_CONTRACT } = getConfig(env, channelCAIPDetails);
      COMMUNICATOR_CONTRACT = EPNS_COMMUNICATOR_CONTRACT;
    }

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
      verifyingContract: COMMUNICATOR_CONTRACT,
      payload: notificationPayload,
      graph,
      ipfsHash,
      uuid,
      // for the pgpv2 verfication proof
      chatId,
      pgpPrivateKey,
    });

    const identity = getPayloadIdentity({
      identityType,
      payload: notificationPayload,
      notificationType: type,
      graph,
      ipfsHash,
    });

    const source = (await checkSimulateNotification({
      channel: options.channel,
      recipient: options.recipients,
      type: options.type,
      env: options.env,
    }))
      ? SOURCE_TYPES.SIMULATE
      : getSource(chainId, identityType, senderType);

    const apiPayload = {
      verificationProof,
      identity,
      sender:
        senderType === 1 && !isValidCAIP10NFTAddress(_channelAddress)
          ? `${channelCAIPDetails?.blockchain}:${channelCAIPDetails?.address}`
          : _channelAddress,
      source,
      /** note this recipient key has a different expectation from the BE API, see the funciton for more */
      recipient: await getRecipientFieldForAPIPayload({
        env,
        notificationType: type,
        recipients: recipients || '',
        channel: _channelAddress,
      }),
    };

    const requestURL = `${API_BASE_URL}/v1/payloads/`;
    return await axiosPost(requestURL, apiPayload, {
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
