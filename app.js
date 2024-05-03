// creating the app and server listening port
import express from "express";
import cookieParser from "cookie-parser";
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";
import testRoute from "./routes/test.route.js";
import cors from "cors";
import dotenv from "dotenv";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Load environment variables from .env file
dotenv.config();
console.log(process.env.JWT_SECRET_KEY);

// for json responses
app.use(express.json());

// for cookies
app.use(cookieParser());

// Realstate Post Routes
app.use("/api/posts", postRoute);

// Authentication Routes
app.use("/api/auth", authRoute);

// // Middleware test routes
app.use("/api/test", testRoute);

// Start the server
const PORT = 8700;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
