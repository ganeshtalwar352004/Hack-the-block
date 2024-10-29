const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });


process.on("uncaughtException", (err) => {
  console.log(err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  server.close();
});

const http = require("http");
const server = http.createServer(app);


const DB = process.env.DBURI.replace("<db_password>", process.env.DBPASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    console.log("DB connection is succesfull");
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

