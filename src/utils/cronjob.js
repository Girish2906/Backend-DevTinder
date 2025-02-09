const cron = require('node-cron');
const {subDays , startOfDay , endOfDay} = require('date-fns') ; 
const ConnectionSchema = require('../models/Connection') ;  
const {yesterdayEnd , yesterdayStart} = require('date-fns') ; 

console.log("cronjob") ;
cron.schedule("31 6  * * *" , async  () => {
    console.log("inside cron.schedule") ;
    try{
        const today = subDays(new Date() , 0) ; 
        const yesterdayStart = startOfDay(today) ; 
        const yesterdayEnd = endOfDay(today) ; 
        const pendingRequests = await ConnectionSchema.find({
            status: "interested" , 
            createdAt: {
                 $gte: yesterdayStart,
                 $lt: yesterdayEnd , 
            } , 
        }).populate("fromUserId toUserId") ; 
        const listOfEmails = [...new Set(pendingRequests.map(req => req.toUserId.emailId))] ; 
        console.log(15 , listOfEmails) ; 
    } catch(Error){
        console.log(Error) ; 
    }
}) ; 

// module.exports = cron ; 