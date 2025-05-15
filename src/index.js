import { app } from './app.js'
import dotenv from 'dotenv'
import { connectDB } from './DB/index.js'

dotenv.config({path : './src/.env'})
const PORT = process.env.PORT || 8000

app.get('/', (req, res)=>{
  res.status(201).send("Hello from server")
})

app.get("/search", (req, res) =>{
  const query =  req.query.q
  res.send(`Searching for ${query}`)
})

connectDB()
.then(()=>
  app.listen(PORT, ()=>{
    console.log(`Server is listening on localhost:${PORT}`)
  })
)
.catch(err => console.log(`DB Connection error: ${err.message}`))


