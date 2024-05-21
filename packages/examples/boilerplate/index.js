import { CONSTANTS, PushAPI } from '@pushprotocol/restapi';
import { ethers } from 'ethers';

// Creating a random signer from a wallet, ideally this is the wallet you will connect
const signerAlice = ethers.Wallet.createRandom();

// Initialize wallet user, pass 'prod' instead of 'staging' for mainnet apps
const userAlice = await PushAPI.initialize(signerAlice, {
  env: CONSTANTS.ENV.PROD,
});
const userBobAddress = '0x0149C2723496fEF62e6e7fa79A31E5ea22bA70C7';

const generateRandomWordsWithTimestamp = () => {
  return `${Math.random()
    .toString(36)
    .substring(2)} - ${new Date().toISOString()}`;
};

userAlice.chat.send(userBobAddress, {
  type: 'Reaction',
  content: '👍',
  reference: 'bafyreia2okco5ocdxmoxon72erviypaht74u3dqunf3vydu237ybju4kw4',
});

console.log('Message sent from Alice to ', userBobAddress);
// const groupPermissions = await userAlice.chat.group.info(
//   'a7d0581affdaea7b80be836ea5f8a982c0dfd56fb30ee2b01c64980afb152af7'
// );
// console.log('info', groupPermissions);
