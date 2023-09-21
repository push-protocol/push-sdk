import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import { PushStream } from '../../../src/lib/pushstream/PushStream';
import { expect } from 'chai'; // Assuming you're using chai for assertions
import { ethers } from 'ethers';
import { PushAPI } from '../../../src/lib/pushapi/PushAPI';
import { ENV, MessageType } from '../../../src/lib/constants';
import { STREAM } from '../../../src/lib/pushstream/pushStreamTypes';

describe.only('PushStream.initialize functionality', () => {
  it('Should initialize new stream and listen to events', async () => {
    const provider = ethers.getDefaultProvider();
    const WALLET = ethers.Wallet.createRandom();
    const signer = new ethers.Wallet(WALLET.privateKey, provider);

    const user = await PushAPI.initialize(signer, {
      env: ENV.LOCAL,
    });
    const stream = await PushStream.initialize(signer.address);

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
            console.log(`Event ${eventCount} for ${expectedEvent}:`, data);
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

    const onDataReceived = createEventPromise('CHAT_OPS', STREAM.CHAT_OPS, 2);
    const onMessageReceived = createEventPromise('CHAT', STREAM.CHAT, 1);

    // Create and update group
    const createdGroup = await user.chat.group.create('test', {
      description: 'test',
      image: 'test',
      members: [],
      admins: [],
      private: false,
    });

    const updatedGroup = await user.chat.group.update(createdGroup.chatId, {
      description: 'Updated Description',
    });

    const response = await user.chat.send(createdGroup.chatId, {
      content: 'Hello',
      type: MessageType.TEXT,
    });

    // Timeout promise
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout after 10 seconds')), 10000);
    });

    // Wait for either one of the events to be emitted or for the timeout
    try {
      const data = await Promise.race([
        onDataReceived,
        onMessageReceived,
        timeout,
      ]);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  });
});
