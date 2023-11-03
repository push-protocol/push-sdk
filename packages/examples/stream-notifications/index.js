import { PushAPI } from '@pushprotocol/restapi';
// import { STREAM } from '@pushprotocol/restapi/src/lib/pushstream/pushStreamTypes';

import { ethers } from 'ethers';

import input from 'input';

// Since notification requires channel
// we need private key of a channel in staging
// else we will need testnet ETH in a wallet to create channel
let pk = await input.text('Enter private key of your channel on staging, learn more: https://push.org/docs/notifications -');
if (pk.substr(0, 2) !== '0x') {
  pk = '0x' + pk;
}

// Loading signer from private key, ideally this is the wallet you will connect
const signer = new ethers.Wallet(pk);

// Print wallet address
console.log('Sending notification from Wallet address: ', signer.address);

// Initialize wallet user, pass 'prod' instead of 'staging' for mainnet apps
const userAlice = await PushAPI.initialize(signer, { env: 'staging' });

// Setup stream
const stream = userAlice.stream({ 
  // stream supports other products as well, such as STREAM.CHAT, STREAM.CHAT_OPS 
  // more info can be found at push.org/docs/chat
  listen: ['STREAM.NOTIF'], 
});

userAlice.stream.on('STREAM.NOTIF', (data) => {
  console.log("Notification received", data);
})

// Sending a test notification
await userAlice.channel.send(['*'], {
  notification: { title: 'GM', body: "It's a me, Mario!!!" },
})

// Print response
console.log("Notification sent");