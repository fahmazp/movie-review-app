import express from 'express'
import dotenv from 'dotenv';

import { connectDB } from './config/db.js'
import { apiRouter } from './routes/index.js';
const app = express()
const port = 3000

dotenv.config()
connectDB()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hi Wammalla cinema')
})

app.use("/api", apiRouter)

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
})