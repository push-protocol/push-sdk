import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import { expect } from 'chai'; // Assuming you're using chai for assertions
import { ethers } from 'ethers';
import { PushAPI } from '../../../src/lib/pushapi/PushAPI';
import { sendNotification } from '../../../src/lib/payloads/sendNotifications';
import { subscribe, unsubscribe } from '../../../src/lib/channels';
import CONSTANTS from '../../../src/lib/constantsV2';

import * as util from 'util';

describe('PushStream.initialize functionality', () => {
  it('Should initialize new stream and listen to events', async () => {
    const MESSAGE = 'Hey There!!!';

    const provider = ethers.getDefaultProvider();

    const WALLET = ethers.Wallet.createRandom();
    const signer = new ethers.Wallet(WALLET.privateKey, provider);
    const user = await PushAPI.initialize(signer, {
      env: CONSTANTS.ENV.LOCAL,
    });

    const WALLET2 = ethers.Wallet.createRandom();
    const signer2 = new ethers.Wallet(WALLET2.privateKey, provider);
    const user2 = await PushAPI.initialize(signer2, {
      env: CONSTANTS.ENV.LOCAL,
    });

    const WALLET3 = ethers.Wallet.createRandom();
    const signer3 = new ethers.Wallet(WALLET3.privateKey, provider);
    const user3 = await PushAPI.initialize(signer3, {
      env: CONSTANTS.ENV.LOCAL,
    });

    const WALLET4 = ethers.Wallet.createRandom();
    const signer4 = new ethers.Wallet(WALLET4.privateKey, provider);
    const user4 = await PushAPI.initialize(signer4, {
      env: CONSTANTS.ENV.LOCAL,
    });

    const GROUP_RULES = {
      entry: {
        conditions: [
          {
            any: [
              {
                type: CONSTANTS.CHAT.GROUP.RULES.CONDITION_TYPE.PUSH,
                category: CONSTANTS.CHAT.GROUP.RULES.CATEGORY.CUSTOM_ENDPOINT,
                subcategory: CONSTANTS.CHAT.GROUP.RULES.SUBCATEGORY.GET,
                data: {
                  url: 'https://api.ud-staging.com/profile/badges/dead_pixel/validate/{{user_address}}?rule=join',
                },
              },
            ],
          },
        ],
      },
      chat: {
        conditions: [
          {
            any: [
              {
                type: CONSTANTS.CHAT.GROUP.RULES.CONDITION_TYPE.PUSH,
                category: CONSTANTS.CHAT.GROUP.RULES.CATEGORY.CUSTOM_ENDPOINT,
                subcategory: CONSTANTS.CHAT.GROUP.RULES.SUBCATEGORY.GET,
                data: {
                  url: 'https://api.ud-staging.com/profile/badges/dead_pixel/validate/{{user_address}}?rule=chat',
                },
              },
            ],
          },
        ],
      },
    };

    const CREATE_GROUP_REQUEST = {
      description: 'test',
      image: 'test',
      members: [],
      admins: [],
      private: false,
      rules: {
        chat: {
          conditions: {
            any: [
              {
                type: CONSTANTS.CHAT.GROUP.RULES.CONDITION_TYPE.PUSH,
                category: CONSTANTS.CHAT.GROUP.RULES.CATEGORY.ERC20,
                subcategory: CONSTANTS.CHAT.GROUP.RULES.SUBCATEGORY.HOLDER,
                data: {
                  contract:
                    'eip155:1:0xf418588522d5dd018b425E472991E52EBBeEEEEE',
                  amount: 1,
                  decimals: 18,
                },
              },
              {
                type: CONSTANTS.CHAT.GROUP.RULES.CONDITION_TYPE.PUSH,
                category: CONSTANTS.CHAT.GROUP.RULES.CATEGORY.INVITE,
                subcategory: CONSTANTS.CHAT.GROUP.RULES.SUBCATEGORY.DEFAULT,
                data: {
                  inviterRoles: [
                    CONSTANTS.CHAT.GROUP.RULES.INVITER_ROLE.ADMIN,
                    CONSTANTS.CHAT.GROUP.RULES.INVITER_ROLE.OWNER,
                  ],
                },
              },
            ],
          },
        },
      },
    };

    const CREATE_GROUP_REQUEST_2 = {
      description: 'test',
      image: 'test',
      members: [],
      admins: [],
      private: false,
      rules: {},
    };

    /*const stream = await user.stream(
      [CONSTANTS.STREAM.CHAT, CONSTANTS.STREAM.CHAT_OPS],
      {
        // stream supports other products as well, such as STREAM.CHAT, STREAM.CHAT_OPS
        // more info can be found at push.org/docs/chat

        filter: {
          channels: ['*'],
          chats: ['*'],
        },
        connection: {
          auto: false, // should connection be automatic, else need to call stream.connect();
          retries: 3, // number of retries in case of error
        },
        raw: true, // enable true to show all data
      }
    );

    await stream.connect();*/

    // Initialize wallet user, pass 'prod' instead of 'staging' for mainnet apps
    const userAlice = await PushAPI.initialize(signer, {
      env: CONSTANTS.ENV.STAGING,
    });

    // This will be the wallet address of the recipient
    const pushAIWalletAddress = '0x99A08ac6254dcf7ccc37CeC662aeba8eFA666666';

    // Listen for stream
    // Checkout all chat stream listen options - https://push.org/docs/chat/build/stream-chats/
    // Alternatively, just initialize userAlice.stream.initialize() without any listen options to listen to all events
    const stream = await userAlice.initStream(
      [
        CONSTANTS.STREAM.CHAT,
        CONSTANTS.STREAM.NOTIF,
        CONSTANTS.STREAM.CONNECT,
        CONSTANTS.STREAM.DISCONNECT,
      ],
      {}
    );

    stream.on(CONSTANTS.STREAM.CONNECT, (a) => {
      console.log('Stream Connected');

      // Send a message to Bob after socket connection so that messages as an example
      console.log('Sending message to PushAI Bot');
      userAlice.chat.send(pushAIWalletAddress, {
        content: "Gm gm! It's a me... Mario",
      });
    });

    await stream.connect();

    stream.on(CONSTANTS.STREAM.DISCONNECT, () => {
      console.log('Stream Disconnected');
    });

    // React to message payload getting recieved
    stream.on(CONSTANTS.STREAM.CHAT, (message) => {
      console.log('Encrypted Message Received');
      console.log(message);
      stream.disconnect();
    });

    const createEventPromise = (
      expectedEvent: string,
      eventType: string,
      expectedEventCount: number
    ) => {
      return new Promise((resolve, reject) => {
        let eventCount = 0;
        if (expectedEventCount == 0) {
          resolve('Done');
        }
        const receivedEvents: any[] = [];
        stream.on(eventType, (data: any) => {
          try {
            receivedEvents.push(data);
            eventCount++;

            console.log(
              `Event ${eventCount} for ${expectedEvent}:`,
              util.inspect(JSON.stringify(data), {
                showHidden: false,
                depth: null,
                colors: true,
              })
            );
            expect(data).to.not.be.null;

            if (eventCount === expectedEventCount) {
              resolve(receivedEvents);
            }
          } catch (error) {
            console.error('An error occurred:', error);
            reject(error);
          }
        });
      });
    };

    //  leave admin bug
    //  group creator check remove add

    const onDataReceived = createEventPromise(
      'CHAT_OPS',
      CONSTANTS.STREAM.CHAT_OPS,
      5
    );
    const onMessageReceived = createEventPromise(
      'CHAT',
      CONSTANTS.STREAM.CHAT,
      4
    );
    const onNoitificationsReceived = createEventPromise(
      'NOTIF',
      CONSTANTS.STREAM.NOTIF,
      4
    );

    // Create and update group
    const createdGroup = await user.chat.group.create(
      'test',
      CREATE_GROUP_REQUEST_2
    );

    const updatedGroup = await user.chat.group.update(createdGroup.chatId, {
      description: 'Updated Description',
    });

    const updatedGroup2 = await user.chat.group.add(createdGroup.chatId, {
      role: 'ADMIN',
      accounts: [signer2.address, signer3.address, signer4.address],
    });

    const w2wRejectRequest = await user2.chat.group.join(createdGroup.chatId);

    /*const w2wMessageResponse = await user2.chat.send(signer.address, {
      content: MESSAGE,
    });
    const w2wAcceptsRequest = await user.chat.accept(signer2.address);

    const w2wMessageResponse2 = await user2.chat.send(signer.address, {
      content: MESSAGE,
    });*/

    /*const channelPrivateKey = process.env['WALLET_PRIVATE_KEY'];

    const signerChannel = new ethers.Wallet(`0x${channelPrivateKey}`);
    const channelAddress = signerChannel.address;

    console.log(channelAddress);

    const response = await subscribe({
      signer: signer,
      channelAddress: `eip155:5:${channelAddress}`, // channel address in CAIP
      userAddress: `eip155:5:${signer.address}`, // user address in CAIP
      onSuccess: () => {
        console.log('opt in success');
      },
      onError: () => {
        console.error('opt in error');
      },
      env: ENV.LOCAL,
    });


    const apiResponse = await sendNotification({
      signer: signerChannel, // Needs to resolve to channel address
      type: 1, // broadcast
      identityType: 2, // direct payload
      notification: {
        title: `notification TITLE:`,
        body: `notification BODY`,
      },
      payload: {
        title: `payload title`,
        body: `sample msg body`,
        cta: '',
        img: '',
      },
      channel: `eip155:5:${channelAddress}`, // your channel address
      env: ENV.LOCAL,
    });


    const response2 = await unsubscribe({
      signer: signer,
      channelAddress: `eip155:5:${channelAddress}`, // channel address in CAIP
      userAddress: `eip155:5:${signer.address}`, // user address in CAIP
      onSuccess: () => {
        console.log('opt out success');
      },
      onError: () => {
        console.error('opt out error');
      },
      env: ENV.LOCAL,
    });


    const apiResponse2 = await sendNotification({
      signer: signerChannel, // Needs to resolve to channel address
      type: 3, // broadcast
      identityType: 2, // direct payload
      notification: {
        title: `notification TITLE:`,
        body: `notification BODY`,
      },
      payload: {
        title: `payload title`,
        body: `sample msg body`,
        cta: '',
        img: '',
      },
      recipients: `eip155:5:${signer.address}`,
      channel: `eip155:5:${channelAddress}`, // your channel address
      env: ENV.LOCAL,
    });


   
    //const w2wRejectRequest = await user2.chat.group.join(createdGroup.chatId);
    //const updatedGroup2 = await user2.chat.group.leave(createdGroup.chatId);

    /*const updatedGroup3 = await user.chat.group.add(createdGroup.chatId, {
      role: 'ADMIN',
      accounts: [signer2.address],
    });



    const w2wAcceptsRequest = await user2.chat.group.join(createdGroup.chatId);

           /* const updatedGroup4 = await user.chat.group.add(
              createdGroup.chatId,
              {
                role: 'ADMIN',
                accounts: [signer3.address],
              }
            );*/

    /*const w2wMessageResponse = await user2.chat.send(signer.address, {
      content: MESSAGE,
    });
    const w2wAcceptsRequest = await user.chat.accept(signer2.address);

    const w2wMessageResponse2 = await user2.chat.send(signer.address, {
      content: MESSAGE,
    });

    //const w2wRejectRequest = await user2.chat.group.join(createdGroup.chatId);

    /*

    
    const updatedGroup2 = await user2.chat.group.leave(createdGroup.chatId);

  

    const updatedGroup = await user.chat.group.update(createdGroup.chatId, {
      description: 'Updated Description',
    });

    const groupMessageResponse = await user.chat.send(createdGroup.chatId, {
      content: 'Hello',
      type: MessageType.TEXT,
    });

  

    const w2wMessageResponse2 = await user2.chat.send(signer.address, {
         content: MESSAGE,
       });

    const w2wMessageResponse2 = await user3.chat.send(signer.address, {
      content: MESSAGE,
    });
    const w2wRejectRequest = await user.chat.reject(signer3.address);*/

    let timeoutTriggered = false;

    const timeout = new Promise((_, reject) => {
      setTimeout(() => {
        timeoutTriggered = true;
        reject(new Error('Timeout after 5 seconds'));
      }, 5000);
    });

    // Wrap the Promise.allSettled inside a Promise.race with the timeout
    try {
      const result = await Promise.race([
        Promise.allSettled([
          onDataReceived,
          onMessageReceived,
          onNoitificationsReceived,
        ]),
        timeout,
      ]);

      if (timeoutTriggered) {
        console.error('Timeout reached before events were emitted.');
      } else {
        (result as PromiseSettledResult<any>[]).forEach((outcome) => {
          if (outcome.status === 'fulfilled') {
            //console.log(outcome.value);
          } else if (outcome.status === 'rejected') {
            console.error(outcome.reason);
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  });
});
