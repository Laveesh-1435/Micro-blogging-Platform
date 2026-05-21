import express from "express";
import { protectRoute } from "../middleware/ProtectRoute.js";
import { followUnfollowUser, getFollowingUsers, getSuggestedUsers, getUserProfile, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.get("/following", protectRoute, getFollowingUsers);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.post("/update", protectRoute, updateUser);

export default router;