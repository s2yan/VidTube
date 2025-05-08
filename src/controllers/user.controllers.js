import {asyncHandler} from '../utils/asyncHandler.js';
import { User } from '../modules/user.modules.js';
import { apiErrorResponse } from '../utils/apiErrorResponse.js';
import { uploadToCloudinary , deleteFromCloudinary} from '../utils/cloudinary.js';
import { apiResponse } from '../utils/apiResponse.js';
import JWT from "jsonwebtoken"


const generateAccessAndRefreshToken = async function(userId){
    try {
        const user = await User.findOne(userId)
        if(!user){
            throw new apiErrorResponse("User not found", 401)
        }
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToke()
    
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
    
        return { accessToken, refreshToken}
    } catch (error) {
        console.log(error.message)
        throw new apiErrorResponse("Something went wrong while generating access and refresh token", 500)
    }
}

const registerUser = asyncHandler( async(req, res) =>{
    //res.send("User registered endpoint running")

    const { fullname, email, username, password } = req.body;

    if([fullname, email, username, password].some(fields => fields.trim() === "")){
        throw new apiErrorResponse("All fields are required", 400)
    }


    const checkPasswordStrength = (password) =>{
        if(password.length < 8){
            throw new apiErrorResponse("Password must be 8 charcters long", 401)
        }
        if(password.length > 16){
            throw new apiErrorResponse("Password must be less that 16 characters", 401)
        }

        let hasLowerCase = false
        let hasUpperCase = false
        let hasDigit = false
        let hasSpecialChar = false

        for(let i=0; i<password.length; i++){
            let char = password[i]

            if(char >= 'a' && char <='z'){
                hasLowerCase = true
            }else if(char >= 'A' && char <= 'Z'){
                hasUpperCase = true
            }else if( char >= 0 && char <= 9){
                hasDigit = true
            }else if (/[^a-zA-Z0-9]/.test(char)) {
                hasSpecialChar = true;
            }
            

            if(!(hasSpecialChar && hasDigit && hasLowerCase && hasUpperCase)){
                throw new apiErrorResponse("Password must contain a lownercase, a uppercase, a digit, a special char", 401)
            }

            return true
        }
    }

    checkPasswordStrength(password)

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
    
    try {
        
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

    } catch (error) {
        console.log(error)
        if(avatar){
            deleteFromCloudinary(avatar.public_id)
        }

        if(coverImage){
            deleteFromCloudinary(coverImage.public_id)
        }
        throw new apiErrorResponse("Something went wrong while creating User!!! Media files also deleted", 500)
    }
    
})


const loginUser = asyncHandler( async(req, res) =>{
    const { email, password, username} = res.body

    if([email, password, username].some(field => field.trim() === "")){
        throw new apiErrorResponse("All the fields are required for user login", 401)
    }

    const user = await User.findOne({
        $or:[{email}, {username}]
    })
    if(!user){
        throw new arpiErrorResponse("No user found", 404)
    }
    
    //check if password is valid or not
    const isPasswordValid = await user.isPasswordMatching(password)
    if(!isPasswordValid){
        throw new apiErrorResponse("Not a valid password", 401)
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    const loggedInUser = await User.findOne(user._id)

    const options = {
        httpOnly: true,
        secure: true // process.env.NodeEnv === "production"
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json( new apiResponse(
            200,
            {user: loggedInUser, accessToken, refreshToken},
            "User created successfully"
        ))


})

const logoutUser = asyncHandler( async(req, res) => {

}) 

const AccessRefreshToken = asyncHandler( async(req, res) =>{
    const incommingRefreshToken = req.cookie.refreshToken || req.body.refreshToken

    if(!incommingRefreshToken){
        throw new apiErrorResponse("Refresh token not found", 401)
    }

    try {
        const decodeToken  = JWT.verify(
            incommingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodeToken?._id)
        if(!user){
            throw new apiErrorResponse("Invalid refresh token", 401)
        }

        if(incommingRefreshToken !== user.refreshToken){
            throw new apiErrorReponse("Invalid refresh token", 401)
        }

        const { accessToken, refreshToken: newRefreshToken } = 
        await generateAccessAndRefreshToken(user._id)

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookies("accessToken", accessToken, options)
            .cookies("refreshToken", refreshToken, options)
            .json( new apiResponse(
                200,
                {accessToken, refreshToken},
                "Access token refreshed succsessfully using Refresh token"
            ))

    } catch (error) {
        throw new apiErrorResponse("Something went wrong while generating access and refresh token")
    }
})

export { registerUser, loginUser, AccessRefreshToken}