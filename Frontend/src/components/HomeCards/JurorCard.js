import React, { useEffect } from 'react';
import { ethers } from 'ethers';
import { useDispatch, useSelector } from 'react-redux';
import { ConnectWallet } from '../../redux/Slices/address';
import TokenAwarderArtifact from '../../artifacts/contracts/TokenAwarded.sol/TokenAwarder.json';
import MyTokenArtifact from '../../artifacts/contracts/MyToken.sol/MyToken.json'; 
import { toast } from 'sonner';

const TOKEN_AWARDER_ADDRESS = '0x6eFf865F73687727445645E146CD78350454CDfE'; 

const JurorCard = () => {
    const dispatch = useDispatch();
    const { isConnected, pubKey } = useSelector((state) => state.address);

    const claimTokens = async () => {
        if (!isConnected) return; 

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const tokenAwarderContract = new ethers.Contract(TOKEN_AWARDER_ADDRESS, TokenAwarderArtifact.abi, signer);

            const tx = await tokenAwarderContract.claimTokens();
            await tx.wait(); 
            console.log(tx);
            toast("Tokens claimed successfully!");
        } catch (error) {
            console.error("Error claiming tokens:", error);
            
        }
    };

   
    useEffect(() => {
        if (isConnected) {
            claimTokens(); 
        }
    }, [isConnected]);

    return (
        <div className='w-96 h-48 p-4 bg-card-gradient flex flex-col justify-center items-center gap-10 rounded-lg'>
            <h1 className='text-center text-slate-50 text-3xl font-semibold'>Enter as Juror</h1>
            <button
                onClick={() => {
                    dispatch(ConnectWallet());
                }}
                className="bg-[#B9E5E8] py-2 px-4 text-xl font-semibold rounded shadow"
            >
                {isConnected ? "Wallet Connected" : 'Connect Wallet'}
            </button>
        </div>
    );
};

export default JurorCard;
