console.log("Hello World");

import * as PushAPI from '@pushprotocol/restapi';
import { createSocketConnection, EVENTS } from '@pushprotocol/socket';
import { ethers } from 'ethers';

// Creating a random signer from a wallet, ideally this is the wallet you will connect
const signer = ethers.Wallet.createRandom();

// Initialize wallet user, pass 'prod' instead of 'staging' for mainnet apps
const userAlice = await PushAPI.PushAPI.initialize(signer, { env: 'prod' });

// This will be the wallet address of the recipient 
const pushAIWalletAddress = "0x99A08ac6254dcf7ccc37CeC662aeba8eFA666666";

// Send a message to Bob
console.log("sending message to PushAI Bot");
const aliceMessagesPushAI = await userAlice.chat.send(pushAIWalletAddress, {
  content: "Gm gm! It's a me... Mario"
});

// Create Socket to Listen to incoming messages
const pushSDKSocket = await createSocketConnection({
  user: signer.wallet,
  socketType: 'chat',
  socketOptions: { autoConnect: true, reconnectionAttempts: 3 },
  env: 'prod',
});

pushSDKSocket.on(EVENTS.CONNECT, (message) => {
  console.log("Socket Connected");
});

// React to message payload getting recieved
pushSDKSocket.on(EVENTS.CHAT_RECEIVED_MESSAGE, (message) => {
  console.log(message);
});

pushSDKSocket.on(EVENTS.DISCONNECT, (message) => {
  console.log("Socket Disconnected");
});