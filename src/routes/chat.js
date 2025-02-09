const express = require("express") ; 
const chatRouter = express.Router() ; 
const Chat = require("../models/Chat") ; 
const userAuth = require("../middlewares/userAuth") ; 
chatRouter.get("/chat/:targetUserId" , userAuth , async (req , res) => {
    console.log("chat request") ; 
    try{
        const userId = req.user._id ; 
        const {targetUserId} = req.params ; 
        console.log(userId) ; 
         let chat = await Chat.findOne({
            participants: {
                $all: [userId , targetUserId]
            }
        }).populate({
            path: "messages.senderId" , 
            select: "firstName lastName"
        })  ; 
         if(!chat){
            chat = new Chat({
                participants: [userId , targetUserId] , 
                messages: [], 
            }) ; 
            await chat.save() ; 
        }
        res.json(chat) ; 
    } catch(Error){
        console.log(Error.message) ; 
    }
}) ; 

module.exports = chatRouter ; 