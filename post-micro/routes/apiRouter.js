import express from "express"

import postRoute from "./postRoute.js"

const app = express()

app.use("/",postRoute)

export default app