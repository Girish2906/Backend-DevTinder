const validator = require('validator') ; 

const validateSignUp = (body) => {
    console.log("inside the validate Sign up",body) ; 
    const {firstName , lastName , email , password , gender} = body ; 
    if(!firstName || !lastName || !email || !password || !gender){
        throw new Error("Please enter all fields") ; 
    }else if(!validator.isEmail(email)){
        throw new Error("Please enter a valid email") ; 
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password") ; 
    }
    console.log("does it reach here") ; 
    return true ; 
} ; 

const validateEditProfile = (reqBody) => {
    const allowedFields = ["firstName" , "lastName" , "skills" , "photoUrl"] ; 
    const requestKeys = Object.keys(reqBody) ; 
    for(let req of requestKeys){
        if(allowedFields.includes(req)){
           continue ;  
        }
        throw new Error("Update not allowed for certain fields") ; 
    }
    return true ; 
}

module.exports = {validateSignUp , validateEditProfile} ; 