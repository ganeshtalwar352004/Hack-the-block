import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import axios from '../../utils/axios';
import { toast } from 'sonner';

export default function DisputeModel() {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [description1, setDescription1] = React.useState('');
  const [description2, setDescription2] = React.useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDispute = async() => {
    console.log(title,description1,description2);
    await axios
      .post(
        "/dispute/create-dispute",
        {
          title,description1,description2
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log(response);
       toast('Dispute added succesfully');
      })
      .catch(function (error) {
        console.log(error);
      });

    handleClose();
  };

  return (
    <div>
      <Button class="bg-[#B9E5E8] py-2 px-4 text-xl  font-semibold  rounded shadow"  onClick={handleOpen}>Post Dispute</Button>
      <Modal    
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="absolute flex justify-center items-center flex-col gap-4 p-8 rounded-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white shadow-2xl">
          <Typography className="text-center text-2xl mb-3" id="modal-modal-title" variant="h6" component="h2">
            Enter Dispute Details
          </Typography>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            size="small"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Description 1"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            size="small"
            value={description1}
            onChange={(e) => setDescription1(e.target.value)}
          />
          <TextField
            label="Description 2"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            size="small"
            value={description2}
            onChange={(e) => setDescription2(e.target.value)}
          />
          <Button variant='contained' size='small' onClick={handleDispute}>Submit Dispute</Button>
        </Box>
      </Modal>
    </div>
  );
}
