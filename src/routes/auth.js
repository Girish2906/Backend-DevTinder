const express = require('express') ; 
const authRouter = express.Router() ; 
const bcrypt = require('bcrypt') ; 
const {validateSignUp} = require('../utils/validateSignUp') ; 
const User = require('../models/User') ; 
const jwt = require('jsonwebtoken') ; 


authRouter.post('/signUp' , async (req , res) => {
    try{
        // console.log(9 , "signUp API" , req.body) ; 
        const val = validateSignUp(req.body) ; 
        // console.log("req.body", val) ; 
        const {firstName , lastName , email , password , gender , skills , photoUrl} = req.body ; 
        const passwordHash = await bcrypt.hash(password , 10) ; 
        const user = new User({firstName , lastName , email , password: passwordHash , gender , skills ,  photoUrl}) ; 
        const savedUser = await user.save() ; 
        res.status(201).json({message: "User Saved Successfully" , data: savedUser})
    } catch(Error){
        res.status(400).send("Invalid Request auth.js routes folder signUp request: " + Error.message) ; 
    }
}) ; 

authRouter.post('/login' , async (req , res) => {
    try{
        const {email , password} = req.body ; 
        const user = await User.findOne({email : email}) ; 
        if(!user){
            return res.status(404).send("User not found") ; 
        }
        const loginCredentials = await bcrypt.compare(password , user.password) ; 
        if(!loginCredentials){
            return res.status(400).send("Invalid Credentials") ; 
        }
        const token = jwt.sign({_id : user._id} , "DEV@Tinder123" , {
            expiresIn: "1d" , 
        } ) ; 
        res.cookie("token" , token) ; 
        res.status(200).json({data: user}) ; 
    } catch(Error){
        res.status(400).send("Invalid Request auth.js routes folder login request" + Error.message) ;  
    }
}) ; 

authRouter.post('/logout' , async (req , res) => {
    res.cookie("token" , null , {
        expires: new Date(Date.now())
    }) ; 
    res.send("Logged out successfully!") ; 
}) ; 

authRouter.post('/forgotPassword' , async (req , res) => {
    try{
        const {email , password} = req.body ; 
        console.log(email , password); 
        if(!email)
            throw new Error("Please enter your email address") ; 
        const user = await User.findOne({email: email}) ; 
        if(!user){
            throw new Error("Please enter email correctly") ; 
        }
        const passwordHash = await bcrypt.hash(password , 10) ; 
        user.password = passwordHash ; 
        await user.save() ; 
        res.status(200).send("Password Updated Succcessfully!") ; 
    } catch(Error){
        res.status(400).send("Invalid request : " + Error.message) ; 
    }
}) ; 


module.exports = authRouter ; 