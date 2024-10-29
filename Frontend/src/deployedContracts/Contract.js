import arbitrationSystemArtifact from '../artifacts/contracts/contract.sol/ArbitrationSystem.json'; 
import { ethers } from 'ethers';

const contractAddress = "0xd1DA296d98b92C31710C6271d0faA8084FE9E9f6"; 


export  const  deployContract=async()=>{
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    // const tokenContract = new ethers.Contract(tokenAddress, MyTokenArtifact.abi, signer);
    const contract = new ethers.Contract(contractAddress, arbitrationSystemArtifact.abi, signer);
    return contract;
}