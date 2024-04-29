import { CONSTANTS, PushAPI } from '@pushprotocol/restapi';
import { ethers } from 'ethers';

// Creating a random signer from a wallet, ideally this is the wallet you will connect
const signerAlice = ethers.Wallet.createRandom();

// Initialize wallet user, pass 'prod' instead of 'staging' for mainnet apps
const userAlice = await PushAPI.initialize(signerAlice, { env: CONSTANTS.ENV.PROD });
const userBobAddress = '0x8D4625b4e04d7dE7F158df470a71C5FC4D4d5F4B';

const generateRandomWordsWithTimestamp = () => {
  return `${Math.random().toString(36).substring(2)} - ${new Date().toISOString()}`;
}

userAlice.chat.send(userBobAddress, {
  content: "Gm gm! It's a me... Alice! - " + generateRandomWordsWithTimestamp(),
});

console.log('Message sent from Alice to ', userBobAddress);