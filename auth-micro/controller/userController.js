import prisma from "../config/db.config.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const registerUser = async (req,res)=>{
    try {
        const data = req.body

        const salt = bcrypt.genSaltSync(10)
        data.password = bcrypt.hashSync(data.password, salt)

        const user = await prisma.user.create({data})
        if(!user){
           return res.status(401).json({
                success:false,
                message: "User not Created"
            })
        }

      return  res.status(200).json({
            success:true,
            message:"User Created Successfully",
            data: user
        })
    } catch (error) {
        if(error.code == "P2002"){
           return res.status(401).json({
                success:false,
                message:"Email Already Exists"
            })
        }
     return   res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:error
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (user) {
            if (!bcrypt.compareSync(password, user.password)) {
                return res.status(401).json({
                    success: false,
                    message: "Password is incorrect"
                });
            }

            // Include user ID and other necessary fields in the token payload
            const tokenPayload = {
                id: user.id,
                name: user.name,
                email: user.email
            };

            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
                expiresIn: "365d"
            });

            const access_token = token;
            user.access_token = access_token;

            return res.status(200).json({
                success: true,
                message: "User Logged In Successfully",
                data: user
            });
        }

        return res.status(400).json({
            success: false,
            message: "User not found"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const getUser = async (req ,res)=>{
    try {
        const user = await req.user
        if(!user) {
            res.status(404).json({
                success:false,
                message:"user not found"
            })
        }

        return res.status(200).json({
            success:true,
            message:"user found",
            data: user
        })
    } catch (error) {
        
    }
}

const getUserbyId = async (req,res) =>{
    try {
        const id = req.query.id || req.params.id
        if(!id){
          return  res.status(401).json({
                success:false,
                message:"Id not matched"
            })
        }
        
        const user = await prisma.user.findUnique({
            where: {
                id:id
            },

            select :{
                id:true,
                name:true,
                email:true
            }
        })
    return res.status(200).json({
        success:true,
        message:"user found",
        data:user
    }) 
    } catch (error) {
       return res.status(500).json({
            success:false,
            message:"internal server Error",
            error: error.message
        })
    }

}

const getAllUser = async (req, res) => {
    const { usersIds } = req.body;

    // if (!usersIds) {
    //     return res.status(400).json({
    //         success: false,
    //         message: "Invalid or missing user IDs",
    //     });
    // }

    try {
        const users = await prisma.user.findMany({
            where: {
                id: {
                    in: usersIds,
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Users not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Users data found",
            data: users,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export default {
    registerUser,
    loginUser,
    getUser,
    getUserbyId,
    getAllUser,
}