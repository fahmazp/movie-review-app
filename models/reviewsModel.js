import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    movieId: {
        type: Schema.Types.ObjectId,
        ref: "Movie",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 700,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Review = model("Review", reviewSchema);


