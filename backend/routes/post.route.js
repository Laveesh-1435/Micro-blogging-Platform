import express from "express";
import { protectRoute } from "../middleware/ProtectRoute.js";
import {
	commentOnPost,
	createPost,
	deletePost,
	getAllPosts,
	getFollowingPosts,
	getLikedPosts,
	getUserPosts,
	likeUnlikePost,
	repostPost,
	bookmarkPost,
	getTrendingHashtags,
	getPostsByHashtag,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", protectRoute, getAllPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/likes/:id", protectRoute, getLikedPosts);
router.get("/user/:username", protectRoute, getUserPosts);
router.get("/trending", protectRoute, getTrendingHashtags);
router.get("/hashtag/:tag", protectRoute, getPostsByHashtag);
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/repost/:id", protectRoute, repostPost);
router.post("/bookmark/:id", protectRoute, bookmarkPost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/:id", protectRoute, deletePost);

export default router;