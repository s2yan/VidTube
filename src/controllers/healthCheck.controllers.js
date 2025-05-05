import {ApiResponse} from '../utils/ApiResponse.js'
import {ApiErrorResponse} from '../utils/ApiErrorResponse.js'
import {asyncHandler} from '../utils/AsyncHanndler.js'

const healthCheck = asyncHandler( async(req, res) =>{
    return res
    .status(200)
    .json(new ApiResponse(200, "OK", "Health check passed"))
})

export {healthCheck}