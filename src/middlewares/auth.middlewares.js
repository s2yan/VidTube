import { User } from '../modules/user.modules.js';
import { apiErrorResponse } from '../utils/apiErrorResponse.js';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';

const jwtVerify = asyncHandler( async( req, _, next) => {
    const accessToken = req.cookies.accessToken || req.header['authorization'].replcae('Bearer ', '');

    if( !accessToken ){
        throw new apiErrorResponse(401, "Access token not found")
    }

    try{
        const decodedToken = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken._id).select("-password -refreshToken")
        if( !user ){
            throw new apiErrorResponse(404,"User not found")
        }

        req.user = user 
        next()

    }catch(error){
        throw new apiErrorResponse(401, error?.message || "Invalid access token")
    }
})


export { jwtVerify }