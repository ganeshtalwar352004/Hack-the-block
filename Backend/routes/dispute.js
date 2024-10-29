

const express=require("express");
const router=express.Router();
const disputeController=require("../controllers/dispute")

router.post("/create-dispute",disputeController.createDispute);
router.post("/stake-tokens",disputeController.stakeTokens);
router.post("/assign-voters",disputeController.assignVoters)
router.post("/vote",disputeController.vote)
router.post("/resolve-dispute",disputeController.resolveDispute)
router.get("/get-disputes",disputeController.getDispute);
module.exports=router;
