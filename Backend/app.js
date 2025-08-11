require("dotenv").config();
const HoldingsModel = require("./model/Holdingmodel")
const user = require("./model/usersmodel")
const mongoose = require("mongoose")
const express = require("express");
const app = express();
const db = require('./configdb/db');
const userroutes = require('./router/userroutes');
const cors = require('cors')
app.use(cors({}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3002;
const url = process.env.MONGO_URL;
console.log("uriiiiii", url)
console.log(PORT)
db();



app.get('/health', (req, res) => res.send('OK'));
app.use('/stockfolio', userroutes);
app.listen(PORT, () => {
  console.log("App started!");
  // mongoose.connect(uri);
  // console.log("DB sta  rted!");
});
