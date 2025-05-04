import { Watchlist } from "../models/watchlistsModel.js";

export const addToWatchlist = async (req, res) => {
  try {
    const { movieId, title, posterUrl } = req.body;
    const userId = req.user.id; // From auth middleware

    // Check if user already has a watchlist
    let watchlist = await Watchlist.findOne({ userId });

    if (!watchlist) {
      watchlist = new Watchlist({
        userId,
        movies: [{ movieId, title, posterUrl }],
      });
    } else {
      // If watchlist exists, check if movie already added
      const movieExists = watchlist.movies.find((movie) => movie.movieId === movieId);
      if (movieExists) {
        return res.status(400).json({ message: "Movie already in watchlist" });
      }
      watchlist.movies.push({ movieId, title, posterUrl });
    }

    await watchlist.save();
    res.status(200).json({ message: "Movie added to watchlist successfully", watchlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add movie to watchlist" });
  }
};

export const getWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const watchlist = await Watchlist.findOne({ userId });

    if (!watchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }

    // res.status(200).json(watchlist.movies);
    res.status(200).json({ watchlist: watchlist.movies,
      createdAt: watchlist.createdAt
     });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch watchlist" });
  }
};

export const removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { movieId } = req.params;

    const watchlist = await Watchlist.findOne({ userId });

    if (!watchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }

    // Filter out the movie to remove
    watchlist.movies = watchlist.movies.filter((movie) => movie.movieId !== movieId);

    await watchlist.save();

    res.status(200).json({ message: "Movie removed from watchlist successfully", watchlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to remove movie from watchlist" });
  }
};
