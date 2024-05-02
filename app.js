// creating the app and server listening port
import express from "express";
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";

const app = express();

app.use(express.json());

app.use("/api/posts", postRoute);

app.use("/api/auth", authRoute);

app.listen(8900, () => {
  console.log("The app server is running");
});
