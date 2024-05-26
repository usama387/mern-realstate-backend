import prisma from "../lib/prisma.js";

// controller to add send messages
export const addMessage = async (req, res) => {
  // getting my user id
  const tokenUserId = req.userId;

  // getting the chat id
  const chatId = req.params.chatId;

  // now getting the text
  const text = req.body.text;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    if (!chat) return res.status(404).json({ message: "Chat not found!" });

    const message = await prisma.message.create({
      data: {
        text,
        chatId,
        userId: tokenUserId,
      },
    });

    await prisma.chat.update({
      where: {
        id: chatId,
      },

      data: {
        seenBy: [tokenUserId],
        lastMessage: text,
      },
    });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: "Failed to add the Message" });
  }
};
