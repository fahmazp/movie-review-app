import express from 'express'
import { createMovies, getallMovies, movieDetails } from '../controllers/movieController.js';
import { upload } from '../middlewares/multer.js';
import { authAdmin } from '../middlewares/authAdmin.js';

const router = express.Router()

//list movies
router.get("/allMovies",getallMovies);

//create movies(admin only)
router.post("/add-movie",authAdmin,upload.single("image"),createMovies)

// details of a movie
router.get("/movieDetails/:movieId",movieDetails);

//edit movies
// router.put("/movies-update",authAdmin,updateMovies);

//fetch movies based on genre

//fetch movies based on ratings

export { router as movieRouter };