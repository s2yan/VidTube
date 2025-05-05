import { asyncHandler } from "../utils/AsyncHanndler.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const registerUser = asyncHandler( async (req, res) =>{
    return res
    .status(200)
    .json(new ApiResponse(200, "OK", "Health check passed"))
})

export { registerUser }