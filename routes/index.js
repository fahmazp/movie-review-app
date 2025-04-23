import express from 'express'
import { userRouter } from './userRoutes.js'
import { movieRouter } from './movieRoutes.js'
import { reviewRouter } from './reviewRoutes.js'
import { watchlistRouter } from './watchlistRoutes.js'

const router = express.Router()

router.use("/user",userRouter)
router.use("/movie",movieRouter)
router.use("/reviews",reviewRouter)
router.use("/watchlist",watchlistRouter)

// router.use("/admin",adminRouter)
export {router as apiRouter}