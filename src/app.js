// require("dotenv").config();
const express = require('express'); 
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser') ;
const app = express() ; 
const cors = require('cors') ; 
const http  = require("http");
// const server = require("socket.io");
require('dotenv').config();
require('dotenv').config({ path: './src/.env' });

console.log("process. env ",process.env) ; 
app.use(cors({
    origin: "http://localhost:5173" , 
    credentials: true
})) ; 
app.use(express.json()) ; 
app.use(cookieParser()) ; 

const authRouter = require("./routes/auth") ; 
const profileRouter = require("./routes/profile") ; 
const requestRouter = require("./routes/requests") ; 
const userRouter = require("./routes/user") ; 
const initializeSocket = require('./utils/socket');
app.use("/" , authRouter) ; 
app.use("/" , profileRouter) ; 
app.use("/" , requestRouter) ; 
app.use("/" , userRouter) ; 

const server = http.createServer(app) ; 
initializeSocket(server) ; 

connectDB()
    .then(() => {
        console.log("Connection to the database established successfully") ; 
        server.listen(process.env.PORT , () => {
            console.log("server is listening on port 3000") ; 
        })

    }).catch((err) => {
        console.error("Database cannot be connected") ; 
    })