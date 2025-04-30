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

import healthCheckRoutes from './routes/healthcheck.routes.js';
app.use("/api/v1/healthcheck", healthCheckRoutes)

export { app };