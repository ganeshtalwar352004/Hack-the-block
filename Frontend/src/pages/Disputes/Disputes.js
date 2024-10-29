import React, { useEffect, useState } from 'react'
import DisputeCard from '../../components/DisputeCardDetail/DisputeCardDetail'
import {Wallet} from '@phosphor-icons/react'
import axios from '../../utils/axios'
import { useDispatch, useSelector } from 'react-redux'
import { ConnectWallet, DisconnectWallet } from '../../redux/Slices/address'
const Disputes = () => {
    const [disputes, setDisputes] = useState([]);

    const {isConnected,pubKey}=useSelector((state)=>state.address);
    // console.log(pubKey);
    const dispatch=useDispatch();
    useEffect(() => {
      const fetchDisputes = async () => {
        try {
          const response = await axios.get('/dispute/get-disputes');
          // console.log(response);
          setDisputes(response.data.data);
        } catch (error) {
          console.error('Error fetching disputes:', error);
        }
      };
  
      fetchDisputes();
    }, []);
    const disconnectWallet=()=>{
        dispatch(DisconnectWallet());
        // console.log(isConnected);
    }
    const connectWallet=()=>{
        dispatch(ConnectWallet());
        // console.log(isConnected);
    }
  return (
    <>
    <div class='min-w-screen min-h-screen w-full h-full flex flex-col py-8 items-center bg-gradient-to-r from-[#152331] to-[#000000]'>
    <div class='sticky z-10 top-0 w-[50rem] mb-20  bg-[#ffffff] shadow-slate-900  shadow-2xl  p-3 flex justify-between rounded-3xl  backdrop-filter backdrop-blur-sm border-[1px] border-slate-900 bg-opacity-10 '>
        <h1 class='text-white text-4xl flex-grow text-center'>Disputes</h1>
        <button onClick={()=>{
            if(isConnected)disconnectWallet();
            else connectWallet();
        }} class='text-white text-sm flex items-center gap-1 px-2 border-[1px] rounded-md mr-3'><h1>{isConnected?'Disconnect Wallet':'Connect Wallet'}</h1><Wallet size={22} /></button>
    </div>
    <div class='flex flex-col gap-5'>
    {disputes?.map((dispute, index) =>{ 
      // if(dispute.TotalStakedTokens!=16)return;
        const stakedToken = dispute?.StakedTokens?.find(
            (entry) => entry.pubKey.toLowerCase()=== pubKey
        );
        // console.log(stakedToken);
        const Vote=dispute.Votes.find(
          (entry) => entry.pubKey=== pubKey
        )
        const isAllowedToVote= dispute?.Voters?.some(
          (entry) => entry.pubKey.toLowerCase() === pubKey
        ) || false;
        const isTokenStaked = !!stakedToken;
        const stakedTokenValue = isTokenStaked ? stakedToken.token : 0;
        const VotedTo=!!Vote?Vote.voted:null;
        let Juror=null;
        console.log(isAllowedToVote);
        console.log(pubKey);
        if(isAllowedToVote){
          // console.log('L');
          // console.log(dispute.Result);
          Juror=dispute?.Result?.find(
            (entry) => entry.juror.toLowerCase()=== pubKey
        );
        // console.log(Juror);
        }
        return(
        <DisputeCard
          key={dispute._id}
          title={dispute.title}
          description1={dispute.description1}
          description2={dispute.description2}
          id={dispute._id}
          isTokenStaked={isTokenStaked}
          stakedTokenValue={stakedTokenValue}
          isAllowedToVote={isAllowedToVote}
          VotersAssigned={dispute.VotersAssigned}
          VotedTo={VotedTo}
          Closed={dispute.Closed}
          Voters={dispute.Voters}
          Votes={dispute.Votes}
          Results={dispute.Results}
          winner={dispute.won}
          TotalStakedTokens={dispute.TotalStakedTokens}
          rewardOrPenalty={Juror?.amount}
        />
      )})}
      </div>
    </div>
   
    </>
  )
}

export default Disputes