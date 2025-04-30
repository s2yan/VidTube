import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config(
    {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }
)

const uploadToCloudinary = async(filePath) =>{
    try{
        if(!filePath) return;
        const res = await cloudinary.uploader.upload(filePath,{ ressource_type: 'auto'}).catch((error) =>{
            console.log("Cloudinary upload error: ", error)
        })
        fs.unlinkSync(filePath)
        return res.url

    }catch(error){
        fs.unlinkSync(filePath)
    }
}


export { uploadToCloudinary }