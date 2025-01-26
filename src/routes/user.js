const express = require('express') ; 
const userRouter = express.Router() ; 
const Connection = require('../models/Connection') ; 
const userAuth = require("../middlewares/userAuth") ;
const User = require("../models/User") ; 

userRouter.get('/requests' , userAuth , async (req , res) => {
    try{
        const loggedInUser = req.user ; 
        const pendingConnections = await Connection.find({
            toUserId: loggedInUser._id , 
            status: "interested"
        }).populate("fromUserId" , "firstName lastName skills photoUrl gender")
        res.status(200).json({message: "Fetched Successfully" , data: pendingConnections}) ;
    } catch(Error){
        res.status(400).send("Error: " + Error.message) ; 
    }
}) ;  

userRouter.get('/friends', userAuth  ,async (req , res) => {
    try{
        console.log("friend API !#$!#$#$!") ; 
        const loggedInUser = req.user ; 
        // console.log(24 , loggedInUser._id , loggedInUser._id.toString()) ; 
        const fromUserId = loggedInUser._id ; 
        const  friends = await Connection.find({
            $or: [
                {toUserId: fromUserId , status: "accepted" } , 
                {fromUserId: loggedInUser._id ,  status: "accepted"} , 
            ]
        })
        .populate("toUserId", "firstName lastName gender skills photoUrl")
        .populate("fromUserId", "firstName lastName gender skills photoUrl");
        // res.send(friends) ; 
        console.log("these are teh friends",friends) ; 
        const data = friends.map(friend => {
            // console.log(fromUserId) ; 
            console.log("these are the 2 IDs",friend._id.toString()  ,  loggedInUser._id.toString()) ; 
            if(friend.fromUserId._id.toString() === loggedInUser._id.toString()){
                console.log("it it checking this thing") ; 
                return friend.toUserId ; 
            } return friend.fromUserId ; 
            // if(friend.fromUserId.toString() === loggedInUser._id.toString()){
            //     console.log("it it checking this thing") ; 
            //     return friend.toUserId ; 
            // } return friend.fromUserId ; 
        }) ; 
        // console.log(data) ; 
        res.send(data) ; 
        // res.status(200).json({message: "Fetched Successfully" , data: data}) ; 
        // res.status(200).json({message: "Fetched Successfully" , data: friends}) ; 
    } catch(Error){
        res.status(400).send("Error: " + Error.message) ; 
    }
}) ; 

userRouter.get('/feed' , userAuth , async (req , res) => {
    try{
        const loggedInUser = req.user ; 
        const page = +(req.query.page) || 1 ; 
        let limit = +(req.query.limit) || 10 ; 
        console.log(limit) ; 
        limit = limit > 50 ? 50 : limit ; 
        const skip = (page - 1) * limit ; 
        console.log(skip , limit) ;  
        const sentOrReceivedRequests = await Connection.find({
            $or: [
                {toUserId: loggedInUser._id} , 
                {fromUserId: loggedInUser.id}
            ]
        }).select("fromUserId toUserId")
        const hideFromUserFeed = new Set() ; 
        sentOrReceivedRequests.map(request => {
            hideFromUserFeed.add(request.fromUserId.toString()) ; 
            hideFromUserFeed.add(request.toUserId.toString()) ; 
        }) ; 
        const feedToBeShown = await User.find({
            $and: [
                {_id: {$nin: Array.from(hideFromUserFeed)}} , 
                {_id: {$ne: loggedInUser._id} }
            ]
        }).select("firstName lastName skills photoUrl gender").skip(skip).limit(limit) ; 
        res.status(200).json({message: "Data fetched successfully" , data: feedToBeShown});
    } catch(Error){
        res.status(400).send("Error: " + Error.message) ; 
    }
}) ; 

module.exports = userRouter ; 