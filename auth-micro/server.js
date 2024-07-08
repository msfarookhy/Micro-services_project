import express from "express" 
import cors from "cors"
import "dotenv/config"

const app = express()
const PORT = process.env.PORT || 5001

//middleware
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())


//* Routes
import apiRouter from "./routes/apiRoute.js"

app.get("/",(req,res)=>{
    return res.json({
        message:"Helooo Microservices"
    })
})

app.use("/api",apiRouter)

app.listen(PORT,()=>{
    console.log(`Server is Listinig on ${PORT}`);
})