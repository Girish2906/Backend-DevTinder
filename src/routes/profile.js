const express = require('express');
const profileRouter = express.Router() ; 
const userAuth = require('../middlewares/userAuth') ; 
const User = require('../models/User') ; 
const {validateEditProfile} = require('../utils/validateSignUp') ; 

profileRouter.get('/profile/view' , userAuth , async (req , res) => {
    try{
        const {_id} = req.user ; 
        console.log(req.user) ; 
        const user = await User.findById(_id) ; 
        res.send(user) ; 
    } catch(Error){
        res.status(400).send("Error!!" + Error.message) ; 
    }
}) ; 

profileRouter.put('/profile/edit' , userAuth , async (req , res) => {
    try{
        validateEditProfile(req.body) ; 
        const loggedInUser = req.user ; 
        // const user = await User.findById(loggedInUser._id) ; 
        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]) ; 
        const result = await loggedInUser.save() ; 
        res.status(200).json({
            message: "Profile Updated Successfully" , 
            data: result
        })
    } catch(Error){
        res.status(400).send("Error !!" + Error.message) ; 
    }
})

profileRouter.get('/getAllUsers' , userAuth , async (req , res) => {
    try{
        const users = await User.find({}).select("firstName lastName skills photoUrl") ; 
        res.status(200).json({message: "Users fetched successfully" , data: users}) ; 
    }catch(Error){
        res.status(400).send("Error: "+  Error.message) ; 
    }
})

module.exports = profileRouter ; 