// contracts/TokenAwarder.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MyToken.sol"; // Import your ERC20 token contract

contract TokenAwarder {
    MyToken public token;
    mapping(address => bool) public hasClaimed; // Track if a user has already claimed tokens
    uint256 public awardAmount; // Amount of tokens to award

    event TokensAwarded(address recipient, uint256 amount);

    constructor(MyToken _token, uint256 _awardAmount) {
        token = _token; // Set the token contract
        awardAmount = _awardAmount; // Set the award amount
    }

    function claimTokens() external {
        require(!hasClaimed[msg.sender], "Tokens already claimed");
        
        // Award tokens to the user
        token.transfer(msg.sender, awardAmount);
        hasClaimed[msg.sender] = true; // Mark the user as having claimed tokens

        emit TokensAwarded(msg.sender, awardAmount);
    }
}
