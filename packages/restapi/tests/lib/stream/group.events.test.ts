import { ethers } from 'ethers';
import { PushAPI } from '../../../src/lib/pushapi/PushAPI';
import CONSTANTS from '../../../src/lib/constantsV2';
import { PushStream } from '../../../src/lib/pushstream/PushStream';

describe('Push Chat Group Events functionality', () => {

  // accessing env dynamically using process.env
  type EnvStrings = keyof typeof CONSTANTS.ENV;
  const envMode = process.env.ENV as EnvStrings;
  const _env = CONSTANTS.ENV[envMode];

  let userAlice: PushAPI;
  let userBob: PushAPI;
  let userbobAddress: string;
  let userKateAddress: string;
  let stream: PushStream;
  let group: any;

  before(async () => {
    const WALLET = ethers.Wallet.createRandom();
    const signer = new ethers.Wallet(WALLET.privateKey);
    userAlice = await PushAPI.initialize(signer, {
      env: _env,
    });

    const WALLET2 = ethers.Wallet.createRandom();
    userbobAddress = WALLET2.address;
    const signer2 = new ethers.Wallet(WALLET2.privateKey);
    userBob = await PushAPI.initialize(signer2, {
      env: _env,
    });

    const WALLET3 = ethers.Wallet.createRandom();
    userKateAddress = WALLET3.address;

    // Initialize stream to listen for events:
    stream = await userAlice.initStream(
      [
        CONSTANTS.STREAM.CHAT, // Listen for chat messages
        CONSTANTS.STREAM.NOTIF, // Listen for notifications
        CONSTANTS.STREAM.CONNECT, // Listen for connection events
        CONSTANTS.STREAM.DISCONNECT, // Listen for disconnection events
      ],
      {
        // Connection options:
        connection: {
          retries: 3, // Retry connection 3 times if it fails
        },
        raw: false, // Receive events in structured format
      }
    );

    // Chat event listeners:
    // Stream connection established:
    stream.on(CONSTANTS.STREAM.CONNECT, async (a) => {
      console.log('Stream Connected');
    });

    // Chat message received:
    stream.on(CONSTANTS.STREAM.CHAT, (message) => {
      console.log(message); // Log the message payload
    });

    // Chat operation received:
    stream.on(CONSTANTS.STREAM.CHAT_OPS, (data) => {
      console.log(data); // Log the chat operation data
    });

    // Stream disconnection:
    stream.on(CONSTANTS.STREAM.DISCONNECT, () => {
      console.log('Stream Disconnected');
    });

    await stream.connect();

    group = await userAlice.chat.group.create('Test Grp', {
      description: 'Test Desc',
      image: 'Test Image',
      members: [],
      admins: [],
      private: false,
    });
  });

  after(async () => {
    stream.disconnect();
  });

  it('Should emit JoinGroup event', async () => {
    await userBob.chat.group.join(group.chatId);
    // Add a delay to allow the event to be emitted
    await new Promise((resolve) => setTimeout(resolve, 3000));
  });

  it('Should emit ModifyRole event', async () => {
    await userAlice.chat.group.modify(group.chatId, {
      role: 'ADMIN',
      accounts: [userbobAddress],
    });
    // Add a delay to allow the event to be emitted
    await new Promise((resolve) => setTimeout(resolve, 3000));

    await userAlice.chat.group.modify(group.chatId, {
      role: 'MEMBER',
      accounts: [userbobAddress],
    });
    // Add a delay to allow the event to be emitted
    await new Promise((resolve) => setTimeout(resolve, 3000));
  });

  it('Should emit LeaveGroup event', async () => {
    await userBob.chat.group.leave(group.chatId);
    // Add a delay to allow the event to be emitted
    await new Promise((resolve) => setTimeout(resolve, 3000));
  });
});
