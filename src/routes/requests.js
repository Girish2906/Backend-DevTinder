const express = require('express') ; 
const requestRouter = express.Router() ; 
const Connection = require('../models/Connection') ;  
const userAuth = require("../middlewares/userAuth") ; 
const User = require("../models/User") ; 
const sendEmail = require("../utils/sendEmail") ; 
requestRouter.post('/request/:status/:toUserId' , userAuth , async (req , res) => {
    try{
        const loggedInUser = req.user ; 
        const fromUserId = loggedInUser._id ; 
        const {status , toUserId} = req.params ; 
        const allowedStatus = ["interested" , "ignored"] ; 
        if( ! allowedStatus.includes(status)){
            throw new Error("Invalid status") ; 
        }
        const user = await User.findById(toUserId) ; 
        if(!user){throw new Error("User not found") ; }
        if(fromUserId.equals(toUserId)) {throw new Error("Can't send connection request to oneself")}
        const connectionRequestAlreadyExists = await Connection.find({
            $or: [
                {fromUserId , toUserId } , 
                { toUserId: fromUserId , fromUserId: toUserId  }
            ]
        }) ; 
        // console.log(connectionRequestAlreadyExists) ; 
        if(connectionRequestAlreadyExists.length) {throw new Error("Connection Request already exists") }
        const connectionRequest = await Connection({
            fromUserId: loggedInUser._id ,  toUserId , status
        }) ; 
        await connectionRequest.save() ; 
        const emailRes = await sendEmail.run() ; 
        // console.log(emailRes) ; 
        return res.status(200).json({
            message: `${status} successfully!!` , 
            from: `${loggedInUser.firstName} ${loggedInUser.lastName}` , 
            to: `${user.firstName} ${user.lastName}`, 
        }) ; 
        // console.log(user); 
    } catch(Error){
        res.status(400).send("Error: " + Error.message) ; 
    }
}) ; 

requestRouter.post('/request/review/:status/:requestId' , userAuth , async (req , res) => {
    try{
        const loggedInUser = req.user ; 
        const {status , requestId} = req.params ; 
        const allowedStatus = ["accepted" , "rejected"] ; 
        if(!allowedStatus.includes(status)){
            throw new Error("Invalid Status") ; 
        }
        const connectionRequest = await Connection.findOne({
            _id: requestId , 
            toUserId: loggedInUser._id , 
            status: "interested"   
        }) ; 
        if(!connectionRequest){
            throw new Error("Request not found") ; 
        }
        connectionRequest.status = status ;
        const data = await connectionRequest.save() ; 
        res.status(200).json({message: status + " successfully" , data: data}) ; 
    } catch(Error){
        res.status(400).send("Error: " + Error.message) ; 
    }
}) ; 

requestRouter.get('/getAllRequests' , userAuth , async (req , res) => {
    try{
        const requests = await Connection.find({}) ; 
        res.status(200).json({message: "All Requests fetched successfully" , data: requests}) ; 
    }catch(Error){
        res.status(400).send("Error: "+  Error.message) ; 
    }
})

module.exports = requestRouter ; 