import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import postRoutes from './routes/posts.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();    

const app=express();

app.use(cors());   
app.use(express.json());
app.use(postRoutes); 
app.use(userRoutes);
app.use(express.static('uploads'));


const start = async()=>{

    const connectDB = await mongoose.connect("mongodb+srv://NargishBano:nargish12345@apnaproconnect.abayq5q.mongodb.net/") 
       
    
    app.listen(9080,()=>{
        console.log("server is running on the port 9080");
    })
} 

start();