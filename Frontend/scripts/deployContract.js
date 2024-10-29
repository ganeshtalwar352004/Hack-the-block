// scripts/deployArbitrationSystem.js
const { ethers } = require("hardhat");

async function main() {
  
  const tokenAddress = "0x1f9670861F57dDeA8b2e8d076399d50b4F7b0BC7"; // replace with actual ERC-20 token address
 
  // Get the contract factory for ArbitrationSystem
  const ArbitrationSystem = await ethers.getContractFactory("ArbitrationSystem");

  // Deploy the contract, passing the ERC-20 token address to the constructor
  const arbitrationSystem = await ArbitrationSystem.deploy(tokenAddress);

  // Wait for the contract to be deployed
  await arbitrationSystem.deployed();

  console.log("ArbitrationSystem deployed to:", arbitrationSystem.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error in deployment:", error);
    process.exit(1);
  });
