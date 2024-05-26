import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getChats,
  getChat,
  addChat,
  readChat,
} from "../controllers/chat.controller.js";

const router = express.Router();

// route to get all chats
router.get("/", verifyToken, getChats);

// to get a single or particular chat
router.get("/:id", verifyToken, getChat);

// to start a new chat
router.post("/", verifyToken, addChat);

// ro read or open a chat
router.put("/read/:id", verifyToken, readChat);

export default router;
