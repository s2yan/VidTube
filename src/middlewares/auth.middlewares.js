import { ApiErrorResponse } from "../utils/ApiErrorResponse.js";
import { asyncHandler } from '../utils/AsyncHanndler.js';
import { User } from '../modules/user.modules.js'
import jwt from 'jsonwebtoken';

const jwtVerify = asyncHandler( async (req, res, next) =>{
    const accessToken = req.cookies.accessToken || req.header["authorize"].replace("Bearer ", "")

    if(!accessToken){
        throw new ApiErrorResponse(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken._id).select("-password - refreshToken")
        
        if( !user ){
            throw new ApiErrorResponse(401, "Unautorized request")
        }
    
        req.user = user
        next()

    } catch (error) {
        throw new ApiErrorResponse(401, "Invalid User access Token")
    }
})

export { jwtVerify }