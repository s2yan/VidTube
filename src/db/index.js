import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './src/.env' });
const DB_Name = process.env.DB_NAME 

const connectDB = async () =>{
    try{
        //console.log(`MongoDB URI: ${process.env.MONGO_URI}/${DB_Name}/${process.env.PORT}`)
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_Name}`)
        console.log(`MongoDB connected successfully: ${connectionInstance.connection.host}`)

    }catch(error){
        console.log("MongoDB connection error :", error);
        process.exit(1);
    }
}

export default connectDB;