const mongoose = require('mongoose') ; 
const JWT = require("jsonwebtoken") ; 
const validator = require('validator') ; 
const userSchema = new mongoose.Schema({
    firstName: {
        type: String , 
        required: true , 
    } , 
    lastName : {
        type: String ,  
        lastName: true , 
    } , 
    email: {
        type: String , 
        required: true , 
        unique: true , 
    } , 
    password: {
        type: String , 
        required: true
    } , 
    photoUrl: {
        type: String , 
        validate: {
            validator: function(v){
                if( ! validator.isURL(v)){
                    throw new Error("Invalid photo Url") ; 
                }
            }
        }
    } , 
    gender: {
        type: String , 
        required: true , 
        enum: ["male" , "female" , "others"] , 
    } , 
    skills: {
        type: [String] ,   
        validate: {
            validator: function(v){
                if(v.length > 5){
                    throw new Error("You can enter maximum 5 skills") ; 
                } 
            }
        }
    }
} , {
    timestamps: true
}) ; 



module.exports = mongoose.model("User" , userSchema) ; 
