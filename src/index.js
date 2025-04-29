import { app } from './app.js';
import connectDB from './db/index.js';

const PORT = process.env.PORT || 8001

connectDB()
.then(()=>{
    app.listen(PORT, () =>{
        console.log(`Server is listening on port : ${PORT}`)
    })
})
.catch((err) =>{
    console.log("MongoDB connection error:", err.message);
})


