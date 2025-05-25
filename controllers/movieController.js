import { cloudinaryInstance } from "../config/cloudinary.js";
import { Movie } from "../models/moviesModel.js";

export const getallMovies = async (req, res, next) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    const matchFilter = {};
    if (type) {
      matchFilter.media_type = type.toLowerCase();
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [moviesList, totalMovies] = await Promise.all([
      Movie.aggregate([
        { $match: matchFilter },
        {
          $lookup: {
            from: "reviews",
            localField: "_id",
            foreignField: "movieId",
            as: "reviews",
          },
        },
        {
          $addFields: {
            avgRating: { $avg: "$reviews.rating" },
          },
        },
        {
          $addFields: {
            avgRating: { $ifNull: ["$avgRating", 0] },
          },
        },
        {
          $project: {
            reviews: 0,
            videos: 0,
            duration: 0,
          },
        },
        { $sort: { title: 1 } },
        { $skip: skip },
        { $limit: parseInt(limit) },
      ]),
      Movie.countDocuments(matchFilter),
    ]);

    res.status(200).json({
      data: moviesList,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalMovies / parseInt(limit)),
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Internal server error",
    });
  }
};

// export const getallMovies = async (req, res, next) => {
//     try {
//       const { type } = req.query;
  
//       const matchFilter = {};
//       if (type) {
//         matchFilter.media_type = type.toLowerCase();
//       }
  
//       const moviesList = await Movie.aggregate([
//         { $match: matchFilter },
//         {
//           $lookup: {
//             from: "reviews",
//             localField: "_id",
//             foreignField: "movieId",
//             as: "reviews",
//           },
//         },
//         {
//           $addFields: {
//             avgRating: { $avg: "$reviews.rating" },
//           },
//         },
//         {
//           $addFields: {
//             avgRating: { $ifNull: ["$avgRating", 0] }, 
//           },
//         },
//         {
//           $project: {
//             reviews: 0,
//             videos: 0,
//             duration: 0,
//           },
//         },

//         {
//           $sort: { title: 1 },
//         }

//       ]);
  
//       if (!moviesList || moviesList.length === 0) {
//         return res.status(404).json({ message: "No movies found!" });
//       }
  
//       res.status(200).json({
//         data: moviesList,
//         message: "Movies with avg ratings listed!",
//       });
//     } catch (error) {
//       res.status(error.statusCode || 500).json({
//         message: error.message || "Internal server error",
//       });
//     }
//   };
  

export const createMovies = async (req,res,next) => {
    try {        
        
        // collect movie data
        const {title,description,genre,releaseDate,duration,videos,media_type,cast,directedBy}=req.body;
        const adminId = req.user.id            
        
        // data validation
        if (!title || !description || !genre || !releaseDate || !duration || !media_type) {
            return res.status(400).json({message:"Please fill in all required fields"})
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded!" });
          }
        // Upload image to cloudinary
        const uploadResult = await cloudinaryInstance.uploader.upload(req.file.path)
        // console.log("cloudinary response====",uploadResult);
                
        // Fallbacks if not provided
        // const parsedCast = Array.isArray(cast) && cast.length > 0 ? cast : ["NA"];
        const parsedCast =
        typeof cast === "string"
          ? cast.split(",").map((actor) => actor.trim()).filter(Boolean)
          : Array.isArray(cast) && cast.length > 0
          ? cast
          : ["NA"];
        const safeDirectedBy = directedBy?.trim() || "NA";        

        //storing to db and saving it
        const newMovie = new Movie({ 
            title,
            description,
            genre,
            releaseDate,
            duration,
            videos,
            image:uploadResult.url, // Store Cloudinary URL
            // imagePublicId: uploadResult.public_id,
            media_type,
            cast: parsedCast,
            directedBy: safeDirectedBy,
            admin: adminId
        })
        await newMovie.save()

        res.json({ data:newMovie, message:"New movie created!"})

    } catch (error) {
       res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
}

export const movieDetails = async (req,res,next) => {
    try {        
        
        //fetching specific movie with it's id
        const {movieId} = req.params

        const movieDetails = await Movie.findById(movieId)
        
        if (!movieDetails) {
            return res.status(404).json({ message: "Movie not found" });
        }

        res.json({ data:movieDetails, message:"Movie details fetched!"})

    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
}

// export const updateMovies = async (req, res) => {
//     try {

//         const { movieId } = req.params; // Get movie ID from URL
//         const updatedData = req.body; // Data to update

//         // Find and update the movie
//         const updatedMovie = await Movie.findByIdAndUpdate(movieId, updatedData, { new: true, runValidators: true });

//         if (!updatedMovie) {
//             return res.status(404).json({ message: "Movie not found" });
//         }

//         res.status(200).json({ data: updatedMovie, message: "Movie updated successfully!" });
//     } catch (error) {
//         console.error(error);
//         res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
//     }
// }

export const updateMovies = async (req, res) => {
    try {
        const { movieId } = req.params; // Get movie ID from URL
        let updatedData = req.body;

        // Convert form-data fields into JSON format
        if (typeof updatedData === "object") {
            updatedData = JSON.parse(JSON.stringify(updatedData));
        }

        // If an image is uploaded, upload it to Cloudinary
        if (req.file) {
            const uploadResult = await cloudinaryInstance.uploader.upload(req.file.path)
            console.log("cloudinary update response====",uploadResult);
            updatedData.image = uploadResult.url; // Store Cloudinary URL
        }

        // Normalize missing fields
          if (!updatedData.cast || updatedData.cast.length === 0) {
          updatedData.cast = ["NA"];
        }
        if (!updatedData.directedBy) {
          updatedData.directedBy = "NA";
        }

        // Find and update the movie
        const updatedMovie = await Movie.findByIdAndUpdate(
            movieId,
            { $set: updatedData },
            { new: true, runValidators: true }
        );

        if (!updatedMovie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        res.status(200).json({ data: updatedMovie, message: "Movie updated successfully!" });

    } catch (error) {
        console.error(error);
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const deleteMovie = async (req, res, next) => {

  try {
    const { movieId } = req.params;
    const movieDelete = await Movie.findById(movieId);
    if (!movieDelete) {
        return res.status(404).json({ message: "Movie not found" });
    }

    // Optional: remove image from cloudinary
    // if your cloudinary upload returns a public_id and you save it
    // const publicId = movie.imagePublicId;
    // if (publicId) {
    //   await cloudinaryInstance.uploader.destroy(publicId);
    // }

    await Movie.findByIdAndDelete(movieId);
    res.status(200).json({ message: "Movie deleted successfully!" });

  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
}


export const getTopActionMovies = async (req, res) => {
  
  try {
    const genreFilter = "Action";
    const movies = await Movie.aggregate([
      {
        $match: {
          genre: { $regex: genreFilter, $options: "i" },
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "movieId",
          as: "reviews",
        },
      },
      {
        $addFields: {
          avgRating: { $avg: "$reviews.rating" },
        },
      },
      {
        $addFields: {
          avgRating: { $ifNull: ["$avgRating", 0] },
        },
      },
      {
        $project: {
          reviews: 0,
          videos: 0,
          duration: 0,
        },
      },
      {
        $sort: { avgRating: -1 },
      },
      { $limit: 10 },
    ]);

    res.status(200).json({ data: movies, message: "Top action movies listed!" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};