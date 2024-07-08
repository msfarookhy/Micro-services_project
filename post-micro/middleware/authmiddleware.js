import jwt from "jsonwebtoken"


const authMiddleware = async (req, res, next) => {
const authHeader= req.headers.authorization;


    if (!authHeader) {
        res.status(401).json({
            message: "No Token found",
            success: false
        });
    }
        const token = authHeader

    try {
         jwt.verify(token, process.env.JWT_SECRET,(err , data)=>{
            if(err){
                res.status(401).json({
                    success:false,
                    message:"unauthorized token"
                })
            }
            req.user = data;
            next()
            });

    } catch (error) {
        console.log(error);
    }
};

export default authMiddleware

