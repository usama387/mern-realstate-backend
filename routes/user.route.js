// This files auth routes rest apis
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  savePost,
} from "../controllers/user.controller.js";

const router = express.Router();

// api route to get all users in the db
router.get("/", getUsers);

// api route to get a single user in the db
router.get("/:id", verifyToken, getUser);

// api route to update a single user in the db
router.put("/:id", verifyToken, updateUser);

// api route to delete a single user in the db
router.delete("/:id", verifyToken, deleteUser);

router.post("/save", verifyToken, savePost);

export default router;
