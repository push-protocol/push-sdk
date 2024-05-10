import { CONSTANTS, PushAPI } from '@pushprotocol/restapi';
import { ethers } from 'ethers';

// Creating a random signer from a wallet, ideally this is the wallet you will connect
const signerAlice = ethers.Wallet.createRandom();

// Initialize wallet user, pass 'prod' instead of 'staging' for mainnet apps
const userAlice = await PushAPI.initialize(signerAlice, {
  env: CONSTANTS.ENV.PROD,
});

const subscribe = await userAlice.notification.subscribe(
  '0xB88460Bb2696CAb9D66013A05dFF29a28330689D'
);
console.log(subscribe);

// const groupchatid =
//   '076b41e6820af9e859cc6c5cc22e350ce329fa1830623c993c544614050cf83b';

// console.log('fetching chat history with group chat id');
// let reference = null;
// let aliceChatHistory = await userAlice.chat.history(groupchatid, {
//   reference: reference,
//   limit: 30,
// });

// // get last item in the chat history
// console.log(aliceChatHistory);

// console.log('Last item reference');
// console.log(aliceChatHistory[aliceChatHistory.length - 1].link);
// reference = aliceChatHistory[aliceChatHistory.length - 1].link;

// while (reference) {
//   console.log('Fetching from reference', reference);
//   aliceChatHistory = await userAlice.chat.history(groupchatid, {
//     reference: reference,
//   });

//   // get last item in the chat history
//   console.log(aliceChatHistory);

//   console.log('Last item reference');
//   console.log(aliceChatHistory[aliceChatHistory.length - 1].link);
//   reference = aliceChatHistory[aliceChatHistory.length - 1].link;
// }

// console.log('Chat history fetched');
