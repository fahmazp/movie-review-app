import express from 'express'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js'
import { apiRouter } from './routes/index.js';
import cors from 'cors'

const app = express()
const port = 3000

dotenv.config()
connectDB()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",credentials:true,methods:["GET","POST","PUT","DELETE","OPTION"]
}))

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.use("/api", apiRouter)

app.all("*", (req,res,next) => {
  res.status(404).json({message:"Endpoint does not exist!"})
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
})