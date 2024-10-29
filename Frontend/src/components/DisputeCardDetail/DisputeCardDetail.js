import React, { useState } from "react";
import TokenModel from "./TokenModal";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import { ethers } from "ethers";
import axios from "../../utils/axios";
import arbitrationSystemArtifact from "../../artifacts/contracts/contract.sol/ArbitrationSystem.json";
import { toast } from "sonner";
import VotingModal from "./VoteModel";
import ResultModal from "./ResultModel"; // Import contract info
import CircularProgress from '@mui/material/CircularProgress';
const contractAddress = "0xD01EbC814Cd56d8D1Db519460941fCB54009d009";

const DisputeCard = ({
  title,
  description1,
  description2,
  id,
  winner,
  isTokenStaked,
  TotalStakedTokens,
  stakedTokenValue,
  isAllowedToVote,
  VotersAssigned,
  VotedTo,
  Closed,
  Voters,
  Votes,
  Results,
  rewardOrPenalty,
}) => {
  const { isOwner } = useSelector((state) => state.address);
  console.log(Voters, Votes);
  const [loading,setLoading]=useState(false);


  const renderActionButton = () => {
    if (Closed) {
      return (
        <ResultModal
          description1={description1}
          description2={description2}
          winner={winner}
          totalStakedTokens={TotalStakedTokens}
          userStake={stakedTokenValue}
          hasVoted={isAllowedToVote}
          hasWon={VotedTo == winner}
          rewardOrPenaltyAmount={rewardOrPenalty}
        />
      );
    }
    if (isOwner) {
      if (!VotersAssigned) {
        return (
          <Button size="small" variant="contained"  disabled={loading} onClick={handleAssignVoters}>
            {loading?<CircularProgress color="inherit" size={23} />:"Assign Voters"}
          </Button>
        );
      }
      return (
        <Button size="small" variant="contained" disabled={loading} onClick={handleResolveDispute}>
         {loading?<CircularProgress color="inherit" size={23} />:"Resolve Dispute"}
        </Button>
      );
    } else {
      if (!VotersAssigned) {
        return (
          <TokenModel
            id={id}
            isTokenStaked={isTokenStaked}
            stakedTokenValue={stakedTokenValue}
          />
        );
      } else {
        if (isAllowedToVote) {
          return (
            <VotingModal
              id={id}
              VotedTo={VotedTo}
              description1={description1}
              description2={description2}
            />
          );
        } else
          return (
            <Button size="small" disabled>
              Not selected
            </Button>
          );
      }
    }

    return null;
  };

  const updateVoters = async (Voters) => {
    try {
      const response = await axios.post("/dispute/assign-voters", {
        id,
        Voters,
      });
      console.log("Voters assigned successfully:", response.data);
      toast(response.data.message);
    } catch (error) {
      console.error("Error updating backend:", error);
    }
  };

  const handleAssignVoters = async () => {  
    if (!window.ethereum) {
      console.error("Please install MetaMask!");
      return;
    }
    
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const arbitrationSystemContract = new ethers.Contract(
      contractAddress,
      arbitrationSystemArtifact.abi,
      signer
    );

    try {
      const tx = await arbitrationSystemContract.selectJurors(); // Send transaction
      console.log("Transaction sent:", tx);

      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      console.log("Transaction receipt:", receipt);

      // Listen for the JurorsSelected event
      const jurorsSelectedEvent = receipt.events?.find(
        (event) => event.event === "JurorsSelected"
      );

      if (jurorsSelectedEvent) {
        const jurors = jurorsSelectedEvent.args[0];
        const Voters = jurors.map((juror) => ({
          pubKey: juror.pubKey,
          weight: ethers.BigNumber.from(juror.weight).toString(),
        }));
        console.log("Selected jurors:", Voters);
        updateVoters(Voters);
      }
    } catch (error) {
      console.error("Error selecting jurors:", error);
    }finally{
      setLoading(false);
    }
  };
  const postresults = async (Results, winner) => {
    try {
      const response = await axios.post("/dispute/resolve-dispute", {
        id,
        Results,
        winner,
      });
      console.log("Dispute Resolved successfully:", response.data);
      toast(response.data.message);
    } catch (error) {
      console.error("Error updating backend:", error);
    }
  };
  const handleResolveDispute = async () => {
    if (!window.ethereum) {
      console.error("Please install MetaMask!");
      return;
    }
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const arbitrationSystemContract = new ethers.Contract(
      contractAddress,
      arbitrationSystemArtifact.abi,
      signer
    );
    const Results = [];

    try {
      const tx = await arbitrationSystemContract.resolveDispute(Voters, Votes); // Add necessary parameters as required by your function
      const receipt = await tx.wait();

      // Capture the Winner event
      const winnerEvent = receipt.events.find(
        (event) => event.event === "Winner"
      );
      const winner = winnerEvent ? winnerEvent.args[0] : null;

      // Capture Rewards and Penalties event
      const rewardsPenaltiesEvent = receipt.events.find(
        (event) => event.event === "RewardsAndPenalties"
      );
      const rewards = rewardsPenaltiesEvent
        ? rewardsPenaltiesEvent.args[0]
        : [];
      const penalties = rewardsPenaltiesEvent
        ? rewardsPenaltiesEvent.args[1]
        : [];

      const eventData = {
        winner,
        rewards: rewards.map((r) => ({
          juror: r.juror,
          amount: ethers.BigNumber.from(r.amount).toString(),
        })),
        penalties: penalties.map((p) => ({
          juror: p.juror,
          amount: ethers.BigNumber.from(p.amount).toString(),
        })),
      };

      // Add rewards to the combined array (positive amounts)
      rewards.forEach((reward) => {
        const amount = ethers.BigNumber.from(reward.amount).toString();
        if (
          amount != "0" &&
          reward.juror != '"0x0000000000000000000000000000000000000000"'
        ) {
          Results.push({
            juror: reward.juror,
            amount: amount, // Positive reward amount
          });
        }
      });

      // Add penalties to the combined array (negative amounts)
      penalties.forEach((penalty) => {
        const amount = ethers.BigNumber.from(penalty.amount).toString();
        if (
          amount != "0" &&
          penalty.juror != '"0x0000000000000000000000000000000000000000"'
        ) {
          Results.push({
            juror: penalty.juror,
            amount: -amount, // Negative penalty amount
          });
        }
      });
      console.log(Results);
      postresults(Results, winner);
      console.log("Event Data:", eventData);
    } catch (error) {
      console.error("Error resolving dispute:", error);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="w-[40rem] rounded-md p-4 flex flex-col gap-2 shadow-lg shadow-black drop-shadow-2xl bg-[#ffffff]">
      <div className="bg-[#f7f7f7] shadow-inner p-2">
        <h1 className="line-clamp-2">{description1}</h1>
      </div>
      <div className="relative flex items-center">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="flex-shrink text-xs text-gray-400">VS</span>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>
      <div className="bg-[#f7f7f7] shadow-inner p-2">
        <h1 className="line-clamp-2">{description2}</h1>
      </div>
      <div className="flex justify-end">{renderActionButton()}</div>
    </div>
  );
};

export default DisputeCard;
