import {Router} from "express";
import userController from "../controller/userController.js";
import authmiddleware from "../middleware/authmiddleware.js";
const router = Router()


router.post("/registeruser",userController.registerUser)
router.post("/loginuser",userController.loginUser)
router.post("/getusers",userController.getAllUser)
router.get("/getuserbyid/:id",userController.getUserbyId)

// * private route
router.get("/user", authmiddleware , userController.getUser)

export default router;