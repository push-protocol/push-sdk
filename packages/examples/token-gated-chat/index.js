import { PushAPI } from '@pushprotocol/restapi';
import { ethers } from 'ethers';

// Creating a random signer from a wallet, ideally this is the wallet you will connect
const signer = ethers.Wallet.createRandom();

console.debug(`Signer address: ${signer.address} | Signer private key: ${signer.privateKey}`);

// Initialize wallet user, pass 'prod' instead of 'staging' for mainnet apps
const userAlice = await PushAPI.initialize(signer, { env: 'staging' });

// Creating your token gated community
const createTokenGatedGroup = await userAlice.chat.group.create('Push Community', {
  description: 'Token gated web3 native chat example', // provide short description of group
  image: 'data:image/png;base64,iVBORw0K...', // provide base64 encoded image
  members: [], // not needed, rules define this, can omit
  admins: [], // not needed as per problem statement, can omit
  private: true,
  rules: {
    "entry": { // entry is based on conditions
      "conditions": {
        "any": [ // any of the decider should allow entry
          { // decider 1 - If admin or owner invites someone
            "any": [ 
              { // criteria 1
                "type": "PUSH",
                "category": "INVITE",
                "subcategory": "DEFAULT",
                "data": {
                    "inviterRoles": [
                        "ADMIN",
                        "OWNER"
                    ]
                }
              }
            ]
          },
          { // decicder 2 - If wallet holds 1 NFT on polygon testnet
            "any": [
              { // criteria 1
                type: "PUSH", // define type that rules engine should go for
                category: "ERC721", // define it's ERC20 token that you want to check, supports ERC721 as well
                subcategory: "holder", // define if you are checking 'holder'
                data: { 
                  "contract": "eip155:80001:0x9105D95577575116948F5afcF479254f49F27939",
                  "comparison": ">=", // what comparison needs to pass
                  "amount": 1, // amount that needs to passed
                  "decimals": 18,
                }
              }
            ]
          }
        ]
      }
    }
  }
});

console.debug("Chat created successfully!", createTokenGatedGroup);
