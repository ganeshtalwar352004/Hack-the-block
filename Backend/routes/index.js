const express=require("express");
const router=express.Router();
const disputeRoute=require("./dispute");


router.use("/dispute",disputeRoute);

module.exports=router; 
