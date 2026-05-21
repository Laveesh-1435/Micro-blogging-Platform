import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, "../.env") });

import express from "express";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import connectMongoDB from "./db/connectMongoDB.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/notifications", notificationRoutes);

// In production: serve the built React frontend
if (process.env.NODE_ENV === "production") {
  const frontendDist = path.resolve(__dirname, "../frontend/dist");
  app.use(express.static(frontendDist));

  // Any route that is NOT an API route returns the React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack || err.message);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

connectMongoDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }); 