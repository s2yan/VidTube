import { asyncHandler } from "../utils/AsyncHanndler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiErrorResponse } from '../utils/ApiErrorResponse.js'
import {User} from '../modules/user.modules.js'
import { uploadToCloudinary } from "../utils/cloudinary.js"


const generateRefreshAndAccessToken = async function( userId ){
    const user = await User.findById(userId)

    if( !user ){
        throw new ApiErrorResponse(404, "User not found")
    }

    const refreshToken = user.generateRefeshToken()
    const accessToken = user.generateAccessToken()

    user.refreshToken = refreshToken
    await user.save()

    return { refreshToken, accessToken }
}

const registerUser = asyncHandler( async (req, res) =>{
    // return res
    // .status(200)
    // .json(new ApiResponse(200, "OK", "Health check passed"))

    const { username, email, password } = req.body;
    
    if([username, email, password].some(field => field === "" )){
        return res
        .json(new ApiErrorResponse(400, "All fields are required"))
    }

    // validate password

    const validatePassword = function( password){
        if(password.length < 8){
            throw new ApiErrorResponse(401, "Password must be of 8 characters")
        }

        if(password.length > 16){
            throw new ApiErrorResponse(401, "Password must be with in 16 characters")
        }

        let isLownerCase = false;
        let isUpperCase = false;
        let isDigit = false;
        let isSpecialChar = false;

        for(let char of password){
            if(char >= 'a' && char <= 'z'){
                isLownerCase = true
            }
            else if( char >= 'A' && char <= 'Z'){
                isUpperCase = true
            }
            else if( char >= 0 && char <= 9){
                isDigit = true
            }
            else if( /[!@#$%&]/.test(char)){
                isSpecialChar = true
            }
        }

        if(!isLownerCase || !isUpperCase || !isDigit || !isSpecialChar){
            throw new ApiErrorResponse(401, "Password must contain atleast one lowercase, uppercase, digit and special character")
        }
    }

    // User validation

    const user = User.findOne({
        $or: [{email}, {username}]
    })

    if( user ){
        throw new ApiErrorResponse(401, "User already exists with same username or email")
    }

    const avatarLocalPath = req?.files?.avatar[0].path
    const coverImageLocalPath = req?.files?.coverImage[0]?.path

    if( !avatarLocalPath ){
        throw new ApiErrorResponse(401, "Avatar is a requied field")
    }

    let coverImage = "";
    const avatar = await uploadToCloudinary(avatarLocalPath)
    if( coverImageLocalPath ){
        coverImage = await uploadToCloudinary(coverImageLocalPath)
    }


    const newUser = await User.create({
        username,
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage.url || ""
    })
        
    const loggedUser = await User.findById(newUser._id).select("-password -refreshToken")

    if(!loggedUser){
        throw new ApiErrorResponse(500, "Something went wrong while creating the user")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, loggedUser, "User registered successfully")
        )
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if ([username, email, password].some(field => !field)) {
        throw new ApiErrorResponse(400, "Username, email & password are all required");
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (!user) {
        throw new ApiErrorResponse(401, "Invalid credentials");
    }

    const isPasswordMatching = await user.validatePassword(password);
    if (!isPasswordMatching) {
        throw new ApiErrorResponse(401, "Invalid credentials");
    }

    const { refreshToken, accessToken } = generateRefreshAndAccessToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true // process.env.NODE_ENV === "production",  
    };

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(200, { loggedInUser, accessToken, refreshToken }, "User logged in successfully")
        );
});

const logoutUser = asyncHandler( async(req, res) =>{
    await User.findByIdAndUpdate(
        req.user._id,{
            $set: {
                refreshToken: null
            },
            next: true
        }
    )

    const options = {
        httpOnly: true,
        secure : true
    }

    return res
        .status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"))
})

const refreshAndAccessToken = asyncHandler( async(req, res) => {
    const {refreshToken} = req.cookies

    if( !refreshToken ){
        throw new ApiErrorResponse(401, "Invalid Refresh Token")
    }

    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decodedToken._id).select("-password -refreshToken")

    const tokens = await generateRefreshAndAccessToken(user._id)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                {
                    user, 
                    refreshToken: tokens.refreshToken, 
                    accessToken: tokens.accessToken
                },
                "Tokens refreshed successfully"
            )
        )
})



export { registerUser , loginUser , refreshAndAccessToken, logoutUser }