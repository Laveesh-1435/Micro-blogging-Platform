import dotenv from "dotenv";
dotenv.config({ path: ".env" });
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("JWT exists:", !!process.env.JWT_SECRET);
console.log("Cloud exists:", !!process.env.CLOUDINARY_CLOUD_NAME);

import express from "express";

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js"
import notificationRoutes from "./routes/notification.route.js"

import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary";

cloudinary.config({
   cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
   api_key:process.env.CLOUDINARY_API_KEY, 
   api_secret:process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT =process.env.PORT || 5000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/post",postRoutes);
app.use("/api/notifications",notificationRoutes);

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
    connectMongoDB();
});