
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
 owner:{
    type:String,
    required:true,
 },
});

const Dispute = new mongoose.model(
  "Dispute",
  disputeSchema
);

module.exports = Dispute;
