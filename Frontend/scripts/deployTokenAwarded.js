// scripts/deployTokenAwarder.js
const { ethers } = require("hardhat");

async function main() {
  // Set the address of your deployed MyToken contract and award amount
  const myTokenAddress = "0x1f9670861F57dDeA8b2e8d076399d50b4F7b0BC7"; // Replace with your ERC20 token contract address
  const awardAmount = ethers.utils.parseUnits("100", 18); // Replace "10" with the award amount in tokens (adjust decimals as needed)

  // Get the contract factory for TokenAwarder
  const TokenAwarder = await ethers.getContractFactory("TokenAwarder");

  // Deploy the contract, passing the MyToken contract address and award amount to the constructor
  const tokenAwarder = await TokenAwarder.deploy(myTokenAddress, awardAmount);

  // Wait for the contract to be deployed
  await tokenAwarder.deployed();

  console.log("TokenAwarder deployed to:", tokenAwarder.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error in deployment:", error);
    process.exit(1);
  });
