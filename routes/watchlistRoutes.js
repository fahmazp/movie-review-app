import express from 'express';
import { authUser } from '../middlewares/authUser.js';
import { addToWatchlist, getWatchlist, removeFromWatchlist } from '../controllers/watchlistController.js';

const router = express.Router()

// Add to watchlist
router.post("/addToWatchlist", authUser,addToWatchlist);

// Get watchlist
router.get("/viewWatchlists", authUser,getWatchlist);

// Remove from watchlist
router.delete("/remove/:movieId", authUser,removeFromWatchlist);

export { router as watchlistRouter };
