import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

// first controller to get all posts
export const getPosts = async (req, res) => {
  // this variable is being used to get query and pass results in listPage loader to fetch desired posts
  const query = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,

        // since bedroom no is an integer
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || 0,
          lte: parseInt(query.maxPrice) || 10000000,
        },
      },
    });

    // sending my posts as response after running the query
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

// second controller to get all single post details, selected user data to display and information either the post is saved or not

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    // Fetch all the details required to show on a single page
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    const token = req.cookies?.token;
    const secretKey = "tF6VQ3R6jaXbBUsAAt/lcAu+0JzRVRTvpB2c6LqHfvE=";

    if (token) {
      jwt.verify(token, secretKey, async (err, payload) => {
        if (!err) {
          const saved = await prisma.savedPost.findUnique({
            where: {
              userId_postId: {
                postId: id,
                userId: payload.id,
              },
            },
          });
          return res
            .status(200)
            .json({ ...post, isSaved: saved ? true : false });
        } else {
          console.log("Token verification error:", err);
        }
        return res.status(200).json({ ...post, isSaved: false });
      });
    } else {
      return res.status(200).json({ ...post, isSaved: false });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get post" });
  }
};

// third controller to add Post
export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });

    res.status(200).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create post" });
  }
};

// fourth controller to update Post
export const updatePost = async (req, res) => {
  try {
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update post" });
  }
};

// fifth controller to delete Post
export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete post" });
  }
};
