import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser"

const app = express()

//MiddleWares

app.use(express.json())
app.use(express.urlencoded({ extended : true}))
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentails: true
}))
app.use(cookieParser())


//Import  Router
import healthCheckRouter from './routes/healthCheck.routes.js'
import registerUserRouter from './routes/registerUser.routes.js'

app.use('/api/v1/healthcheck', healthCheckRouter)
app.use('/api/v1/register', registerUserRouter)


export { app }