import { CONSTANTS, PushAPI } from '@pushprotocol/restapi';
import { ethers } from 'ethers';
import input from 'input';

// Requesting private key from user
// This is a demo to show how to downgrade a user to PGP V1
console.log("This demo requires a wallet to be initialized via private key so that it can be downgraded to PGP V1");
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
console.log('User initialized with current PGP Version', userAlice);

userAlice = await userAlice.encryption.update(CONSTANTS.USER.ENCRYPTION_TYPE.PGP_V1);
console.log('User downgraded to PGP V1', userAlice);
