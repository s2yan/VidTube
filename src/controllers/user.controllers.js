import {asyncHandler} from '../utils/asyncHandler.js';
import { User } from '../modules/user.modules.js';
import { apiErrorResponse } from '../utils/apiErrorResponse.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { apiResponse } from '../utils/apiResponse.js';

const registerUser = asyncHandler( async(req, res) =>{
    //res.send("User registered endpoint running")

    const { fullname, email, username, password } = req.body;
    const avatarPath = req?.files?.avatar[0].path
    const coverImagePath = req?.files?.coverImage[0]?.path

    // validate existing user
    const existingUser = await User.findOne({email} || {username});

    if(existingUser){
        throw new apiErrorResponse("User already exisits with thie email or password", 400)
    }

    //validate avatar and cover image
    if(!avatarPath){
        throw new apiErrorResponse("Please upload an avatar", 400)
    }

    const avatar = await uploadToCloudinary(avatarPath)
    let coverImage = ""
    if(coverImagePath){
        coverImage = await uploadToCloudinary(coverImagePath)
    } 
    
    

    // create user
    const user = await User.create({
        fullname,
        email,
        username: username.toLowerCase(),
        password,
        avatar: avatar.url,
        coverImage: coverImage.url || "",
    })

    // If user is created successfully, send a response

    const createdUSer = await User.findOne(user._id).select("-password -refreshToken")
    if(!createdUSer){
        throw new apiErrorResponse("Something went wrong!!! User not created", 500)
    }

    return res.status(201).json(new apiResponse(201, "User created successfully"))
})

export { registerUser }