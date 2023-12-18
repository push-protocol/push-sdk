require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
const deployedNFT = require("./deployedNFT.json");

const RPC = "YOUR_RPC_URL(Alchemy/Quicknode)";
const privateKey = "YOUR_PRIVATE_KEY(Push Channel Owner)";

const {task} = require("hardhat/config");

// Task to call safeMint function in MyToken contract
task("mint-nft", "Mint a new token using MyToken contract")
  .addParam("to", "Address to mint the token to")
  .addParam("uri", "URI for the token metadata")
  .setAction(async (taskArgs) => {
    const {to, uri} = taskArgs;
    console.log(to, uri);
    try {
      // Deploy MyToken contract
      const [deployer] = await ethers.getSigners();

      const contract = await ethers.getContractAt(
        "MyToken",
        deployedNFT.address,
        deployer
      );

      // Mint a new token using the safeMint function
      await contract.safeMint(to, uri);

      console.log(`Token minted successfully to ${to} with URI ${uri}`);
    } catch (error) {
      console.error("Error minting token:", error);
    }
  });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: RPC,
      accounts: [privateKey],
    },
  },
};
