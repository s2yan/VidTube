import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({path : "./src/.env"});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (filePath) => {
    try {
        if (!filePath) {
            throw new Error('File path is required');
        }

        if (!fs.existsSync(filePath)) {
            throw new Error('File does not exist');
        }

        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto'
        });

        // Clean up the temporary file
        fs.unlinkSync(filePath);
        
        return response;
    } catch (error) {
        // Safely clean up file if it exists
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
}

const deleteFromCloudinary = async (publicId) =>{
    try{

        const result = await cloudinary.uploader.destroy(publicId)
        console.log("Media deleted successfully")

    }catch(err){
        console.log(err)
        return null
    }
}

export { uploadToCloudinary , deleteFromCloudinary}