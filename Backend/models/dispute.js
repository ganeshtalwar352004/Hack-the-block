
const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema({
 title:{
    type:String,
    required:true,
 },
 description1:{
    type:String,
    required:true,
 },
 description2:{
    type:String,
    required:true,
 },
 TotalStakedTokens:{
    type:Number,
    default:0,
 },
 StakedTokens:[{
    pubKey:{
        type:String,
        set: (v) => v.toLowerCase(),
    },
   token:{
    type:Number,
    default:0,
   },
 }],
 VotersAssigned:{
   type:Boolean,
   default:false
 },
 Closed:{
   type:Boolean,
   default:false
 },
 won:{
    type:String,
    enum:['1','2'],
 }, 
 Result:[{
   juror:{
      type:String,
      set: (v) => v.toLowerCase(),
   },
   amount:{
      type:String,
   }
 }],
 Voters:[{
          pubKey:{
            type:String,
            set: (v) => v.toLowerCase(),
          },
          weight:{
            type:Number 
          }
       }],
 Votes:[{
    pubKey:{
        type:String,
        set: (v) => v.toLowerCase(),
    },
    voted:{
        type:Number,
        enum:[1,2],
    }
 }]
});

const Dispute = new mongoose.model(
  "Dispute",
  disputeSchema
);

module.exports = Dispute;
