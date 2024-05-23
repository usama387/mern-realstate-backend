import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

// First controller to get all users
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get users!" });
  }
};

// second controller to get single user
export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get user!" });
  }
};

// second controller to update single user
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, avatar, ...inputs } = req.body;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  let updatedPassword = null;
  try {
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar }),
      },
    });

    const { password: userPassword, ...rest } = updatedUser;

    res.status(200).json(rest);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update users!" });
  }
};

// Fourth controller to delete a single user
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete users!" });
  }
};

// Fifth controller to save a Post
export const savePost = async (req, res) => {
  // taking post id from request body
  const postId = req.body.postId;

  // taking userId id from user made request
  const tokenUserId = req.userId;

  try {
    // locating post to be saved for the user with the help of user token and post id
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });

    // If the post is already exits it deletes it using where object otherwise creates it using data parameter
    if (savedPost) {
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      res.status(200).json({ message: "Post removed from Saved❤" });
    } else {
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId,
        },
      });
      res.status(200).json({ message: "Post Saved Successfully" });
    }
  } catch (error) {
    console.log(error);
  }
};

// sixth controller to fetch saved posts on profile page
export const profilePosts = async (req, res) => {
  // taking userId id from user made request
  const tokenUserId = req.params.userId;

  try {
    // fetching all posts created by user with its token
    const userPosts = await prisma.post.findMany({
      where: { userId: tokenUserId },
    });

    // fetching all saved posts by the user with the help of user token
    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: { post: true },
    });

    // mapping and getting the post only
    const savedPosts = saved.map((item) => item.post);

    // sending all posts as response in list and then saved posts in the saved section
    res.status(200).json({ userPosts, savedPosts });
  } catch (error) {
    res.status(500).json({ message: "Failed to get Profile Posts" });
  }
};
