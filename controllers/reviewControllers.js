import { Movie } from "../models/moviesModel.js"
import { Review } from "../models/reviewsModel.js"


export const addReview = async (req,res,next) => {
    try {        
        
        // collect data from frontend
        const {movieId, rating, comment}=req.body

        // fetching id from middleware
        const userId = req.user.id

        // validate if the movie exists
        const movie = await Movie.findById(movieId)
        if (!movie) {
            return res.status(404).json({message:"Movie not found"})
        }

        if (rating>5 || rating<1) {
            return res.status(400).json({message:"Invalid rating.Must be a number within the given range"})
        }

        // create/update review
        const review = await Review.findOneAndUpdate(
            { userId, movieId },
            { rating, comment },
            { new:true, upsert:true } //upsert -> insert+update
        )

        res.status(201).json({ data:review, message:"Review added!"})

    } catch (error) {
       res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
}

export const getMovieReviews = async (req, res) => {
    try {
        // collect movie id from params
        const { movieId } = req.params;

        const reviews = await Review.find({ movieId }).populate("userId", "name").sort({ createdAt: -1 });

        if (!reviews.length) {
            return res.status(404).json({ message: "No reviews found for this movie" });
        }

        res.status(200).json({ data: reviews, message: "Movie reviews fetched" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const deleteReview = async (req, res) => {
    try {
     
        // collect review id from params
        const { reviewId } = req.params;
        const userId = req.user.id

        const review = await Review.findOneAndDelete({ _id: reviewId, userId })

        if (!review) {
            return res.status(404).json({ message: "Review not found or not authorized" });
        }

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
}

export const getAvgRating = async (req, res) => {
    try {
     
        // collect movie Id from params
        const { movieId } = req.params;

        // fetching all reviews of the specific movie with movieId
        const reviews = await Review.find({ movieId })

        if (!reviews.length) {
            return res.status(404).json({ message: "No reviews found for this movie" });
        }

        // calculating avg rating of the movie
        const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

        res.status(200).json({ data:avgRating, message: "Average rating fetched for the movie" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
}

