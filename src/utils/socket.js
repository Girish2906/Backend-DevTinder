const socket = require("socket.io") ; 
const crypto = require("crypto") ; 
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
        
        socket.on("sendMessage" , ({firstName , userId , targetUserId , text}) => {
            const roomId = [userId , targetUserId].sort().join('_') ; 
            console.log(firstName + " " + text) ; 
            io.to(roomId).emit("messageReceived" , {firstName , text}) ; 
        }) ;
        
        socket.on("disconnect" , () => {}) ;
    }) ; 
} ; 

module.exports = initializeSocket ;  