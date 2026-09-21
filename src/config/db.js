import mongoose from "mongoose";

const connectDB = async()=>{
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log ("database connected sucessfully");

    }catch(err){
        console.log('database connection error', err.message);

    }
};
export default connectDB