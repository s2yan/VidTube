import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';

const userSchema = new Schema({
    fullname:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unqiue: true,
    },
    username:{
        type: String,
        required: true,
        unqiue: true,
        index: true,
    },
    avatar:{
        type: String, //cloudinary url
        required: true,
    },
    coverImage:{
        type: String,
    },
    watchHostiry:[{
        type: Schema.Types.ObjectId,
        ref: "Video"
    }],
    password:{
        type: String,
        required: [true, "Password is required"],
    },
    refreshToken:{
        type: String,
    }

},
{
    timestamps: true,
})

userSchema.pre('save', async function (next){
    if(!this.isModified('password')){
        return next()
    }
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.methods.isPasswordMatching = async function( password ){
    return await bcrypt.compare(password, this.password)
}

//Generating a refresh token & access token when user logs in / signs in using JWT - JSON Web Token
userSchema.methods.generateRefreshToke = function(){
    return JWT.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESHTOKEN_EXPIRES_IN,
        }
    )
}

//Generate a action token
userSchema.mothods.generateAccessToken = function() {
    return JWT.sign(
        {
            _id: this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESSTOKEN_EXPIRES_IN}
    )
}



export const User = mongoose.model('User', userSchema)