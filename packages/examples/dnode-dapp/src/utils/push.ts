import { PushAPI } from '@pushprotocol/dnode';
import { ENV } from '@pushprotocol/dnode/src/lib/constants';
import axios from 'axios';
import { getCheckSumAddress } from '.';

const env = ENV.DEV;

export const sendNotification = async (
  title: string,
  body: string,
  recipient: string[],
  signer: any
) => {
  const userAlice = await PushAPI.initialize(signer, { env });
  const parsedRecipients = recipient.map((r) => getCheckSumAddress(r));
  return await userAlice.channel.send(parsedRecipients, {
    notification: {
      title,
      body,
    },
  });
};

export const getChannelInfo = async (signer: any) => {
  const userAlice = await PushAPI.initialize(signer, { env });
  return await userAlice.channel.info();
};

export const getAddressTrx = async (address: string, afterEpoch?: number) => {
  const userAlice = await PushAPI.initialize(null, { env, account: address });
  return await userAlice.notification.list('INBOX', {
    afterEpoch,
  });
};

export const getRecentTransactionAccounts = async () => {
  // Example with no additional data or headers
  return await axios
    .post('https://s1.dev.push.org/api/v1/kv/ns/all')
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('Error:', error);
      return [];
    });
};
