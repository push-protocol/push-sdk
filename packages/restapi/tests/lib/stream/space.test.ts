import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import { expect } from 'chai'; // Assuming you're using chai for assertions
import { ethers } from 'ethers';
import { PushAPI } from '../../../src/lib/pushapi/PushAPI';
import CONSTANTS from '../../../src/lib/constantsV2';

import * as util from 'util';
import { PushStream } from '../../../src/lib/pushstream/PushStream';

describe('PushStream.initialize functionality', () => {
  it('Should initialize new stream and listen to events', async () => {
    const spaceDescription = 'Hey There!!!';
    const spaceImage =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==';
    const provider = ethers.getDefaultProvider();

    const WALLET = ethers.Wallet.createRandom();
    const signer = new ethers.Wallet(WALLET.privateKey, provider);

    const userAlice = await PushAPI.initialize(signer, {
      env: CONSTANTS.ENV.LOCAL,
    });

    const WALLET2 = ethers.Wallet.createRandom();
    const signer2 = new ethers.Wallet(WALLET2.privateKey);
    const account2 = `eip155:${signer2.address}`;
    const userBob = await PushAPI.initialize(signer2, {
      env: CONSTANTS.ENV.LOCAL,
    });

    const userAliceStream = await userAlice.initStream(
      [
        CONSTANTS.STREAM.CHAT,
        CONSTANTS.STREAM.CHAT_OPS,
        CONSTANTS.STREAM.SPACE,
        CONSTANTS.STREAM.SPACE_OPS,
        CONSTANTS.STREAM.NOTIF,
        CONSTANTS.STREAM.CONNECT,
        CONSTANTS.STREAM.DISCONNECT,
      ],
      { raw: true }
    );

    userAliceStream.on(CONSTANTS.STREAM.CONNECT, () => {
      console.log('Stream Connected');
    });

    await userAliceStream.connect();

    userAliceStream.on(CONSTANTS.STREAM.DISCONNECT, () => {
      console.log('Stream Disconnected');
    });

    const CREATE_GROUP_REQUEST_2 = {
      description: spaceDescription,
      image: spaceImage,
      participants: { listeners: [], speakers: [] },
      schedule: {
        start: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      },
      private: false,
    };

    const createdSpace = await userAlice.space.create(
      'test',
      CREATE_GROUP_REQUEST_2
    );

    /*const updatedGroup = await userAlice.space.update(createdSpace.spaceId, {
      name: 'Updated Test Grp',
      description: 'Updated Test Grp Description',
      meta: 'Updated Meta',
    });

    //await userBob.space.join(updatedGroup.spaceId);
    //await userBob.space.leave(updatedGroup.spaceId);*/

    const createEventPromise = (
      expectedEvent: string,
      eventType: string,
      expectedEventCount: number,
      stream: PushStream
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
              util.inspect(data, {
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

    const onDataReceived = createEventPromise(
      CONSTANTS.STREAM.SPACE_OPS,
      CONSTANTS.STREAM.SPACE_OPS,
      2,
      userAliceStream
    );

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
        Promise.allSettled([onDataReceived]),
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
