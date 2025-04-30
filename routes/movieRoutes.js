import express from 'express'
import { createMovies, getallMovies, movieDetails, updateMovies } from '../controllers/movieController.js';
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
router.put("/update-movie/:movieId",authAdmin,upload.single("image"),updateMovies)

//fetch movies based on genre

export { router as movieRouter };