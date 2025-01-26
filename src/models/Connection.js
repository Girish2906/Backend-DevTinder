const mongoose = require('mongoose') ; 

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId ,  
        required: true , 
        ref: "User"
    } , 
    toUserId: {
        type: mongoose.Schema.Types.ObjectId , 
        required: true , 
        ref: "User"
    } , 
    status: {
        type: String , 
        required: true , 
        enum: ["pending" , "ignored" , "accepted" , "interested" , "rejected"] 
    }
}) ; 

module.exports = new mongoose.model("ConnectionSchema" , connectionRequestSchema) ; 