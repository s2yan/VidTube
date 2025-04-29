import mongoose, { Schema } from 'mongoose';
import mongooseaggregatePaginate from 'mongoose-aggregate-paginate-v2';

const commentSchema = new Schema(
    {
        video:{
            type: Schema.Types.ObjectId,
            ref: 'Video',
        },
        tweet:{
            type: Schema.Types.ObjectId,
            ref: 'Tweet',
        },
        commentedBy:{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    },
    {
        timestamps: true,
    }
)

commentSchema.plugin(mongooseaggregatePaginate)
export const Comment = mongoose.model('Comment', commentSchema)
