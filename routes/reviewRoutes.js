import express from 'express'
import { authUser } from '../middlewares/authUser.js';
import { addReview, deleteReview, getAvgRating, getMovieReviews, getTopRatedMovies, getUserReviews } from '../controllers/reviewControllers.js';

const router = express.Router()

// add/update review
router.post("/add-review",authUser,addReview)

// get reviews of a movie (expects movieId as a query param)
router.get("/movie-reviews/:movieId",getMovieReviews)

// delete review (expects reviewId as a URL param)
router.delete("/delete-review/:reviewId",authUser,deleteReview)

// get avg rating of a movie (expects movieId as a query param)
router.get("/avg-rating/:movieId",getAvgRating)

//fetch movies based on ratings
router.get("/top-rated-movies",getTopRatedMovies)

// get reviews by a specific user
router.get("/user-reviews/:userId",getUserReviews);

export { router as reviewRouter };