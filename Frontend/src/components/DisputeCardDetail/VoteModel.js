import React, { useState } from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';
import { toast } from 'sonner';
import axios from "../../utils/axios";
import { useSelector } from 'react-redux';

const VotingModal = ({description1, description2,id,VotedTo}) => {
    const {pubKey}=useSelector((state)=>state.address);
  const [selectedDescription, setSelectedDescription] = useState(null);
  const [vote,setVote]=useState(VotedTo);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSelect = (description) => {
    setSelectedDescription(description);
  };

  const handleVoteSubmit = async () => {
    console.log(selectedDescription);
    if (!selectedDescription) {
      toast.error("Please select a description to vote.");
      return;
    }
    setVote(selectedDescription);
    
    console.log(vote);
    try {
      const response = await axios.post('/dispute/vote', {
        id,
        pubKey,
        voted: selectedDescription
      });
      console.log("Vote submitted successfully:", response.data);
      toast.success(response.data.message);
     // Callback to parent component
      handleClose(); 
    } catch (error) {
      console.error("Error submitting vote:", error);
      toast.error("Failed to submit vote.");
    }
  };

  const boxStyles = (isSelected) => ({
    width:'400px',
    p: 2,
    cursor: 'pointer',
    borderRadius: 2,
    backgroundColor: '#f7f7f7',
    border: isSelected ? '2px solid #007bff' : 'none',
    boxShadow: isSelected ? '0px 0px 8px #007bff' : '0px 0px 8px rgba(0, 0, 0, 0.2)',
    transition: 'box-shadow 0.3s ease-in-out',
    mb: 2,
  });

  return (
    <div>
        <Button
        variant="contained"
        size="small"
        disabled={vote}
        sx={{
          '&:disabled': {
            backgroundColor: 'green',
            color: 'white',
          },
        }}
        onClick={handleOpen}
      >
        {vote ? `Voted for ${vote} ` : "Vote"}
      </Button>
         <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="absolute flex justify-center items-center flex-col gap-4 p-8 rounded-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] bg-white shadow-2xl">
     
        <Typography variant="h6" mb={2}>Select a Description to Vote</Typography>

        <Box
          sx={boxStyles(selectedDescription === 1)}
          onClick={() => handleSelect(1)}
        >
          <Typography>{description1}</Typography>
        </Box>

        <Box
          sx={boxStyles(selectedDescription === 2)}
          onClick={() => handleSelect(2)}
        >
          <Typography>{description2}</Typography>
        </Box>

        <Box mt={2} textAlign="right">
          <Button
            variant="contained"
            color="primary"
            onClick={handleVoteSubmit}
            disabled={!selectedDescription}
          >
            Submit Vote
          </Button>
        </Box>
      </Box>
    </Modal>
    </div>
  );
};

export default VotingModal;
