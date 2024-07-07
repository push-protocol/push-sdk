import { PushAPI } from '@pushprotocol/dnode';
import { ENV } from '@pushprotocol/dnode/src/lib/constants';

// TODO: Change to dev or stage
const env = ENV.DEV;

export const sendNotification = async (
  title: string,
  body: string,
  recipient: string[],
  signer: any
) => {
  const userAlice = await PushAPI.initialize(signer, { env });
  return await userAlice.channel.send(recipient, {
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

export const getAddressTrx = async (address: string) => {
  const userAlice = await PushAPI.initialize(null, { env, account: address });
  return await userAlice.notification.list('INBOX');
};
