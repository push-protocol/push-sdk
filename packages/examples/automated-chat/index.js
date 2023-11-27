import { CONSTANTS, PushAPI } from '@pushprotocol/restapi';
import { ethers } from 'ethers';

// Creating a random signer from a wallet, ideally this is the wallet you will connect
const signer = ethers.Wallet.createRandom();

// Initialize wallet user, pass 'prod' instead of 'staging' for mainnet apps
const userAlice = await PushAPI.initialize(signer, { env: CONSTANTS.ENV.PROD });

// This will be the wallet address of the recipient
const pushAIWalletAddress = '0x99A08ac6254dcf7ccc37CeC662aeba8eFA666666';

// IMPORTANT: Setup stream events before stream.connect()
// Checkout all chat stream listen options - https://push.org/docs/chat/build/stream-chats/
const stream = await userAlice.initStream(
  [
    CONSTANTS.STREAM.CHAT,
    CONSTANTS.STREAM.CONNECT,
    CONSTANTS.STREAM.DISCONNECT,
  ]
);

// Setup responder for CONSTANTS.STREAM.CONNECT event
stream.on(CONSTANTS.STREAM.CONNECT, () => {
  console.log('Stream Connected');

  // Send a message to Bob after socket connection so that messages as an example
  console.log('Sending message to PushAI Bot');
  userAlice.chat.send(pushAIWalletAddress, {
    content: "Gm gm! It's a me... Mario",
  });
});

// Setup responder for CONSTANTS.STREAM.DISCONNECT event
stream.on(CONSTANTS.STREAM.DISCONNECT, () => {
  console.log('Stream Disconnected');
});

// Setup responder for CONSTANTS.STREAM.CHAT event
// React to message payload getting recieved
stream.on(CONSTANTS.STREAM.CHAT, (message) => {
  console.log('Message Received');
  console.log(message);
  if (message.origin === 'self') {
    console.log("Message sent by your wallet, please wait for few moments for PushAI response");
  }
  if (message.origin === 'other') {
    console.log("Message received by PushAI.eth");
    
    // disconnect stream
    stream.disconnect();
  }
});

// now that response logic for streams are setup
// finally connect stream
await stream.connect();