import mongoose, { Schema } from 'mongoose'

const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        commentOwner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        commentedOnVideo: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        commentedOnTweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet"
        }

    },
    { timestamps : true}
)

export const Comment = mongoose.model("Comment", commentSchema)