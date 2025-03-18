import express from 'express'
import { authUser } from '../middlewares/authUser.js';
// import { authAdmin } from '../middlewares/authAdmin.js';
import { createMovies, getallMovies, movieDetails } from '../controllers/movieController.js';
import { upload } from '../middlewares/multer.js';
// import { upload } from '../middlewares/multer.js';

const router = express.Router()

//list movies
router.get("/allMovies",getallMovies);

//create movies(admin only)
// router.post("/add-movie",authAdmin,createMovies);
router.post("/add-movie",authUser,upload.single("image"),createMovies)

router.get("/movieDetails/:movieId",movieDetails);

//edit movies
// router.put("/movies-update",authAdmin,updateMovies);

//fetch movies based on genre

//fetch movies based on ratings

export { router as movieRouter };