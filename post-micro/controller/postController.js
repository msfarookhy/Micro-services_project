import prisma from "../config/db.config.js"
import axios from "axios"

const getPosts =async (req,res)=>{

    try {
        const posts = await prisma.post.findMany({ })
       
// * method 1 not scalable way

        // let   postsWithUsers = await Promise.all(
        //     posts.map(async (post)=>{

        //         const res = await axios.get(
        //             `${process.env.AUTH_MICRO_URL}/api/getuserbyid/${post.user_id}`)
        //         return {
        //             ...post,
        //             ...res.data
        //         }
        //     })
        // )

        // method 2 scalable code

        // let userIds = []
        // posts.forEach((ele)=>{
        //     userIds.push(ele.user_id)
        // })

        // fetch

        // const response = await axios.post
        // (`${process.env.AUTH_MICRO_URL}/api/getusers`,  userIds)
        
        // console.log("🚀 ~ getPosts ~ response:", response)
    
        // const users = response.data.data

        // let postsWithUsers = await Promise.all(
        //     posts.map((post)=>{
        //         const user = users.find(item =>   item.id ==post.user_id)
        //             return{
        //                 ...post,
        //                 user
        //             }
        //         })
                
        // )

        //  *Method 3 more optimsied
        let userIds = []
        posts.forEach((ele)=>{
            userIds.push(ele.user_id)
        })

        const response = await axios.post
        (`${process.env.AUTH_MICRO_URL}/api/getusers`,  userIds)
        
        console.log("🚀 ~ getPosts ~ response:", response)
    
        const user = response.data.data
        const users = {}

        user.forEach(ele => {
            users[ele.id] = ele            
        });

        let postsWithUsers = await Promise.all(
            posts.map((ele)=>{
                const user = users[ele.user_id]

                return {
                    ...ele,
                    user
                }

            })
        )
        if(!postsWithUsers){
            return   res.status(401).json({
                   success:false,
                   message:"No user Id Provided",
               })
           }


        if(!posts){
         return   res.status(401).json({
                success:false,
                message:"Bad Request",
            })
        }
        return res.status(200).json({
            success:       true,
            message:    "post found",
            data:            postsWithUsers,
        })
    } catch (error) {
     return   res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:error.message
        })
    }

}

const createPost = async (req, res) => {
    try {
        const authUser = req.user;
        // const authUserName = req.user.name
        const { title, content } = req.body;

        if (!authUser.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User ID not found"
            });
        }

        const post = await prisma.post.create({
            data: {
                user_id: authUser.id,
                title,
                content,
            }
        });

        return res.status(200).json({
            success: true,
            message: "Post Created Successfully",
            data: post
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export default {
    getPosts,
    createPost

}