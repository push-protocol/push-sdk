# NFT Smart Contract with Push Notifications Example

This repository shows how you can implement Push Notifications in an NFT contract, this contract example uses Push notification powered by Push Protocol to trigger notification to OWNER whenever someone mints an NFT from this contract.

## Overview

- The project is developed using Hardhat, a development environment for Ethereum.
- It utilizes a basic OpenZeppelin ERC721 contract, and push notification logic is implemented.
- A Channel must be created in Push Protocol Network before proceeding.

## Getting Started

1. **Clone the Repository and Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure Hardhat:**

   - Add your private key and RPC URL in the `hardhat.config.js` file.

3. **Update Contract Configuration:**

   - Edit the `YOUR_CHANNEL_ADDRESS` and `to` fields in the `MyToken.sol` contract (line number 33 & 34) with relevant values.

4. **Compile the Contract:**

   ```bash
   npx hardhat compile
   ```

5. **Deploy the Contract:**

   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

   This command deploys the contract to Sepolia and **adds the deployed contract as a delegate in your Push Protocol channel**.

6. **Mint an NFT:**

   ```bash
   npx hardhat mint-nft --to <wallet> --uri <nft_metadata> --network sepolia
   ```

7. **Check Notifications:**
   Open your inbox at `staging.push.org` to view the notification.

## Important Notes

- Ensure that you have created a channel on Push Staging Network at `staging.push.org` before proceeding and are using the private key of the same account in here.
- If you want to deploy this contract to Mainnet, you must edit the `EPNS_COMM_ADDRESS` at line number 20 in `MyToken.sol` and  `address` at `./EPNSCOMMPROXY.json` based on the network, please refer here for more details -> [Push Docs](https://push.org/docs/notifications/push-smart-contracts/contract-addresses/).
