// This files auth routes rest apis
import express from "express";
import { login, logout, register } from "../controllers/auth.controller.js";

const router = express.Router();

// this route posts the user details in register controller function to register user
router.post("/register", register);

// this route posts login credentials in login controller function to verify
router.post("/login", login);

// this route posts logout instructions in logout controller function to logout
router.post("/logout", logout);

export default router;
