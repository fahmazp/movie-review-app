import mongoose, { Schema } from "mongoose";

const movieSchema = new Schema(
    {
    title: {
        type: String, 
        required: true
    },
    description: { 
        type: String,
        required: true
    },
    genre: { 
        type: String,
        required: true,
    },
    releaseDate: {
         type: Date,
         required: true,
    },
    avgRating: { 
        type: Number, default: 0 
    },
    // ratings: [{ 
    //     userId: mongoose.Schema.Types.ObjectId, 
    //     rating: Number,
    // }],

    // reviews: [{ 
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Review" 
    // }],
    videos: {
        type: String,
    },
    image: {
        type: String,
        default: "https://static1.colliderimages.com/wordpress/wp-content/uploads/sharedimages/2024/04/fight-club-movie-poster.jpg",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
  }, 
  { timestamps: true }
);


export const Movie = mongoose.model("Movie", movieSchema);
