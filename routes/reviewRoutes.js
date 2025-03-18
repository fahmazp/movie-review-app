import express from 'express'
import { authUser } from '../middlewares/authUser.js';
import { addReview, deleteReview, getAvgRating, getMovieReviews } from '../controllers/reviewControllers.js';


const router = express.Router()

// add/update review
router.post("/add-review",authUser,addReview)

// get reviews of a movie
router.get("/movie-reviews",getMovieReviews)

// delete review
router.get("/delete-review",authUser,deleteReview)

// get avg rating of a movie
router.get("/avg-rating",getAvgRating)

// get reviews by a specific user

export { router as reviewRouter };