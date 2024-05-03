// Before every activity in the application that requires authentication the nodejs will run this function first to verify

import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Not Authenticated!" });

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (error, payload) => {
    if (error) res.status(403).json({ message: "Token is not valid" });
    req.userId = payload.id;

    next();
  });
};
