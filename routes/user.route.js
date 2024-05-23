// This files auth routes rest apis
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  savePost,
  profilePosts,
} from "../controllers/user.controller.js";

const router = express.Router();

// api route to get all users in the db
router.get("/", getUsers);

// api route to get a single user in the db
// router.get("/:id", verifyToken, getUser);

// api route to update a single user in the db
router.put("/:id", verifyToken, updateUser);

// api route to delete a single user in the db
router.delete("/:id", verifyToken, deleteUser);

// api route to save posts for the logged in user
router.post("/save", verifyToken, savePost);

//api route
router.get("/profilePosts", verifyToken, profilePosts);

export default router;
