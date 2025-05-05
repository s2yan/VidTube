import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_SECRET,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadToCloudinary = async (localFilePath) =>{
    try{
        const cloudinaryResponse = cloudinary.uploader.upload(
            localFilePath,
            { resource_type : "auto"}
        )
        console.log("File uploaded successfully, file path: " + cloudinaryResponse)
        fs.unlinkSync(localFilePath)
    }catch(error){
        console.log("Error adding file to cloudinary: " + error.message)
        fs.unlinkSync(localFilePath)  
    }
}

export { uploadToCloudinary }

