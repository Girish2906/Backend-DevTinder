const socket = require("socket.io") ; 
const crypto = require("crypto") ; 
const Chat = require("../models/Chat") ; 
const getSecretRoomId = (({userId , targetUserId}) => {
    return crypto
        .createHash("sha256")
        .update([userId , targetUserId].sort().join("_"))
        .digest("hex") ; 
}) ; 

const initializeSocket  = (server) => {
    const io = socket(server , {
        cors: {
            origin: "http://localhost:5173" 
        }
    }) ; 
    io.on("connection" , (socket) => {
        //handle socket connections 
        socket.on("joinChat", ({firstName , userId , targetUserId}) => {
            console.log("these are the 2 userIds" , userId , targetUserId) ; 
            const roomId = [userId , targetUserId].sort().join('_') ; 
            console.log(roomId) ; 
            socket.join(roomId) ; 
        }) ;  
        
        socket.on("sendMessage" , async ({firstName , lastName , userId , targetUserId , text}) => {
            const roomId = [userId , targetUserId].sort().join('_') ; 
            console.log(firstName + " " + text) ; 
            try{
                let chat = await Chat.findOne({
                    participants: {
                        $all: [userId , targetUserId]
                    }
                }) ; 
                if(!chat){
                    chat = new Chat({
                        participants: [userId , targetUserId] , 
                        messages: [], 
                    }) ; 
                }
                chat.messages.push({
                    senderId: userId , 
                    text,
                }) ; 
                await chat.save() ; 
                io.to(roomId).emit("messageReceived" , {firstName , lastName , text}) ; 
            } catch(error){
                console.log(error) ; 
            }
            // io.to(roomId).emit("messageReceived" , {firstName , text}) ; 
        }) ;
        
        socket.on("disconnect" , () => {}) ;
    }) ; 
} ; 

module.exports = initializeSocket ;  