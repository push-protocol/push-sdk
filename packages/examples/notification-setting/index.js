import { PushAPI } from '@pushprotocol/restapi';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
dotenv.config();

// initialise the provider
const provider = new ethers.providers.JsonRpcProvider(
  // PUBLIC RPC
  process.env?.RPC?? 'https://rpc.sepolia.org'
);

let signer;
if (process.env.PRIVATE_KEY) {
  signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  console.log('Using the wallet from .env: %s', signer.address);
} else {
  signer = ethers.Wallet.createRandom().connect(provider);
  console.log('Fund your wallet with eth and PUSH token: %s', signer.address);
}

// initialise the sdk with the signer and env
// for channel
const userAlice = await PushAPI.initialize(signer, { env: 'staging' });
// for subscribers
const userBob = await PushAPI.initialize(
  ethers.Wallet.createRandom().connect(provider),
  { env: 'staging' }
);


const userKate = await PushAPI.initialize(
  ethers.Wallet.createRandom().connect(provider),
  { env: 'staging' }
);

const main = async () => {
  try {
    // create the channel
    const createChannelRes = await userAlice.channel.create({
      // name of the channel
      name: 'Test 123',
      // channel description
      description: 'Gm gm PUSH fam',
      // url of the channel
      url: 'https://push.org',
      // base64 icon
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAz0lEQVR4AcXBsU0EQQyG0e+saWJ7oACiKYDMEZVs6GgSpC2BIhzRwAS0sgk9HKn3gpFOAv3v3V4/3+4U4Z1q5KTy42Ql940qvFONnFSGmCFmiN2+fj7uCBlihpgh1ngwcvKfwjuVIWaIGWKNB+GdauSk8uNkJfeNKryzYogZYoZY40m5b/wlQ8wQM8TayMlKeKcaOVkJ71QjJyuGmCFmiDUe+HFy4VyEd57hx0mV+0ZliBlihlgL71w4FyMnVXhnZeSkiu93qheuDDFDzBD7BcCyMAOfy204AAAAAElFTkSuQmCC',
    });
    console.log("Channel created with hash: %s", createChannelRes.transactionHash);

    // create settings
    const settingRes = await userAlice.channel.setting([
      {
        type: 1,
        description: 'Setting1',
        default: 1,
      },
      {
        type: 2,
        description: 'Setting2',
        default: 10,
        data: {
          upper: 100,
          lower: 1,
          enabled: true,
          ticker: 5,
        },
      },
    ]);

    console.log(settingRes)

    // fetch channel info with the settings
    const channelInfoWithSetting = await userAlice.channel.info();
    console.log('Channel info with settings');
    console.log(channelInfoWithSetting);

    // make bob and kate subscribe to the channel
    // bob wants to opt in to all the settings
    await userBob.notification.subscribe(
      `eip155:11155111:${userAlice.account}`,
      {
        settings: [
          // enabled for boolean type
          {
            enabled: true,
          },
          {
            // enabled for slider type when value is 10
            enabled: true,
            value: 10,
          },
        ],
      }
    );
    // kate doesnot want to opt in to any settings
    await userKate.notification.subscribe(
      `eip155:11155111:${userAlice.account}`,
      {
        settings: [
          // disabled for boolean type
          {
            enabled: false,
          },
          {
            // disabled for slider type and pass 0 as value
            enabled: false,
            value: 0,
          },
        ],
      }
    );

    // fetch Bob's subscription
    const bobSubscriptions = await userBob.notification.subscriptions();
    console.log("Bob's subcriptions: ");
    console.log(bobSubscriptions);

    // fetch Kate's subscription
    const kateSubscriptions = await userKate.notification.subscriptions();
    console.log("Kate's subcriptions: ");
    console.log(kateSubscriptions);

    // Trigger broadcast for slider type
    const notifResForSlider = await userAlice.channel.send(['*'], {
      notification: {
        title: 'gm gm slider',
        body: 'Sending notification with category 2',
      },
      payload: {
        title: 'testing first notification',
        body: 'testing with random body',
        cta: 'https://google.com/',
        embed: 'https://avatars.githubusercontent.com/u/64157541?s=200&v=4',
        // index of the notification the channel wants to trigger, in this for 2nd index which is for Setting2 type
        category: 2,
      },
    });

    // Trigger broadcast for boolean type
    const notifResForBoolean = await userAlice.channel.send(['*'], {
      notification: {
        title: 'gm gm boolean',
        body: 'Sending notification with category 1',
      },
      payload: {
        title: 'testing first notification',
        body: 'testing with random body',
        cta: 'https://google.com/',
        embed: 'https://avatars.githubusercontent.com/u/64157541?s=200&v=4',
        // index of the notification the channel wants to trigger, in this for 1st index which is for Setting12 type
        category: 1,
      },
    });

    // List the inbox of Bob
    const bobList = await userBob.notification.list()
    console.log("Bob's notification list")
    console.log(bobList)

    // List down inbox of Kate
    const kateList = await userKate.notification.list()
    console.log("Kate's notification list")
    console.log(kateList)

  } catch (error) {
    console.log(error);
  }
};

main();
