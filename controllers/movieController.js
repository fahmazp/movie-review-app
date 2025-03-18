import { cloudinaryInstance } from "../config/cloudinary.js";
import { Movie } from "../models/moviesModel.js";


export const getallMovies = async (req,res,next) => {
    try {        
        
        //fetching all movies
        const moviesList = await Movie.find().select("-genre -videos")
        res.json({ data:moviesList, message:"Movies listed!"})

    } catch (error) {
       res.status(error.statusCode || 500).json({ message: error.message || "Internal server" });
    }
}

export const createMovies = async (req,res,next) => {
    try {        
        
        // collect movie data
        const {title,description,genre,releaseDate,videos}=req.body;

        const adminId = req.user.id            
        
        // data validation
        if (!title || !description || !genre || !releaseDate) {
            return res.status(400).json({message:"Please fill in all required fields"})
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded!" });
          }
        // Upload image to cloudinary
        const uploadResult = await cloudinaryInstance.uploader.upload(req.file.path)
        console.log("cloudinary response====",uploadResult);
                

        //storing to db
        const newMovie = new Movie({ 
            title,
            description,
            genre,
            releaseDate,
            videos,
            image:uploadResult.url, // Store Cloudinary URL
            admin: adminId
        })
        await newMovie.save()

        res.json({ data:newMovie, message:"New movie created!"})

    } catch (error) {
       res.status(error.statusCode || 500).json({ message: error.message || "Internal server" });
    }
}

export const movieDetails = async (req,res,next) => {
    try {        
        
        //fetching specific movie with it's id
        const {movieId} = req.params

        const movieDetails = await Movie.findById(movieId)
        
        res.json({ data:movieDetails, message:"Movie details fetched!"})

    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server" });
    }
}