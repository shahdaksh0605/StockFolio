require("dotenv").config();

const user = require("./model/usermodel")
const mongoose = require("mongoose")
const express = require("express");
const app = express();



const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

app.listen(PORT, () => {
  console.log("App started!");
  mongoose.connect(uri);
  console.log("DB started!");
});
