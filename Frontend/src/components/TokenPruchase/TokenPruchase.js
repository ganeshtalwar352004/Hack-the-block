// src/components/TokenPurchase.js
import React, { useState } from 'react';
import { ethers } from 'ethers';
// import TokenSale from '../artifacts/contracts/TokenSale.sol/TokenSale.json'; // Adjust the path based on your project structure

const TokenPurchase = ({ tokenSaleAddress }) => {
  const [amount, setAmount] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('');

  const buyTokens = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setTransactionStatus('Please enter a valid amount.');
      return;
    }

    // try {
    //   const provider = new ethers.providers.Web3Provider(window.ethereum);
    //   const signer = provider.getSigner();
    //   const tokenSaleContract = new ethers.Contract(tokenSaleAddress, TokenSale.abi, signer);

    //   const price = await tokenSaleContract.price(); // Get the current price from the contract
    //   const totalCost = ethers.utils.parseEther((price * amount).toString()); // Calculate total cost

    //   const tx = await tokenSaleContract.buyTokens(amount, { value: totalCost });
    //   setTransactionStatus('Transaction sent! Waiting for confirmation...');
    //   await tx.wait(); // Wait for the transaction to be mined

    //   setTransactionStatus('Transaction confirmed! Tokens purchased.');
    //   setAmount(''); // Reset the amount input
    // } catch (error) {
    //   console.error(error);
    //   setTransactionStatus('Transaction failed. Please try again.');
    // }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md mt-8 w-80 mx-auto">
      <h2 className="text-xl font-bold mb-4">Buy Tokens</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount of tokens"
        className="border border-gray-300 rounded-md p-2 w-full mb-4"
      />
      <button
        onClick={buyTokens}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
      >
        Buy Tokens
      </button>
      {transactionStatus && (
        <p className="mt-4 text-red-500">
          {transactionStatus}
        </p>
      )}
    </div>
  );
};

export default TokenPurchase;
