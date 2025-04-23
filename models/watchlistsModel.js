import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema(
  {
    userId: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true },
    movies: [
      {
        movieId: { type: String, required: true }, // or Number if your movieId is a TMDB id
        title: { type: String },
        posterUrl: { type: String },
      }
    ],
  },
  { timestamps: true }
);

export const Watchlist = mongoose.model('Watchlist', watchlistSchema);