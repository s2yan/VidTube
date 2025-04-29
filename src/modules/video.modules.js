import mongoose, { Schema } from 'mongoose';
import mongooseaggregatePaginate from 'mongoose-aggregate-paginate-v2';

const videoSchema = new Schema({
    videoFiles: {
        type: String, //cloudinary url
        required: true,
    },
    thumbnail: {
        type: String, //coudinary url
        requried: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    views: {
        type: Number,
        default: 0
    },
    duration:{
        type: Number,
        required: true,
    },
    isPublished:{
        type: Boolean,
        default: false,
    },
    owner:{
        type :Schema.Types.ObjectId,
        ref: 'User'
    }
},
{
    timeStamps: true,
}
)

videoSchema.plugin(mongooseaggregatePaginate)

export const Video = mongoose.model('Video', videoSchema)