// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MyToken.sol"; // Import the MyToken contract

contract TokenSale {
    MyToken public token;
    address public owner;
    uint256 public price; // price in wei
    uint256 public priceIncrement; // amount to increase price after each sale

    event TokensPurchased(address buyer, uint256 amount);
    event PriceUpdated(uint256 newPrice);

    constructor(MyToken _token, uint256 _initialPrice, uint256 _priceIncrement) {
        token = _token;
        owner = msg.sender;
        price = _initialPrice;
        priceIncrement = _priceIncrement; // Set the amount by which the price increases
    }

    function buyTokens(uint256 amount) public payable {
        require(msg.value == amount * price, "Incorrect amount of ether sent");
        require(token.balanceOf(owner) >= amount, "Not enough tokens available");
        
        token.transfer(msg.sender, amount);
        emit TokensPurchased(msg.sender, amount);
        
        // Increase the price after each successful purchase
        price += priceIncrement;
        emit PriceUpdated(price);
    }

    function withdraw() public {
        require(msg.sender == owner, "Only the owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }
}
