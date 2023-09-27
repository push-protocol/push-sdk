import { PushAPI } from '@pushprotocol/restapi';
import { createSocketConnection, EVENTS } from '@pushprotocol/socket';
import { ethers } from 'ethers';

// Creating a random signer from a wallet, ideally this is the wallet you will connect
const signer = ethers.Wallet.createRandom();

// Initialize wallet user, pass 'prod' instead of 'staging' for mainnet apps
const userAlice = await PushAPI.initialize(signer, { env: 'prod' });

// This will be the wallet address of the recipient
const pushAIWalletAddress = '0x99A08ac6254dcf7ccc37CeC662aeba8eFA666666';

// Create Socket to Listen to incoming messages
const pushSDKSocket = await createSocketConnection({
  user: signer.address,
  socketType: 'chat',
  socketOptions: { autoConnect: true, reconnectionAttempts: 3 },
  env: 'prod',
});

pushSDKSocket.on(EVENTS.CONNECT, (message) => {
  console.log('Socket Connected');
  
  // Send a message to Bob after socket connection so that messages as an example
  console.log('Sending message to PushAI Bot');
  const aliceMessagesPushAI = userAlice.chat.send(pushAIWalletAddress, {
    content: "Gm gm! It's a me... Mario",
  });
  
});

// React to message payload getting recieved
pushSDKSocket.on(EVENTS.CHAT_RECEIVED_MESSAGE, (message) => {
  console.log('Encrypted Message Received');
  console.log(message);
  
  pushSDKSocket.disconnect();
});
