import mongoose, { Schema } from "mongoose"

const tweetSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        tweetedBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true}
)