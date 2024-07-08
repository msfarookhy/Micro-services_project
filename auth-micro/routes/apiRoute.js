import {Router} from "express";
import userRouter from "./userRoute.js"

const app = Router()

app.use("/",userRouter)


export default app