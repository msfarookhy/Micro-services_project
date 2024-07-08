import express from "express"
import postController from "../controller/postController.js"
import authMiddleware from "../middleware/authmiddleware.js"
const router = express.Router()

router.get("/getposts", postController.getPosts )
router.post("/createpost", authMiddleware, postController.createPost )

export default router