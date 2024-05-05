// This files auth routes rest apis
import express from "express";
// import { verifyToken } from "../middleware/verifyToken.js";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

// api route to get all users in the db
router.get("/", getUsers);

// api route to get a single user in the db
router.get("/:id",  getUser);

// api route to update a single user in the db
router.put("/:id",  updateUser);

// api route to delete a single user in the db
router.delete("/:id",  deleteUser);

export default router;
