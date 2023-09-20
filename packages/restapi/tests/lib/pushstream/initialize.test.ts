import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import { PushStream } from '../../../src/lib/pushstream/PushStream';
import { EVENTS } from '@pushprotocol/socket';
import { expect } from 'chai'; // Assuming you're using chai for assertions
import { ethers } from 'ethers';
import { PushAPI } from '../../../src/lib/pushapi/PushAPI';
import { ENV } from '../../../src/lib/constants';

describe.only('PushStream.initialize functionality', () => {
  let signer;
  it('Should initialize new stream and listen to events', async () => {
    const provider = ethers.getDefaultProvider();
    const WALLET = ethers.Wallet.createRandom();
    signer = new ethers.Wallet(WALLET.privateKey, provider);

    const user = await PushAPI.initialize(signer, {
      env: ENV.LOCAL,
    });
    const stream = await PushStream.initialize(signer.address);

    const createdGroup = await user.chat.group.create('test', {
      description: 'test',
      image: 'test',
      members: [],
      admins: [],
      private: false,
    });

    // This promise will resolve when the event is emitted
    const onDataReceived = new Promise((resolve, reject) => {
      stream.on(EVENTS.CHAT_GROUPS, (data) => {
        // You can put some assertions here if you want to check the data

        console.log("Hello Aman")

        expect(data).to.not.be.null; // Just an example
        resolve(data); // Resolve the promise with received data
      });
    });

    // This is just a timeout in case the event isn't emitted within 5 seconds
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout after 5 seconds')), 5000);
    });

    // Wait for either the event to be emitted or for the timeout
    try {
      const data = await Promise.race([onDataReceived, timeout]);
      console.log(data); // Logs the data from the emitted event
    } catch (error) {
      console.error(error);
    }
  });
});
