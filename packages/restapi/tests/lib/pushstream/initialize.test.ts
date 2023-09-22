import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import { PushStream } from '../../../src/lib/pushstream/PushStream';
import { expect } from 'chai'; // Assuming you're using chai for assertions
import { ethers } from 'ethers';
import { PushAPI } from '../../../src/lib/pushapi/PushAPI';
import { ENV } from '../../../src/lib/constants';
import { STREAM } from '../../../src/lib/pushstream/pushStreamTypes';

describe.only('PushStream.initialize functionality', () => {
  it('Should initialize new stream and listen to events', async () => {
    const MESSAGE = 'Hey There!!!';

    const provider = ethers.getDefaultProvider();

    const WALLET = ethers.Wallet.createRandom();
    const signer = new ethers.Wallet(WALLET.privateKey, provider);
    const user = await PushAPI.initialize(signer, {
      env: ENV.LOCAL,
    });

    const WALLET2 = ethers.Wallet.createRandom();
    const signer2 = new ethers.Wallet(WALLET2.privateKey, provider);
    const user2 = await PushAPI.initialize(signer2, {
      env: ENV.LOCAL,
    });

    const WALLET3 = ethers.Wallet.createRandom();
    const signer3 = new ethers.Wallet(WALLET3.privateKey, provider);
    const user3 = await PushAPI.initialize(signer3, {
      env: ENV.LOCAL,
    });

    const WALLET4 = ethers.Wallet.createRandom();
    const signer4 = new ethers.Wallet(WALLET4.privateKey, provider);
    const user4 = await PushAPI.initialize(signer4, {
      env: ENV.LOCAL,
    });

    const GROUP_RULES = {
      entry: {
        conditions: [
          {
            any: [
              {
                type: 'PUSH',
                category: 'CustomEndpoint',
                subcategory: 'GET',
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
                type: 'PUSH',
                category: 'CustomEndpoint',
                subcategory: 'GET',
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
      members: [signer2.address],
      admins: [],
      private: false,
      rules: {},
    };

    const stream = await PushStream.initialize(signer.address, { raw: true });

    const createEventPromise = (
      expectedEvent: string,
      eventType: string,
      expectedEventCount: number
    ) => {
      return new Promise((resolve, reject) => {
        let eventCount = 0;
        const receivedEvents: any[] = [];
        stream.on(eventType, (data: any) => {
          try {
            receivedEvents.push(data);
            eventCount++;

            /*console.log(
              `Event ${eventCount} for ${expectedEvent}:`,
              util.inspect(data, {
                showHidden: false,
                depth: null,
                colors: true,
              })
            );*/
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

    const onDataReceived = createEventPromise('CHAT_OPS', STREAM.CHAT_OPS, 1);
    const onMessageReceived = createEventPromise('CHAT', STREAM.CHAT, 1);

    // Create and update group
    const createdGroup = await user.chat.group.create(
      'test',
      CREATE_GROUP_REQUEST
    );

    const w2wRejectRequest = await user2.chat.group.join(createdGroup.chatId);

    console.log(w2wRejectRequest);

    /*const updatedGroup = await user.chat.group.update(createdGroup.chatId, {
      description: 'Updated Description',
    });

    const groupMessageResponse = await user.chat.send(createdGroup.chatId, {
      content: 'Hello',
      type: MessageType.TEXT,
    });

    const w2wMessageResponse = await user2.chat.send(signer.address, {
      content: MESSAGE,
    });
    const w2wAcceptsRequest = await user.chat.accept(signer2.address);

    const w2wMessageResponse2 = await user2.chat.send(signer.address, {
         content: MESSAGE,
       });

    const w2wMessageResponse2 = await user3.chat.send(signer.address, {
      content: MESSAGE,
    });
    const w2wRejectRequest = await user.chat.reject(signer3.address);*/

    // Timeout promise
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout after 5 seconds')), 5);
    });

    // Wait for either one of the events to be emitted or for the timeout
    try {
      const results = await Promise.allSettled([
        onDataReceived,
        onMessageReceived,
        timeout,
      ]);

      results.forEach((result) => {
        if (result.status === 'rejected') {
          console.error(result.reason);
        } else {
          // Handle result.value if necessary
          console.log(result.value);
        }
      });
    } catch (error) {
      console.error(error);
    }
  });
});
