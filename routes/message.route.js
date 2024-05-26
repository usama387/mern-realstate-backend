import express from "express";
import { addMessage } from "../controllers/message.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// api route to add or send message
router.post("/:chatId", verifyToken, addMessage);

export default router;
