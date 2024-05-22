import { CONSTANTS, PushAPI } from '@pushprotocol/restapi';
import { ethers } from 'ethers';

// Creating a random signer from a wallet, ideally this is the wallet you will connect
const signerAlice = ethers.Wallet.createRandom();

// Initialize wallet user, pass 'prod' instead of 'staging' for mainnet apps
const userAlice = await PushAPI.initialize(signerAlice, {
  env: CONSTANTS.ENV.PROD,
});
const userBobAddress = '0x60cD05eb31cc16cC37163D514bEF162406d482e1';

const generateRandomWordsWithTimestamp = () => {
  return `${Math.random()
    .toString(36)
    .substring(2)} - ${new Date().toISOString()}`;
};

userAlice.chat.send(userBobAddress, {
  content: "Gm gm! It's a me... Alice! - " + generateRandomWordsWithTimestamp(),
});

console.log('Message sent from Alice to ', userBobAddress);
