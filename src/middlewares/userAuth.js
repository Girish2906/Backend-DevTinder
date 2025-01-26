const User = require('../models/User') ; 
const jwt = require('jsonwebtoken') ; 
const userAuth = async (req , res , next) => {
    try{
        const token = req.cookies.token ; 
        if(!token){
            throw new Error("Invalid Token") ; 
        }
        const decodedObj = await jwt.verify(token , "DEV@Tinder123") ; 
        const {_id} = decodedObj ; 
        const user = await User.findById(_id) ; 
        if(!user){
            throw new Error("User not found from auth.js middleWare") ; 
        }
        // console.log("this is the loggedInUser frmo userauth middleware" , user ) ; 
        req.user = user ; 
        next() ;
    } catch(Error){
        res.status(400).send("Error: " + Error.message) ;  
    }
} ; 

module.exports = userAuth ; 