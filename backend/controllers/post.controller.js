import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
	try {
		const { text } = req.body;
		let { img } = req.body;
		const userId = req.user._id.toString();

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		if (!text && !img) {
			return res.status(400).json({ error: "Post must have text or image" });
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		const newPost = new Post({ user: userId, text, img });
		await newPost.save();
		res.status(201).json(newPost);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
		console.log("Error in createPost controller: ", error);
	}
};

export const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) return res.status(404).json({ error: "Post not found" });

		if (post.user.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "You are not authorized to delete this post" });
		}

		if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await Post.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: "Post deleted successfully" });
	} catch (error) {
		console.log("Error in deletePost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const commentOnPost = async (req, res) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;

		if (!text) return res.status(400).json({ error: "Text field is required" });

		const post = await Post.findById(postId);
		if (!post) return res.status(404).json({ error: "Post not found" });

		post.comments.push({ user: userId, text });
		await post.save();
		res.status(200).json(post);
	} catch (error) {
		console.log("Error in commentOnPost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const likeUnlikePost = async (req, res) => {
	try {
		const userId = req.user._id;
		const { id: postId } = req.params;

		const post = await Post.findById(postId);
		if (!post) return res.status(404).json({ error: "Post not found" });

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
			const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
			res.status(200).json(updatedLikes);
		} else {
			post.likes.push(userId);
			await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
			await post.save();

			const notification = new Notification({ from: userId, to: post.user, type: "like" });
			await notification.save();

			res.status(200).json(post.likes);
		}
	} catch (error) {
		console.log("Error in likeUnlikePost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// ── REPOST ──────────────────────────────────────────────────────────────────
export const repostPost = async (req, res) => {
	try {
		const userId = req.user._id;
		const { id: postId } = req.params;

		const post = await Post.findById(postId);
		if (!post) return res.status(404).json({ error: "Post not found" });

		const alreadyReposted = post.reposts.includes(userId);

		if (alreadyReposted) {
			await Post.updateOne({ _id: postId }, { $pull: { reposts: userId } });
			const updatedReposts = post.reposts.filter((id) => id.toString() !== userId.toString());
			res.status(200).json(updatedReposts);
		} else {
			post.reposts.push(userId);
			await post.save();
			res.status(200).json(post.reposts);
		}
	} catch (error) {
		console.log("Error in repostPost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// ── BOOKMARK ─────────────────────────────────────────────────────────────────
export const bookmarkPost = async (req, res) => {
	try {
		const userId = req.user._id;
		const { id: postId } = req.params;

		const post = await Post.findById(postId);
		if (!post) return res.status(404).json({ error: "Post not found" });

		const alreadyBookmarked = post.bookmarks.includes(userId);

		if (alreadyBookmarked) {
			await Post.updateOne({ _id: postId }, { $pull: { bookmarks: userId } });
			const updatedBookmarks = post.bookmarks.filter((id) => id.toString() !== userId.toString());
			res.status(200).json(updatedBookmarks);
		} else {
			post.bookmarks.push(userId);
			await post.save();
			res.status(200).json(post.bookmarks);
		}
	} catch (error) {
		console.log("Error in bookmarkPost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// ── TRENDING HASHTAGS ────────────────────────────────────────────────────────
export const getTrendingHashtags = async (req, res) => {
	try {
		// Get all posts from last 7 days
		const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
		const posts = await Post.find({ createdAt: { $gte: sevenDaysAgo }, text: { $exists: true, $ne: "" } });

		const hashtagCount = {};
		const hashtagRegex = /#(\w+)/g;

		for (const post of posts) {
			if (!post.text) continue;
			const matches = post.text.matchAll(hashtagRegex);
			for (const match of matches) {
				const tag = match[1].toLowerCase();
				hashtagCount[tag] = (hashtagCount[tag] || 0) + 1;
			}
		}

		const trending = Object.entries(hashtagCount)
			.map(([hashtag, count]) => ({ hashtag, count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 10); // top 10

		res.status(200).json(trending);
	} catch (error) {
		console.log("Error in getTrendingHashtags controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// ── POSTS BY HASHTAG ─────────────────────────────────────────────────────────
export const getPostsByHashtag = async (req, res) => {
	try {
		const { tag } = req.params;
		const regex = new RegExp(`#${tag}`, "i");

		const posts = await Post.find({ text: { $regex: regex } })
			.sort({ createdAt: -1 })
			.populate({ path: "user", select: "-password" })
			.populate({ path: "comments.user", select: "-password" });

		res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getPostsByHashtag controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getAllPosts = async (req, res) => {
	try {
		const posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate({ path: "user", select: "-password" })
			.populate({ path: "comments.user", select: "-password" });

		res.status(200).json(posts.length === 0 ? [] : posts);
	} catch (error) {
		console.log("Error in getAllPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getLikedPosts = async (req, res) => {
	const userId = req.params.id;
	try {
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
			.populate({ path: "user", select: "-password" })
			.populate({ path: "comments.user", select: "-password" });

		res.status(200).json(likedPosts);
	} catch (error) {
		console.log("Error in getLikedPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getFollowingPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const feedPosts = await Post.find({ user: { $in: user.following } })
			.sort({ createdAt: -1 })
			.populate({ path: "user", select: "-password" })
			.populate({ path: "comments.user", select: "-password" });

		res.status(200).json(feedPosts);
	} catch (error) {
		console.log("Error in getFollowingPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getUserPosts = async (req, res) => {
	try {
		const { username } = req.params;
		const user = await User.findOne({ username });
		if (!user) return res.status(404).json({ error: "User not found" });

		const posts = await Post.find({ user: user._id })
			.sort({ createdAt: -1 })
			.populate({ path: "user", select: "-password" })
			.populate({ path: "comments.user", select: "-password" });

		res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getUserPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};