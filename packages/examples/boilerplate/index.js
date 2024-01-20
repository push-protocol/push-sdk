import { CONSTANTS, PushAPI } from '@pushprotocol/restapi';
import { ethers } from 'ethers';
import input from 'input';

console.log("Hello... what's my purpose?")
console.log("To train all the hackers..")

let pk = '0dfb3d814afd8d0bf7a6010e8dd2b6ac835cabe4da9e2c1e80c6a14df3994dd4'
if (pk.length > 0 && pk.substr(0, 2) !== '0x') {
  pk = '0x' + pk;
}

// Loading signer from private key, ideally this is the wallet you will connect
const signer = pk.length > 0 ? new ethers.Wallet(pk) : ethers.Wallet.createRandom();

console.log(signer.address);

// Initialize wallet user, pass 'prod' instead of 'staging' for mainnet apps
const userAlice = await PushAPI.initialize(signer, { env: CONSTANTS.ENV.PROD });

for (let i = 0; i < 50; i++) {
  const message = `Hello World ${i} - ${Math.random().toString(36).slice(-8)}`;

  // send message
  console.log(`Sending message: ${message} - ${i}`);

  await userAlice.channel.send(['*'], {
    notification: { title: `GM - ${i}`, body: message },
    channel: `eip155:1:0x554d29160f779Adf0a4328597cD33Ea1Df4D9Ee9`
  })
}