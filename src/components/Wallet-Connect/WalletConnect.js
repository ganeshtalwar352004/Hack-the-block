import React, { useState } from 'react';
import { ethers } from 'ethers';
import './WalletConnect.css'; // Make sure to import the CSS file

const WalletConnect = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]);
      } catch (error) {
        setErrorMessage('Failed to connect wallet: ' + error.message);
      }
    } else {
      setErrorMessage('MetaMask is not installed. Please install it to connect your wallet.');
    }
  };

  return (
    <div className="wallet-connect">
      <button className="connect-button" onClick={connectWallet}>
        {walletAddress
          ? `Connected: ${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
          : 'Connect Wallet'}
      </button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default WalletConnect;
