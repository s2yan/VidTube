import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();

//Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentails: true
}))
app.use(express.json({ limit : '16kb'}));
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())



app.get("/", (req, res) =>{
    res.status(200).send("Welcome to the home page")
})

//Importing routes
import healthCheckRoutes from './routes/healthCheck.routes.js';
import userRegistrationRoutes from './routes/registerUser.routes.js';


app.use('/api/v1/user', userRegistrationRoutes)
app.use("/api/v1/healthcheck", healthCheckRoutes)

export { app };