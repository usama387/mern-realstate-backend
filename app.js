// creating the app and server listening port
import express from "express";
import cookieParser from "cookie-parser";
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import cors from "cors";
import dotenv from "dotenv";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Load environment variables from .env file
dotenv.config();
console.log(process.env.JWT_SECRET_KEY);
console.log(process.env.CLIENT_URL);

// for json responses
app.use(express.json());

// for cookies
app.use(cookieParser());

// Authentication Routes
app.use("/api/auth", authRoute);

// // Middleware test routes
app.use("/api/users", userRoute);

// // Middleware test routes
app.use("/api/test", testRoute);

// Realstate Post Routes
app.use("/api/posts", postRoute);

// Start the server
const PORT = 8700;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
