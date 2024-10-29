const Dispute=require('../models/dispute')


exports.createDispute=async(req,res)=>{
    console.log(req.body);
    const {title,description1,description2}=req.body;
    const new_dispute=await Dispute.create({title,description1,description2});

    res.status(200).json({
        status: "success",
        message: "Dispute created successfully",
      });
  
}

exports.getDispute=async(req,res)=>{
    const disputes=await Dispute.find();
    res.status(200).json({
        status: "success",
        data:disputes,
        message: "Disputes fetched successfully",
      });
}
exports.stakeTokens=async(req,res)=>{
    const {id,pubKey,token}=req.body;
    console.log(req.body);
    const dispute=await Dispute.findById(id); 
    console.log(dispute);
    const tokenAmount=Number(token);
    dispute.StakedTokens.push({pubKey,token:tokenAmount});
    dispute.TotalStakedTokens+=tokenAmount;
    await dispute.save();
    res.status(200).json({
        status: "success",
        message: "Dispute updated successfully",
      });
}

exports.assignVoters=async(req,res)=>{
  const {Voters,id}=req.body;
  console.log(req.body);
  const dispute =await Dispute.findById(id);
  if(!dispute){ 
    res.status(400).json({
      message:"No dispute found !"
    })
  }
  dispute.VotersAssigned=true;
  dispute.Voters=Voters;
  await dispute.save();
  res.status(200).json({ 
    status: "success",
    message: "Voters added successfully",
  });
}

exports.vote=async(req,res)=>{
  const {id,pubKey,voted}=req.body;
  console.log(req.body);
  const dispute =await Dispute.findById(id);
  if(!dispute){ 
    res.status(400).json({
      message:"No dispute found !"
    })
  }
  dispute.Votes.push({pubKey,voted});
  await dispute.save();
  res.status(200).json({
    status: "success",
    message: "Voted  successfully",
  });
}

exports.resolveDispute=async(req,res)=>{
  const {id,Results,winner}=req.body;
  console.log(req.body);
  const dispute =await Dispute.findById(id);
  if(!dispute){ 
    res.status(400).json({
      message:"No dispute found !"
    })
  }
  dispute.Result=Results;
  dispute.won=winner;
  dispute.Closed=true;
  await dispute.save();
  res.status(200).json({
    status: "success",
    message: "Resolved  successfully",
  });
}