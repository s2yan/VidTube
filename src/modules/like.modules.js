import mongoose, { Schema }  from "mongoose"

const likeSchema = new Schema( 
    {
        likedBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        likedOnVideo: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        likedOnComment: {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        },
        likedOnTweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet"
        }
    },
    { timestamps : true}
)

export const Like = mongoose.model("Like", likeSchema)