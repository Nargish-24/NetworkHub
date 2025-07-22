import Post from "../models/posts.model.js";
import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comments.model.js";
import bcrypt from "bcrypt";


export const activeCheck =async(req,res)=>{

return res.status(200).json({message:"RUNNING"})

}

export const createPost = async (req, res)=>{
        const{token}=req.body;
        try{
            const user = await User.findOne({token:token});
            if(!user){
                return res.status(404).json({message:"user Not found"})
            }
            const post = new Post({
                userId:user._id,
                body:req.body.body,
                media:req.file != undefined ? req.file.filename : "",
                filetypes: req.file != undefined ? req.file.mimetype.split("/")[1]:""
            })

            await post.save();
            return res.status(200).json({message:"Post created successfully"})
        }catch(err){
            return res.status(500).json({message:err.message})
        }
}

export const getAllPosts = async (req, res) => {
    try{
        const posts = await Post.find().populate('userId', 'name email username profilePicture');
        return res.json({posts});
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

 export const deletePost= async (req, res) => {
    const {token,post_id} = req.body;
    try{
        const user = await User.findOne({token:token})
        .select('_id');
        if(!user){
            return res.status(404).json({message:"user Not found"})
        }
        const post = await Post.findOne({ _id:post_id});
        if(!post){
            return res.status(404).json({message:"Post Not found"})
        }
        if(post.userId.toString() !== user._id.toString()){
            return res.status(401).json({message:"You are not authorized to delete this post"})
        }
        await Post.deleteOne({ _id:post_id});
        return res.json({message:"Post deleted successfully"})
}catch(err){

}
}

export const  get_comments_by_post = async (req, res) => {
    const{ post_id } = req.query;
    console.log('POST_ID', post_id)
    try{
        const post = await Post.findOne({ _id:post_id});
        if(!post){

            return res.status(404).json({message:"Post Not found"})
        }
        
        const comments= await Comment
        .find({postId:post_id})
        .populate('userId','username name ');

        return res.json(comments.reverse())
    }catch(err){
        return res.status(500).json({message:err.message})
    }

}


  export const delete_comment_of_user = async (req, res) => {
    const{token,comment_id}=req.body;
    try{
        const user = await User.findOne({token:token})
        .select('_id');
        if(!user){
            return res.status(404).json({message:"user Not found"})
        }   
        const comment = await Comment.findOne({ '_id':comment_id});
        if(!comment){
            return res.status(404).json({message:"Comment Not found"})
        }
        if(comment.userId.toString() !== user._id.toString()){
            return res.status(401).json({message:"You are not authorized to delete this comment"})
        }
        await Comment.deleteOne({ '_id':comment_id});
        return res.json({message:"Comment deleted successfully"})
    }catch(err){
        return res.status(500).json({message:err.message})

    }
}

export const increment_likes = async (req, res) => {
    const {post_id} = req.body;
    try{
        const post = await Post.findOne({ _id:post_id});
        if(!post){
            return res.status(404).json({message:"Post Not found"})
        }
        post.likes = post.likes + 1;
        await post.save();
        return res.json({message:"Post liked successfully"})
    
}catch(err){
        return res.status(500).json({message:err.message})
    }
}