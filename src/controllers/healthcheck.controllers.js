import { asyncHandler } from '../utlis/asyncHandler.js';
import apiResponse from '../utlis/apiResponse.js';

const healthCheck = asyncHandler( async(req, res) =>{
    res.status(200).json(new apiResponse(200, "OK", "Health check successful"))
})

export default healthCheck;