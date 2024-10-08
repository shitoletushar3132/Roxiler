require("dotenv").config();
const mongoose = require("mongoose");
const MONGODBURI = process.env.DATABASE_URL;

const connectDB = async () => {
  await mongoose.connect(MONGODBURI);
};

module.exports = connectDB;
