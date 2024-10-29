// scripts/deploy.js
const hre = require("hardhat");
const fs = require('fs');
async function main() {
    // Deploy MyToken contract
    const MyToken = await hre.ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy("GRULL", "GRL", ethers.utils.parseEther("1000000")); // 1 million tokens
    await myToken.deployed();
    console.log("MyToken deployed to:", myToken.address);

    // Deploy TokenSale contract
    const TokenSale = await hre.ethers.getContractFactory("TokenSale");
    const tokenSale = await TokenSale.deploy(myToken.address, ethers.utils.parseEther("0.01"), 10); // Initial price of 0.01 ETH and price increment of 10 wei
    await tokenSale.deployed();
    console.log("TokenSale deployed to:", tokenSale.address);
    // Deploy Token Awarder
    const TokenAwarder = await hre.ethers.getContractFactory("TokenAwarder");
    const tokenAwarder = await TokenAwarder.deploy(myToken.address, ethers.utils.parseEther("500")); // Pass the token address
    await tokenAwarder.deployed();

    console.log("TokenAwarder deployed to:", tokenAwarder.address);



    const tokenData = {
        tokenAddress: myToken.address,
        tokenSale:tokenSale.address,
        tokenAwarder:tokenAwarder.address,
      };
    
     console.log(tokenData);

}

// Execute the main function and handle errors
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
