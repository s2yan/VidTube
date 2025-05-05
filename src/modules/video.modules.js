import mongoose, { Schema } from 'mongoose'

const videoSchema = new Schema(
    {
        title:{
            type: String,
            required: true,

        },
        description:{
            type: String,
            required: true
        },
        comments:{
            type: Schema.Types.ObjectId,
            ref: "Comment"
        },
        likes:{
            type: Schema.Types.ObjectId,
            ref: "Like"
        },
        thumbnail:{
            type: String //cloudinary url
        },
        owner:{
            type: Schema.Types.ObjectId,
            ref: "User"
        }

    },
    {timestamps: true}
)

export const Video = mongoose.model("Video", videoSchema)