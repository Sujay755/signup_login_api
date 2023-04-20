require('dotenv').config();

const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

//My route
const authRoutes = require("./route/auth");

//Middlewears

app.use(cors());
app.use(cookieParser());
app.use(express.json());

//DB connection

mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE)
.then(()=>{
    console.log('DB CONNECTED');
})

//ROUTE
app.use("/api",authRoutes);


//PORT

const port = process.env.PORT || 5000;

//server

app.listen(port, ()=>{
    console.log(`app is running at ${port}`);
})