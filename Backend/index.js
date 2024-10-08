const express = require("express");
const connectDB = require("./config/db");
const router = require("./router");
require("dotenv").config();

const app = express();

app.use("/", router);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  console.log("DataBase Connected");
  app.listen(PORT, () => console.log(`Server started at ${PORT}`));
});
