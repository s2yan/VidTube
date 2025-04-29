import mongoose, { Schema } from 'mongoose';

const subscriptionSchema = new Schema(
    {
        subsscriber:{
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        subscribedTo:{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true,
    }
)

export const Subsctiption = mongoose.model('Subscription', subscriptionSchema)