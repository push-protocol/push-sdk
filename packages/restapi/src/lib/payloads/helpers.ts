import { v4 as uuidv4 } from 'uuid';
import { getCAIPAddress } from '../helpers';

import { ISendNotificationInputOptions, INotificationPayload } from '../types';
import {
  IDENTITY_TYPE,
  NOTIFICATION_TYPE,
  CHAIN_ID_TO_SOURCE,
  SOURCE_TYPES
} from './constants';

export function getUUID() {
  return uuidv4();
}


/**
 * This function will map the Input options passed to the SDK to the "payload" structure
 * needed by the API input
 * 
 * We need notificationPayload only for identityType
 *  - DIRECT_PAYLOAD
 *  - MINIMAL
 */
export function getPayloadForAPIInput(
  inputOptions: ISendNotificationInputOptions,
  recipients: any
) : INotificationPayload | null {

  if (inputOptions?.notification && inputOptions?.payload) {
    return {
      notification: {
        title: inputOptions?.notification?.title,
        body: inputOptions?.notification?.body
      },
      data: {
        acta: inputOptions?.payload?.cta || '',
        aimg: inputOptions?.payload?.img || '',
        amsg: inputOptions?.payload?.body || '',
        asub: inputOptions?.payload?.title || '',
        type: inputOptions?.type?.toString() || '',
        ...(inputOptions?.expiry && { etime: inputOptions?.expiry }),
        ...(inputOptions?.hidden && { hidden: inputOptions?.hidden }),
        ...(inputOptions?.payload?.sectype && { sectype: inputOptions?.payload?.sectype }),
        ...(inputOptions?.payload?.metadata && { metadata: inputOptions?.payload?.metadata }),
      },
      recipients: recipients
    };
  }

  return null;
}

/**
 * This function returns the recipient format accepted by the API for different notification types
 */
export async function getRecipients({
  env,
  notificationType,
  channel,
  recipients,
  secretType
} : {
  env: string,
  notificationType: number,
  channel: string,
  recipients?: string | string[],
  secretType?: string,
}) {
  let addressInCAIP = '';

  if (secretType) {
    let secret = '';
    // return '';
    /**
     * Currently SECRET FLOW is yet to be finalized on the backend, so will revisit this later.
     * But in secret flow we basically generate secret for the address
     * and send it in { 0xtarget: secret_generated_for_0xtarget } format for all
     */
     if (notificationType === NOTIFICATION_TYPE.TARGETTED) {
      if (typeof recipients === 'string') {
        addressInCAIP = getCAIPAddress(env, recipients, 'Recipient');
        secret = ''; // do secret stuff // TODO

        return {
          [addressInCAIP]: secret
        };
      }
    } else if (notificationType === NOTIFICATION_TYPE.SUBSET) {
      if (Array.isArray(recipients)) {
        const recipientObject =  recipients.reduce((_recipients, _rAddress) => {
          addressInCAIP = getCAIPAddress(env, _rAddress, 'Recipient');
          secret = ''; // do secret stuff // TODO

          return {
            ..._recipients,
            [addressInCAIP]: secret
          };
        }, {});

        return recipientObject;
      }
    }


  } else {
  /**
   * NON-SECRET FLOW
   */

    if (notificationType === NOTIFICATION_TYPE.BROADCAST) {
      if (!recipients) {
        // return getCAIPFormat(chainId, channel || '');
        return getCAIPAddress(env, channel, 'Recipient');
      }
    } else if (notificationType === NOTIFICATION_TYPE.TARGETTED) {
      if (typeof recipients === 'string') {
        return getCAIPAddress(env, recipients, 'Recipient');
      }
    } else if (notificationType === NOTIFICATION_TYPE.SUBSET) {
      if (Array.isArray(recipients)) {
        const recipientObject = recipients.reduce((_recipients, _rAddress) => {
          addressInCAIP = getCAIPAddress(env, _rAddress, 'Recipient');
          return {
            ..._recipients,
            [addressInCAIP]: null
          };
        }, {});
        return recipientObject;
      }
    }
  }
  return recipients;
}

