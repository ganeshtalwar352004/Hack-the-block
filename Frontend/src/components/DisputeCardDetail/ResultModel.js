import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useSelector } from 'react-redux';

const ResultModal = ({
  description1,
  description2,
  winner,
  totalStakedTokens,
  userStake,
  hasVoted,
  hasWon,
  rewardOrPenaltyAmount,
}) => {
  const { isConnected, pubKey } = useSelector((state) => state.address);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const amount=(Number(rewardOrPenaltyAmount)/1e18).toFixed(4);
  // Determine winning description and conditional styling
  const winningDescription = winner === 1 ? description1 : description2;
  const losingDescription = winner === 1 ? description2 : description1;

  return (
    <>
    <Button
        variant="contained"
        size="small"
        onClick={handleOpen}
      >
        See Results
      </Button>
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-result-title"
      aria-describedby="modal-result-description"
    >
      <Box className="absolute flex flex-col gap-6 p-8 rounded-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white shadow-2xl">
        <Typography
          className="text-center text-3xl font-bold"
          id="modal-result-title"
        >
          Dispute Results
        </Typography>

        {/* Dispute Descriptions */}
        <Box className="flex flex-col gap-4">
          <Typography
            className={`text-lg p-4 rounded-lg ${
              winner === '1' ? 'bg-green-200 font-semibold' : 'bg-gray-200'
            }`}
          >
            {description1}
          </Typography>
          <Typography
            className={`text-lg p-4 rounded-lg ${
              winner === '2' ? 'bg-green-200 font-semibold' : 'bg-gray-200'
            }`}
          >
            {description2}
          </Typography>
        </Box>

        {/* Staking Information */}
        <Box className="text-center">
          <Typography variant="h6" className="font-medium">
            Total Staked Tokens: <span className="font-bold">{totalStakedTokens}</span>
          </Typography>
          <Typography variant="h6" className="font-medium">
             {hasVoted?<span className="font-bold">Your Stake: {userStake}</span>:<span className="text-sm">You have not voted !</span>}
          </Typography>
        </Box>

        {/* Result Status */}
        {hasVoted?<Box className="flex flex-col items-center gap-2">
          <Typography
            className={`text-xl font-bold ${
              hasWon ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {hasWon ? 'Congratulations, You Won!' : 'You Lost'}
          </Typography>

          <Box
            className={`flex justify-center items-center p-6 rounded-full text-2xl font-bold shadow-md ${
              hasWon ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
            }`}
          >
            {hasWon ? `+${amount}` : `${amount}`}
          </Box>
        </Box>:null}

        <Button
          variant="contained"
          color="primary"
          onClick={handleClose}
          className="self-center mt-6"
        >
          Close
        </Button>
      </Box>
    </Modal>
    </>
  );
};

export default ResultModal;
