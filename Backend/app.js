

const express=require("express");
const morgan=require("morgan");
const cors=require("cors");
const bodyParser=require("body-parser");
const app=express();

const routes=require("./routes/index");



app.use(cors({
    origin:"*",
    methods:["GET","PATCH","POST","DELETE","PUT"],
    credentials:true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}


 

app.use(express.urlencoded({
    extended:true,
}));

app.use(routes);


module.exports=app; 
