import { CONSTANTS, PushAPI } from '@pushprotocol/restapi';
import { ethers } from 'ethers';
import input from 'input';

// Since notification requires channel
// we need private key of a channel in staging
// else we will need testnet ETH in a wallet to create channel
console.warn("This demo requires a channel on staging, you can create one here: https://push.org/docs/notifications");
console.warn("Alternatively just leave the input empty and we will simulate a notification! (Note: this option will throw few warnings)");
let pk = await input.text('Enter private key of your channel on staging, learn more: https://push.org/docs/notifications -');
if (pk.length > 0 && pk.substr(0, 2) !== '0x') {
  pk = '0x' + pk;
}

// Loading signer from private key, ideally this is the wallet you will connect
const signer = pk.length > 0 ? new ethers.Wallet(pk) : ethers.Wallet.createRandom();

// Print wallet address
console.debug('Sending notification from Wallet address: ', signer.address);

// Initialize wallet user, pass 'prod' instead of 'staging' for mainnet apps
const userAlice = await PushAPI.initialize(signer, { env: CONSTANTS.ENV.STAGING });

// IMPORTANT: Setup stream events before stream.connect()
const stream = await userAlice.initStream([
  CONSTANTS.STREAM.CONNECT,
  CONSTANTS.STREAM.DISCONNECT, 
  CONSTANTS.STREAM.NOTIF
]);

// Setup responder for CONSTANTS.STREAM.CONNECT event
stream.on(CONSTANTS.STREAM.CONNECT, async () => {
  console.debug('Stream Connected');

  // stream connected, send a message
  // Sending a test notification
  console.debug("Sending notification, you should see 'Notification recieved event' in a few moments");

  if (pk.length > 0) {
    // Send broadcast to all opted in users
    await userAlice.channel.send(['*'], {
      notification: { title: 'GM', body: "It's a me, Mario!!!" },
    });
  } else {
    // Send targeted notification to own wallet, creating a simulated notification
    await userAlice.channel.send([signer.address], {
      notification: { title: 'GM', body: "It's targeted, simulated notification" },
    });
  }
});

// Setup responder for CONSTANTS.STREAM.DISCONNECT event
stream.on(CONSTANTS.STREAM.DISCONNECT, () => {
  console.debug('Stream Disconnected');
});

// Setup responder for CONSTANTS.STREAM.NOTIF event
stream.on(CONSTANTS.STREAM.NOTIF, (notificaiton) => {
  console.debug("Notification received", notificaiton);
});

// Connect stream
stream.connect();