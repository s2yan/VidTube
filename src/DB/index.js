import mongoose from 'mongoose'
const DB_Name = "VidTube"

const connectDB = async () =>{
    try{
        const connectionInstace = await mongoose.connect(`${process.env.MONGO_URI}/${DB_Name}`)
        console.log(`Connected with DB succesfully: ${connectionInstace.connection.host}`)
    }catch(err){
        console.log(`Connection error: ${err.message}`)
    }   
}

export { connectDB }