import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

// first api controller to to get all users in the db using try block query without any condition i simply return json response
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch users!" });
  }
};

// second api controller to to get a single user and then return json response
export const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch user!" });
  }
};

// third api controller that updates the user
export const updateUser = async (req, res) => {
  const id = req.params.id; // Get the id from the URL params
  const { password, avatar, ...inputs } = req.body;

  try {
    let updatedPassword = null;
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

// third api controller to to get all users in the db
export const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    await prisma.user.delete({
      where: {
        id,
      },
    });

    res.status(200).json({ message: "User deleted " });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete user!" });
  }
};
