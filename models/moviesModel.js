import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
    {
    title: {
        type: String, 
        required: true,
        unique: true,
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
    duration: { 
        type: String,
        required: true,
    },
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
    admin: { 
        type: mongoose.Types.ObjectId, 
        ref: "User" // Referencing User model
    },
  }, 
  { timestamps: true }
);

// Add a virtual property to format the release date
    movieSchema.virtual("formattedReleaseDate").get(function () {
    return this.releaseDate ? new Date(this.releaseDate).getFullYear().toString() : "";
  });
  
  // Ensure virtuals are included when converting the document to JSON or an object
  movieSchema.set("toJSON", { virtuals: true });
  movieSchema.set("toObject", { virtuals: true });

export const Movie = mongoose.model("Movie", movieSchema);
