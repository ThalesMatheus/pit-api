import express from 'express'
import userRoutes from './routes/users.js'
import cors from 'cors'
import dotenv from 'dotenv'
import fileUpload from 'express-fileupload'
dotenv.config()
const app = express()
app.use(fileUpload())
app.use(express.json())
app.use(cors())
app.use('/', userRoutes)
app.use('/uploads', express.static('uploads'));
app.listen(8800)
