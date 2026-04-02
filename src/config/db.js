const mongoose=require('mongoose');
const connectDB= async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to mongodb");
    } catch (error) {
        console.log("Mongodb connection failed", error.message);
        throw error;
    }
}

module.exports=connectDB;

