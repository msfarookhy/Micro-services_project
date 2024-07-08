import jwt from "jsonwebtoken"


const authMiddleware =(req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access Denied: No Token Provided'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);  // Debugging line to check the token contents
        req.user = decoded;
        console.log("req.user:", req.user);  // Debugging line to check req.user
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Token'
        });
    }
};
export default authMiddleware

