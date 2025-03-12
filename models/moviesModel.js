import mongoose, { Schema } from "mongoose";

const movieSchema = new Schema(
    {
    title: {
        type: String, 
        required: true
    },
    description: { 
        type: String
    },
    genre: [{ 
        type: String 
    }],
    releaseDate: {
         type: Date
    },
    ratings: [{ 
        userId: mongoose.Schema.Types.ObjectId, 
        rating: Number,
    }],
    avgRating: { 
        type: Number, default: 0 
    },
    reviews: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review" 
    }]
  }, 
  { timestamps: true }
);


export const Movie = mongoose.model("Movie", movieSchema);
