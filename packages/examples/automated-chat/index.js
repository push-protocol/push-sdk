import { CONSTANTS, PushAPI } from '@pushprotocol/restapi';
import { ethers } from 'ethers';

// Creating a random signer from a wallet, ideally this is the wallet you will connect
const signer = ethers.Wallet.createRandom();

// Initialize wallet user, pass 'prod' instead of 'staging' for mainnet apps
const userAlice = await PushAPI.initialize(signer, { env: CONSTANTS.ENV.PROD });

// This will be the wallet address of the recipient
const pushAIWalletAddress = '0x99A08ac6254dcf7ccc37CeC662aeba8eFA666666';

// Listen for stream
// Checkout all chat stream listen options - https://push.org/docs/chat/build/stream-chats/
// Alternatively, just initialize userAlice.stream.initialize() without any listen options to listen to all events
const stream = await userAlice.stream({
  listen: [
    CONSTANTS.STREAM.CHAT,
    CONSTANTS.STREAM.CONNECT,
    CONSTANTS.STREAM.DISCONNECT,
  ],
  options: {},
});

stream.on(CONSTANTS.STREAM.CONNECT, () => {
  console.log('Stream Connected');

  // Send a message to Bob after socket connection so that messages as an example
  console.log('Sending message to PushAI Bot');
  userAlice.chat.send(pushAIWalletAddress, {
    content: "Gm gm! It's a me... Mario",
  });
});

stream.on(CONSTANTS.STREAM.DISCONNECT, () => {
  console.log('Stream Disconnected');
});

// React to message payload getting recieved
stream.on(CONSTANTS.STREAM.CHAT, (message) => {
  console.log('Encrypted Message Received');
  console.log(message);

  stream.disconnect();
});
