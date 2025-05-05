import mongoose, { Schema } from 'mongoose'
import jwt from 'jsonwebtoken'


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

export const User = mongoose.model("User", userSchema)