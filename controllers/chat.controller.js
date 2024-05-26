import prisma from "../lib/prisma.js";

// first controller to get all the chats
export const getChats = async (req, res) => {
  //   extracting token from user made request
  const tokenUserId = req.userId;
  try {
    //   getting all the chats from the database for this user
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "Failed to get Chats" });
  }
};

// second controller to get a single the chat
export const getChat = async (req, res) => {
  // Extract the user ID from the request (assumed to be authenticated)
  const tokenUserId = req.userId;

  try {
    // Find a specific chat based on the chat ID from request parameters
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId], // Check if the user is part of the chat
        },
      },
      // Include the chat messages in the response, ordered by creation time (ascending)
      include: {
        messages: {
          orderBy: {
            createdAt: "asc", // Order messages by creation time, oldest first
          },
        },
      },
    });

    // Update the chat to mark it as seen by the requesting user
    await prisma.chat.update({
      where: {
        id: req.params.id, // Use the same chat ID from request parameters
      },
      data: {
        seenBy: {
          push: [tokenUserId], // Add the user ID to the seenBy array
        },
      },
    });

    // Send the retrieved chat as a JSON response with a 200 status code
    res.status(200).json(chat);
  } catch (error) {
    // Log any errors to the console for debugging
    console.log(error);
    // Send a 500 status code with an error message if something goes wrong
    res.status(500).json({ message: "Failed to get this chat" });
  }
};

// first controller to add a new chat
export const addChat = async (req, res) => {
  // getting token from user request
  const tokenUserId = req.userId;
  try {
    // new chat will be created using logged in user token and receiver id
    const newChat = await prisma.chat.create({
      data: { userIDs: [tokenUserId, req.body.receiverId] },
    });

    res.status(200).json(newChat);
  } catch (error) {
    res.status(500).json({ message: "Failed to add this Chat" });
  }
};

// fourth controller to read a chat
export const readChat = async (req, res) => {
  // Extract the user ID from the request (assumed to be authenticated)
  const tokenUserId = req.userId;

  try {
    // Update the chat to mark it as read by the requesting user
    const updatedChat = await prisma.chat.update({
      where: {
        id: req.params.id, // Use the chat ID from request parameters
        userIDs: {
          hasSome: [tokenUserId], // Ensure the user is part of the chat
        },
      },
      data: {
        seenBy: {
          set: [tokenUserId], // Set the seenBy array to contain only the current user ID
        },
      },
    });

    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(500).json({ message: "Failed to read Chat" });
  }
};
