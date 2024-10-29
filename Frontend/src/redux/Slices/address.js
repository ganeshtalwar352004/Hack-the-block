import { createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
// require("dotenv").config();
const initialState = {
  isConnected: false,
  pubKey:"",
  isOwner:false,
};

const slice = createSlice({
  name: "address",
  initialState,
  reducers: {
   connectWallet(state,action){
        state.isConnected=true;
        state.pubKey=action.payload.pubKey;
        state.isOwner=action.payload.isOwner;
   },
   disconnectWallet(state,action){
    state.isConnected=false;
    state.pubKey='';
},
  },
});

export default slice.reducer;

export function ConnectWallet(){
    // const navigate=useNavigate();
    return async (dispatch,getState)=>{
        if (typeof window.ethereum !== 'undefined') {
            try {
              const provider = new ethers.providers.Web3Provider(window.ethereum);
              const accounts = await provider.send("eth_requestAccounts", []);
              const isOwner=accounts[0]==process.env.REACT_APP_OWNER.toLowerCase();
              console.log(accounts[0]);
              dispatch(slice.actions.connectWallet({pubKey:accounts[0],isOwner:isOwner}));
              window.location.reload();
              toast("Wallet Connected");

            //   navigate('/disputes');
            } catch (error) {
              toast(error.message);
            }
          } else {
            toast('MetaMask is not installed. Please install it to connect your wallet.');
          }
    }
}

export function DisconnectWallet(){
    return async(dispatch,getState)=>{
        dispatch(slice.actions.disconnectWallet());
    }
}

