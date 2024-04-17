import { CONSTANTS, PushAPI } from '@pushprotocol/restapi';
import { ethers } from 'ethers';
import input from 'input';

console.log("Hello... what's my purpose?")
console.log("To train all the hackers..")

// Create read only user
const readOnlyAccount = await PushAPI.initialize(null, { 
  account: '0x0000000000000000000000000000000000000001',
  env: CONSTANTS.ENV.PROD 
});

// get chat info
const recipient = 'eip155:0x99A08ac6254dcf7ccc37CeC662aeba8eFA666666';
const chatInfo = await readOnlyAccount.chat.info(recipient);

console.log('Chat Info:', chatInfo);
