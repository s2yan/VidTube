import mongoose, { Schema } from 'mongoose'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config({ path: "./src/.env"})

const userSchema = new Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email:{
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password:{
            type: String,
            required: [true, "Passsword is required"],
            trim: true
        },
        avatar:{
            type: String, //cloudinary url
            required: true
        },
        coverImage: {
            type: String //cloudinary url
        },
        videos:{
            type: Schema.Types.ObjectId,
            ref: 'Video'
        },
        refreshToken:{
            type: String
        }

    },
    {timestamps: true}
)

userSchema.pre('save', async function(next){
    try {
        if(this.isModified("password")){
            this.passwod = await bcrypt.hash(this.password, 10)
        }
        next()
    } catch (error) {
        console.log(error.message)
        next(error)
    }
})

userSchema.methods.validatePassword = async function(userPassword){
    return await bcrypt.compare(this.password, userPassword)
}

userSchema.methods.generateRefeshToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            username: this.username,
            email: this.email
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    )
}

userSchema.methods.generateAccessToken = function(){

    return jwt.sign(
        {_id: this._id},
        process.env.ACCESSTOKEN_SECRET,
        {expiresIn: process.env.ACCESSTOKEN_EXPIRY}
    )

}
export const User = mongoose.model("User", userSchema)