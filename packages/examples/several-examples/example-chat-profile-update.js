import { CONSTANTS, PushAPI } from '@pushprotocol/restapi';
import { ethers } from 'ethers';
import input from 'input';

console.log("Hello... what's my purpose?")
console.log("To train all the hackers..")

// Requesting private key from user
// This is a demo to show how profile of a user can be changed
console.log("This demo requires a wallet to be initialized via private key so that the profile can be applied");
console.log("Alternatively just leave the input empty and we will create a new user");
let pk = await input.text('Enter private key of your wallet -');
if (pk.length > 0 && pk.substr(0, 2) !== '0x') {
  pk = '0x' + pk;
}

// Loading signer from private key, ideally this is the wallet you will connect
const signer = pk.length > 0 ? new ethers.Wallet(pk) : ethers.Wallet.createRandom();

// Print wallet address
console.log('Wallet address: ', signer.address);

// Initialize wallet user, pass 'prod' instead of 'staging' for mainnet apps
let userAlice = await PushAPI.initialize(signer, { env: CONSTANTS.ENV.PROD });
console.log('User initialized the user', userAlice);

let name = await input.text('Enter Push Profile Name -');
let desc = await input.text('Enter Push Profile Desc -');

// Manually input this as base64 encoded image might be too long
let image = await input.text('Enter Push Profile Image -');

userAlice = await userAlice.profile.update({ 
  name: name !== '' ? name : null, 
  desc: desc !== '' ? desc : null, 
  image: image !== '' ? image : null 
});
console.log('User updated the profile', userAlice);

