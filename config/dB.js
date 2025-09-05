import mongoose from "mongoose";

const connectDB = async ()=>{

    // const MONGODB_URL="mongodb://127.0.0.1:27017/trail-test"

    try {
        mongoose.connection.on('connected', ()=>{
        console.log("Database Connected");
    });

    await mongoose.connect(`${process.env.MONGODB_URL}`);
    } catch (error) {
        console.log(error.message, ": Check mongoDb connection and also check your Internet connection!!!")
    }
    
}

export default connectDB;
