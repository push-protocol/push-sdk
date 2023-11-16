import { CONSTANTS, PushAPI } from '@pushprotocol/restapi';
import { config } from '../config';
import { ethers } from 'ethers';
import { STREAM } from '@pushprotocol/restapi/src/lib/pushstream/pushStreamTypes';
import { PushStream } from '@pushprotocol/restapi/src/lib/pushstream/PushStream';

// CONFIGS
const { env, showAPIResponse } = config;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const eventlistener = async (
  stream: PushStream,
  eventName: string
): Promise<void> => {
  stream.on(eventName, (data: any) => {
    if (showAPIResponse) {
      console.log('Stream Event Received');
      console.log(data);
      console.log('\n');
    }
  });
};

export const runNotificationClassUseCases = async (): Promise<void> => {
  if (!process.env.WALLET_PRIVATE_KEY) {
    console.log(
      'skipping PushAPI.channel examples, no private key passed in .env'
    );
    return;
  }
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  // Signer Generation
  const provider = new ethers.providers.JsonRpcProvider(
    'https://rpc.sepolia.org' // Goerli Provider
  );
  const signer = new ethers.Wallet(
    `0x${process.env.WALLET_PRIVATE_KEY}`,
    provider
  );
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
    console.log('Stream Connected');
  });

  await stream.connect();

  stream.on(CONSTANTS.STREAM.DISCONNECT, () => {
    console.log('Stream Disconnected');
  });

  // Listen Stream Events for getting websocket events
  console.log(`Listening ${STREAM.NOTIF} Events`);
  eventlistener(stream, STREAM.NOTIF);
  console.log(`Listening ${STREAM.NOTIF_OPS} Events`);
  eventlistener(stream, STREAM.NOTIF_OPS);
  console.log('\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.channel.info');
  const channelInfo = await userAlice.channel.info();
  if (showAPIResponse) {
    console.log(channelInfo);
  }
  console.log('PushAPI.channel.info | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.channel.search');
  const searchedChannels = await userAlice.channel.search(
    'push' // search by name or address
  );
  if (showAPIResponse) {
    console.log(searchedChannels);
  }
  console.log('PushAPI.channel.search | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.channel.subscribers');
  const channelSubscribers = await userAlice.channel.subscribers();
  if (showAPIResponse) {
    console.log(channelSubscribers);
  }
  console.log('PushAPI.channel.subscribers | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.channel.send');
  if (channelInfo) {
    const broadcastNotif = await userAlice.channel.send(['*'], {
      notification: {
        title: 'test',
        body: 'test',
      },
    });
    await delay(3000); // Delay added to log the events in order
    const targetedNotif = await userAlice.channel.send([signer.address], {
      notification: {
        title: 'test',
        body: 'test',
      },
    });
    await delay(3000); // Delay added to log the events in order
    const subsetNotif = await userAlice.channel.send(
      [randomWallet1, randomWallet2, signer.address],
      {
        notification: {
          title: 'test',
          body: 'test',
        },
      }
    );
    await delay(3000); // Delay added to log the events in order
    if (showAPIResponse) {
      console.log(broadcastNotif, targetedNotif, subsetNotif);
    }
    console.log('PushAPI.channel.send | Response - 200 OK\n\n');
  } else {
    console.log(
      'skipping PushAPI.channel.send as no channel exists with the signer\n\n'
    );
  }
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  // These Examples requires wallet to hold some ETH & PUSH
  const balance = await provider.getBalance(signer.address);
  if (parseFloat(ethers.utils.formatEther(balance)) < 0.001) {
    console.log(
      'skipping PushAPI.channel examples, wallet does not have enough balance to pay fee'
    );
  }
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.channel.create');
  if (channelInfo) {
    console.log('skipping PushAPI.channel.create as it already exists\n\n');
  } else {
    const createdChannel = await userAlice.channel.create({
      name: 'Test Channel',
      description: 'Test Description',
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAz0lEQVR4AcXBsU0EQQyG0e+saWJ7oACiKYDMEZVs6GgSpC2BIhzRwAS0sgk9HKn3gpFOAv3v3V4/3+4U4Z1q5KTy42Ql940qvFONnFSGmCFmiN2+fj7uCBlihpgh1ngwcvKfwjuVIWaIGWKNB+GdauSk8uNkJfeNKryzYogZYoZY40m5b/wlQ8wQM8TayMlKeKcaOVkJ71QjJyuGmCFmiDUe+HFy4VyEd57hx0mV+0ZliBlihlgL71w4FyMnVXhnZeSkiu93qheuDDFDzBD7BcCyMAOfy204AAAAAElFTkSuQmCC',
      url: 'https://push.org',
    });
    if (showAPIResponse) {
      console.log(createdChannel);
    }
    console.log('PushAPI.channel.create | Response - 200 OK\n\n');
  }
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.channel.update');
  const updatedChannel = await userAlice.channel.update({
    name: 'Updated Name',
    description: 'Testing new description',
    url: 'https://google.com',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAz0lEQVR4AcXBsU0EQQyG0e+saWJ7oACiKYDMEZVs6GgSpC2BIhzRwAS0sgk9HKn3gpFOAv3v3V4/3+4U4Z1q5KTy42Ql940qvFONnFSGmCFmiN2+fj7uCBlihpgh1ngwcvKfwjuVIWaIGWKNB+GdauSk8uNkJfeNKryzYogZYoZY40m5b/wlQ8wQM8TayMlKeKcaOVkJ71QjJyuGmCFmiDUe+HFy4VyEd57hx0mV+0ZliBlihlgL71w4FyMnVXhnZeSkiu93qheuDDFDzBD7BcCyMAOfy204AAAAAElFTkSuQmCC',
  });
  if (showAPIResponse) {
    console.log(updatedChannel);
  }
  console.log('PushAPI.channel.update | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.channel.verify');
  // only verified channels can verify other channels (otherwise this action is skipped by sdk)
  if (channelInfo.verified_status) {
    const verifiedTrx = await userAlice.channel.verify(
      '0x35B84d6848D16415177c64D64504663b998A6ab4'
    );
    if (showAPIResponse) {
      console.log(verifiedTrx);
    }
  }
  console.log('PushAPI.channel.verify | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.channel.setting');
  const channelSettingTrx = await userAlice.channel.setting([
    { type: 0, default: 1, description: 'My Notif Settings' },
  ]);
  if (showAPIResponse) {
    console.log(channelSettingTrx);
  }
  console.log('PushAPI.channel.setting | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.channel.delegate.add');
  const addedDelegate = await userAlice.channel.delegate.add(
    `eip155:11155111:${randomWallet1}`
  );

  if (showAPIResponse) {
    console.log(addedDelegate);
  }
  console.log('PushAPI.channel.delegate.add | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.channel.delegate.get');
  const delegates = await userAlice.channel.delegate.get();
  if (showAPIResponse) {
    console.log(delegates);
  }
  console.log('PushAPI.channel.delegate.get | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.channel.delegate.remove');
  const removedDelegate = await userAlice.channel.delegate.remove(
    `eip155:11155111:${randomWallet1}`
  );
  if (showAPIResponse) {
    console.log(removedDelegate);
  }
  console.log('PushAPI.channel.delegate.remove | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.channel.alias.info');
  const aliasInfo = await userAlice.channel.alias.info({
    alias: '0x35B84d6848D16415177c64D64504663b998A6ab4',
    aliasChain: 'POLYGON',
  });
  if (showAPIResponse) {
    console.log(aliasInfo);
  }
  console.log('PushAPI.channel.alias.info | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.notification.list');
  const inboxNotifications = await userAlice.notification.list('INBOX');
  const spamNotifications = await userAlice.notification.list('SPAM');
  if (showAPIResponse) {
    console.log(inboxNotifications, spamNotifications);
  }
  console.log('PushAPI.notification.list | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.notification.subscribe');
  const subscribeResponse = await userAlice.notification.subscribe(
    'eip155:11155111:0xD8634C39BBFd4033c0d3289C4515275102423681' // channel to subscribe
  );
  if (showAPIResponse) {
    console.log(subscribeResponse);
  }
  console.log('PushAPI.notification.subscribe | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.notification.subscriptions');
  const aliceSubscriptions = await userAlice.notification.subscriptions();
  if (showAPIResponse) {
    console.log(aliceSubscriptions);
  }
  console.log('PushAPI.notification.subscriptions | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  console.log('PushAPI.notification.unsubscribe');
  const unsubscribeResponse = await userAlice.notification.unsubscribe(
    'eip155:11155111:0xD8634C39BBFd4033c0d3289C4515275102423681' // channel to unsubscribe
  );
  if (showAPIResponse) {
    console.log(unsubscribeResponse);
  }
  console.log('PushAPI.notification.unsubscribe | Response - 200 OK\n\n');
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
};