export function getRecipientFieldForAPIPayload({
  env,
  notificationType,
  recipients,
  channel,
} : {
  env: string,
  notificationType: number,
  recipients: string | string[],
  channel: string
}) {

  if (notificationType === NOTIFICATION_TYPE.TARGETTED && typeof recipients === 'string') {
    return getCAIPAddress(env, recipients, 'Recipient')
  }

  return getCAIPAddress(env, channel, 'Recipient')
}

export async function getVerificationProof({
  signer,
  chainId,
  notificationType,
  identityType,
  verifyingContract,
  payload,
  ipfsHash,
  graph = {},
  uuid
}: {
  signer: any,
  chainId: number,
  notificationType: number,
  identityType: number,
  verifyingContract: string,
  payload: any,
  ipfsHash?: string,
  graph?: any,
  uuid: string
}) {

  // console.log('payload ---> \n\n', payload);
  
  const type = {
    Data: [{ name: 'data', type: 'string' }]
  };
  const domain = {
    name: 'EPNS COMM V1',
    chainId: chainId,
    verifyingContract: verifyingContract,
  };
  
  let message = null;
  let signature = null;

  if (identityType === IDENTITY_TYPE.MINIMAL) {
    message = {
      data: `${identityType}+${notificationType}+${payload.notification.title}+${payload.notification.body}`,
    };
    signature = await signer._signTypedData(domain, type, message);
    return `eip712v2:${signature}::uid::${uuid}`;
  } else if (identityType === IDENTITY_TYPE.IPFS) {
    message = {
      data: `1+${ipfsHash}`,
    };
    signature = await signer._signTypedData(domain, type, message);
    return `eip712v2:${signature}::uid::${uuid}`;
  } else if (identityType === IDENTITY_TYPE.DIRECT_PAYLOAD) {
    const payloadJSON = JSON.stringify(payload);
    message = {
      data: `2+${payloadJSON}`,
    };
    signature = await signer._signTypedData(domain, type, message);
    return `eip712v2:${signature}::uid::${uuid}`;
  } else if (identityType === IDENTITY_TYPE.SUBGRAPH) {
    message = {
      data: `3+graph:${graph?.id}+${graph?.counter}`,
    };
    signature = await signer._signTypedData(domain, type, message);
    return `eip712v2:${signature}::uid::${uuid}`;
  }

  return signature;
}

export function getPayloadIdentity({
  identityType,
  payload,
  notificationType,
  ipfsHash,
  graph = {},
} : {
  identityType: number,
  payload: any,
  notificationType?: number,
  ipfsHash?: string,
  graph?: any,
}) {
  if (identityType === IDENTITY_TYPE.MINIMAL) {
    return `0+${notificationType}+${payload.notification.title}+${payload.notification.body}`;
  } else if (identityType === IDENTITY_TYPE.IPFS) {
    return `1+${ipfsHash}`;
  } else if (identityType === IDENTITY_TYPE.DIRECT_PAYLOAD) {
    const payloadJSON = JSON.stringify(payload);
    return `2+${payloadJSON}`;
  } else if (identityType === IDENTITY_TYPE.SUBGRAPH) {
    return `3+graph:${graph?.id}+${graph?.counter}`;
  }

  return null;
}

export function getSource(chainId: number, identityType: number) {
  if (identityType === IDENTITY_TYPE.SUBGRAPH) {
    return SOURCE_TYPES.THE_GRAPH;
  }
  return CHAIN_ID_TO_SOURCE[chainId];
}

export function getCAIPFormat(chainId: number, address: string) {
  // EVM based chains
  if ([1, 5, 42, 137, 80001].includes(chainId)) {
    return `eip155:${chainId}:${address}`;
  }

  return address;
  // TODO: add support for other non-EVM based chains
}