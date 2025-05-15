import { Router} from "express"
import { registerUser, logoutUser } from '../controllers/registerUser.js'
import { upload } from "../middlewares/multer.middlewares.js"
import { jwtVerify } from '../middlewares/auth.middlewares.js'
const router = Router()

router.route("/register").post(upload.fields(
    [{name: "avatar", maxCount: 1}, 
    {name: "coverImage", maxCount: 1}]) 
, registerUser)

//Secure routes
router.route("/logout").post(jwtVerify, logoutUser)

export default router