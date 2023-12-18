const fs = require("fs");
const path = require("path");
const EPNSCOMMPROXY = require("../EPNSCOMMPROXY.json");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const MyToken = await ethers.getContractFactory("MyToken");
  const contract = await MyToken.deploy(deployer.address);

  console.log("Contract deployed at:", contract.target);

  // Interacting with EPNSCOMMPROXY contract and adding our NFT contract as a delegate to our Push Channel
  const pushV2CommProxy = new ethers.Contract(
    EPNSCOMMPROXY.address,
    EPNSCOMMPROXY.abi,
    deployer
  );
  await pushV2CommProxy.addDelegate(contract.target);

  console.log("Delegate Added.");

  // Write the contract address to a JSON file
  const contractAddressPath = path.join(__dirname, "../deployedNFT.json");
  const contractAddressData = {
    address: contract.target,
  };

  fs.writeFileSync(
    contractAddressPath,
    JSON.stringify(contractAddressData, null, 2)
  );

  console.log(`Contract address written to: ${contractAddressPath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
