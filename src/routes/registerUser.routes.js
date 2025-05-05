import { Router} from "express"
import { registerUser } from '../controllers/registerUser.js'
import { upload } from "../controllers/multer.controllers.js"

const router = Router()

router.route("/").post(upload.fields(
    [{name: "avatar", maxCount: 1}, 
    {name: "coverImage", maxCount: 1}]) 
, registerUser)

export default router