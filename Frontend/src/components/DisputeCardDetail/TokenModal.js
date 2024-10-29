import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import { ethers } from 'ethers';
import arbitrationSystemArtifact from '../../artifacts/contracts/contract.sol/ArbitrationSystem.json'; 
import MyTokenArtifact from '../../artifacts/contracts/MyToken.sol/MyToken.json'; 
import { useSelector } from 'react-redux';
import axios from '../../utils/axios'
import { toast } from 'sonner';

const contractAddress = "0xD01EbC814Cd56d8D1Db519460941fCB54009d009"; 
const tokenAddress="0x1f9670861F57dDeA8b2e8d076399d50b4F7b0BC7";
const TokenModel = ({ id,isTokenStaked,stakedTokenValue }) => {
    // console.log(stakedTokenValue);
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState(stakedTokenValue);
  const [isLoading, setIsLoading] = useState(false);
  const[loadingText,setLoadingtext]=useState('');
    const {isConnected,pubKey}=useSelector((state)=>state.address);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const updateStakedTokens = async () => {
    try {
      const response = await axios.post('/dispute/stake-tokens', {
        id,
        token,
        pubKey,
      });
      console.log("Backend updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating backend:", error);
    }
  };

  const handleStakeTokens = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask to use this feature");
        return;
      }
      
      setIsLoading(true);
      setLoadingtext('Connecting Wallet...');
      
      const tokenAmount = ethers.utils.parseUnits(token, 18);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(tokenAddress, MyTokenArtifact.abi, signer);
      const contract = new ethers.Contract(contractAddress, arbitrationSystemArtifact.abi, signer);
      const tx1 = await tokenContract.approve(contractAddress, tokenAmount);
      setLoadingtext('Approving Transaction...');
      await tx1.wait();
      setLoadingtext('Staking Tokens...');
      const tx = await contract.stakeTokens(tokenAmount);
      await tx.wait(); 
      setLoadingtext('Updating Backend...');
      console.log(`Successfully staked ${token} tokens`);
      await updateStakedTokens();
      handleClose();
      setToken(""); 
      toast("Tokens staked successfully");
    } catch (error) {
      console.error("Error staking tokens:", error);
      toast("Failed to stake tokens. Please try again.");
    } finally {

      setIsLoading(false);
      window.location.reload();
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        size="small"
        disabled={isTokenStaked}
        sx={{
          '&:disabled': {
            backgroundColor: 'green',
            color: 'white',
          },
        }}
        onClick={handleOpen}
      >
        {token ? `${token} token staked` : "Stake tokens"}
      </Button>
      <Modal
        open={open}
        onClose={!isLoading&&handleClose}
        disableEscapeKeyDown={isLoading}
        disableBackdropClick={isLoading}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="absolute flex justify-center items-center flex-col gap-4 p-8 rounded-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white shadow-2xl">
          <Typography
            className="text-center text-2xl mb-3"
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Stake your Tokens
          </Typography>
          <TextField
            type="number"
            size="small"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter token amount"
            disabled={isLoading}
          />
          <Button
            variant="contained"
            size="small"
            onClick={handleStakeTokens}
            disabled={isLoading}
          >
            {isLoading ? loadingText : "Stake tokens"}
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default TokenModel;
