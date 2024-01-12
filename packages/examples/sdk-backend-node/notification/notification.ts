import { CONSTANTS, PushAPI } from '@pushprotocol/restapi';
import { config } from '../config';
import { ethers } from 'ethers';
import { STREAM } from '@pushprotocol/restapi/src/lib/pushstream/pushStreamTypes';
import { PushStream } from '@pushprotocol/restapi/src/lib/pushstream/PushStream';
import { privateKeyToAccount } from 'viem/accounts';
import { createWalletClient, http, formatEther } from 'viem';
import { sepolia } from 'viem/chains';

// CONFIGS
const { env, showAPIResponse } = config;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const eventlistener = async (
  stream: PushStream,
  eventName: string
): Promise<void> => {
  stream.on(eventName, (data: any) => {
    if (showAPIResponse) {
      console.debug('Stream Event Received');
      console.debug(data);
      console.debug('\n');
    }
  });
};

export const runNotificationClassUseCases = async (): Promise<void> => {
  if (!process.env.WALLET_PRIVATE_KEY) {
    console.warn(
      'skipping PushAPI.channel examples, no private key passed in .env'
    );
    return;
  }
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  // Signer Generation

  // ETHERS V5
  // const provider = new ethers.providers.JsonRpcProvider(
  //   'https://rpc.sepolia.org' // Sepolia Provider
  // );
  // const signer = new ethers.Wallet(
  //   `0x${process.env.WALLET_PRIVATE_KEY}`,
  //   provider
  // );
  // const address = signer.address

  // ETHERS V6
  const provider = new ethers.JsonRpcProvider(
    'https://rpc.sepolia.org' // Sepolia Provider
  );
  const signer = new ethers.Wallet(
    `0x${process.env.WALLET_PRIVATE_KEY}`,
    provider
  );
  const address = signer.address;

  // VIEM
  // const signer = createWalletClient({
  //   account: privateKeyToAccount(`0x${process.env.WALLET_PRIVATE_KEY}`),
  //   chain: sepolia,
  //   transport: http(),
  // });
  // const address = signer.account.address;

  const randomWallet1 = ethers.Wallet.createRandom().address;
  const randomWallet2 = ethers.Wallet.createRandom().address;
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  const userAlice = await PushAPI.initialize(signer, { env });

  const stream = await userAlice.initStream(
    [
      CONSTANTS.STREAM.NOTIF,
      CONSTANTS.STREAM.CHAT_OPS,
      CONSTANTS.STREAM.CHAT,
      CONSTANTS.STREAM.CONNECT,
      CONSTANTS.STREAM.DISCONNECT,
    ],
    {
      // stream supports other products as well, such as STREAM.CHAT, STREAM.CHAT_OPS
      // more info can be found at push.org/docs/chat

      filter: {
        channels: ['*'],
        chats: ['*'],
      },
      connection: {
        auto: true, // should connection be automatic, else need to call stream.connect();
        retries: 3, // number of retries in case of error
      },
      raw: true, // enable true to show all data
    }
  );

  stream.on(CONSTANTS.STREAM.CONNECT, (a) => {
    console.debug('Stream Connected');
  });

  await stream.connect();

  stream.on(CONSTANTS.STREAM.DISCONNECT, () => {
    console.debug('Stream Disconnected');
  });

  // Listen Stream Events for getting websocket events
  console.debug(`Listening ${STREAM.NOTIF} Events`);
  eventlistener(stream, STREAM.NOTIF);
  console.debug(`Listening ${STREAM.NOTIF_OPS} Events`);
  eventlistener(stream, STREAM.NOTIF_OPS);
  console.debug('\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.channel.info');
  const channelInfo = await userAlice.channel.info();
  if (showAPIResponse) {
    console.info(channelInfo);
  }
  console.debug('PushAPI.channel.info | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.channel.search');
  const searchedChannels = await userAlice.channel.search(
    'push' // search by name or address
  );
  if (showAPIResponse) {
    console.info(searchedChannels);
  }
  console.debug('PushAPI.channel.search | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.channel.subscribers');
  const channelSubscribers = await userAlice.channel.subscribers({
    limit: 10,
    page: 1,
  });
  if (showAPIResponse) {
    console.info(channelSubscribers);
  }
  console.debug('PushAPI.channel.subscribers | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.channel.send');
  if (channelInfo) {
    const broadcastNotif = await userAlice.channel.send(['*'], {
      notification: {
        title: 'test',
        body: 'test',
      },
    });
    await delay(3000); // Delay added to log the events in order
    const targetedNotif = await userAlice.channel.send([address], {
      notification: {
        title: 'test',
        body: 'test',
      },
    });
    await delay(3000); // Delay added to log the events in order
    const subsetNotif = await userAlice.channel.send(
      [randomWallet1, randomWallet2, address],
      {
        notification: {
          title: 'test',
          body: 'test',
        },
      }
    );
    await delay(3000); // Delay added to log the events in order
    if (showAPIResponse) {
      console.info(broadcastNotif, targetedNotif, subsetNotif);
    }
    console.debug('PushAPI.channel.send | Response - 200 OK\n\n');
  } else {
    console.debug(
      'skipping PushAPI.channel.send as no channel exists with the signer\n\n'
    );
  }
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  // These Examples requires wallet to hold some ETH & PUSH
  const balance = await provider.getBalance(address);
  if (parseFloat(formatEther(balance)) < 0.001) {
    console.warn(
      'skipping PushAPI.channel examples, wallet does not have enough balance to pay fee'
    );
  }
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.channel.create');
  if (channelInfo) {
    console.warn('skipping PushAPI.channel.create as it already exists\n\n');
  } else {
    const createdChannel = await userAlice.channel.create({
      name: 'Test Channel',
      description: 'Test Description',
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAz0lEQVR4AcXBsU0EQQyG0e+saWJ7oACiKYDMEZVs6GgSpC2BIhzRwAS0sgk9HKn3gpFOAv3v3V4/3+4U4Z1q5KTy42Ql940qvFONnFSGmCFmiN2+fj7uCBlihpgh1ngwcvKfwjuVIWaIGWKNB+GdauSk8uNkJfeNKryzYogZYoZY40m5b/wlQ8wQM8TayMlKeKcaOVkJ71QjJyuGmCFmiDUe+HFy4VyEd57hx0mV+0ZliBlihlgL71w4FyMnVXhnZeSkiu93qheuDDFDzBD7BcCyMAOfy204AAAAAElFTkSuQmCC',
      url: 'https://push.org',
    });
    if (showAPIResponse) {
      console.info(createdChannel);
    }
    console.debug('PushAPI.channel.create | Response - 200 OK\n\n');
  }
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.channel.update');
  const updatedChannel = await userAlice.channel.update({
    name: 'Updated Name',
    description: 'Testing new description',
    url: 'https://google.com',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAz0lEQVR4AcXBsU0EQQyG0e+saWJ7oACiKYDMEZVs6GgSpC2BIhzRwAS0sgk9HKn3gpFOAv3v3V4/3+4U4Z1q5KTy42Ql940qvFONnFSGmCFmiN2+fj7uCBlihpgh1ngwcvKfwjuVIWaIGWKNB+GdauSk8uNkJfeNKryzYogZYoZY40m5b/wlQ8wQM8TayMlKeKcaOVkJ71QjJyuGmCFmiDUe+HFy4VyEd57hx0mV+0ZliBlihlgL71w4FyMnVXhnZeSkiu93qheuDDFDzBD7BcCyMAOfy204AAAAAElFTkSuQmCC',
  });
  if (showAPIResponse) {
    console.info(updatedChannel);
  }
  console.debug('PushAPI.channel.update | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.channel.verify');
  // only verified channels can verify other channels (otherwise this action is skipped by sdk)
  if (channelInfo.verified_status) {
    const verifiedTrx = await userAlice.channel.verify(
      '0x35B84d6848D16415177c64D64504663b998A6ab4'
    );
    if (showAPIResponse) {
      console.info(verifiedTrx);
    }
  }
  console.debug('PushAPI.channel.verify | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.channel.setting');
  const channelSettingTrx = await userAlice.channel.setting([
    { type: 0, default: 1, description: 'My Notif Settings' },
  ]);
  if (showAPIResponse) {
    console.info(channelSettingTrx);
  }
  console.debug('PushAPI.channel.setting | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.channel.delegate.add');
  const addedDelegate = await userAlice.channel.delegate.add(
    `eip155:11155111:${randomWallet1}`
  );

  if (showAPIResponse) {
    console.info(addedDelegate);
  }
  console.debug('PushAPI.channel.delegate.add | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.channel.delegate.get');
  const delegates = await userAlice.channel.delegate.get();
  if (showAPIResponse) {
    console.info(delegates);
  }
  console.debug('PushAPI.channel.delegate.get | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.channel.delegate.remove');
  const removedDelegate = await userAlice.channel.delegate.remove(
    `eip155:11155111:${randomWallet1}`
  );
  if (showAPIResponse) {
    console.info(removedDelegate);
  }
  console.debug('PushAPI.channel.delegate.remove | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.channel.alias.info');
  const aliasInfo = await userAlice.channel.alias.info({
    alias: '0x35B84d6848D16415177c64D64504663b998A6ab4',
    aliasChain: 'POLYGON',
  });
  if (showAPIResponse) {
    console.info(aliasInfo);
  }
  console.debug('PushAPI.channel.alias.info | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.notification.list');
  const inboxNotifications = await userAlice.notification.list('INBOX');
  const spamNotifications = await userAlice.notification.list('SPAM');
  if (showAPIResponse) {
    console.info(inboxNotifications, spamNotifications);
  }
  console.debug('PushAPI.notification.list | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.notification.subscribe');
  const subscribeResponse = await userAlice.notification.subscribe(
    'eip155:11155111:0xD8634C39BBFd4033c0d3289C4515275102423681' // channel to subscribe
  );
  if (showAPIResponse) {
    console.info(subscribeResponse);
  }
  console.debug('PushAPI.notification.subscribe | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.notification.subscriptions');
  const aliceSubscriptions = await userAlice.notification.subscriptions();
  if (showAPIResponse) {
    console.info(aliceSubscriptions);
  }
  console.debug('PushAPI.notification.subscriptions | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.debug('PushAPI.notification.unsubscribe');
  const unsubscribeResponse = await userAlice.notification.unsubscribe(
    'eip155:11155111:0xD8634C39BBFd4033c0d3289C4515275102423681' // channel to unsubscribe
  );
  if (showAPIResponse) {
    console.info(unsubscribeResponse);
  }
  console.debug('PushAPI.notification.unsubscribe | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
};
