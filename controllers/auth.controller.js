import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

// first controller for registeration
export const register = async (req, res) => {
  // destructuring items from request body
  const { username, email, password } = req.body;

  try {
    // hashing password with bcrypt method in 10 digits
    const hashedPassword = await bcrypt.hash(password, 10);

    // creating new user with prisma and mongodb
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    console.log(newUser);

    // sending response to client
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status((500).json({ message: "Failed to create user!" }));
  }
};

// second controller for login and cookie json web token authentication
export const login = async (req, res) => {
  // destructuring items from request body
  const { username, password } = req.body;

  try {
    // finding user with prisma and mongodb using username
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    // when user not found
    if (!user) {
      res.status(401).json({ message: "Invalid Credentials!" });
    }

    // comparing password and sending response
    const isPasswordValid = bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Password does not match!" });
    }

    // not a good way to get cookies
    // res.setHeader("Set-Cookie", "test=" + "myValue").json("success");

    // cookies expire timing approx 1 week
    const age = 1000 * 60 * 60 * 24 * 7;

    // creating a json web token for user
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    // except for the password all information will be sent as response
    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        // secure: true,
        maxAge: age,
      })
      .status(200)
      .json(userInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create user!" });
  }
};

// first controller for logout
export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Sucessfull" });
};
