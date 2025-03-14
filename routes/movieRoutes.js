import express from 'express'
import { authAdmin } from '../middlewares/authAdmin.js';

const router = express.Router()

//create movies
router.post("/movies-create",authAdmin,createMovies);

//fetch movies
router.get("/movies",moviesList);

//edit movies
router.put("/movies-update",authAdmin,updateMovies);


export { router as movieRouter };