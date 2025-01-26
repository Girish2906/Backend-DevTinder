const mongoose = require('mongoose') ; 
const url = "mongodb+srv://girishbhargava:BquG0D857Y1Eg80K@backenddecoded.2un9g.mongodb.net/" ; 

const connectDB = async () => {
    await mongoose.connect(url) ; 
}

module.exports = connectDB ;